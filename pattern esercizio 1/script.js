const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resize);
resize();

const controls = new Controls();
const grid = new Grid();

let module = new Module();
let randomSpeeds = [];
let strokePhases = [];
let strokeSpeeds = [];

let draggingAttractor = -1;

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // check attractor drag first
  for (let i = 0; i < controls.state.attractors.length; i++) {
    const a = controls.state.attractors[i];
    if (Math.hypot(mx - a.x, my - a.y) < 15) {
      draggingAttractor = i;
      return;
    }
  }

  // check module selection
  if (grid.lastPositions) {
    let best = -1;
    let bestDist = 20;
    for (const p of grid.lastPositions) {
      const d = Math.hypot(mx - p.x, my - p.y);
      if (d < bestDist) {
        bestDist = d;
        best = p.index;
      }
    }
    if (best >= 0) {
      controls.state.selectedIndex = best;
      controls.state.perModuleRotations[best] ??= 0;
      const p = grid.lastPositions.find(pp => pp.index === best);
      const el = document.getElementById('selectedModuleControls');
      const label = document.getElementById('selectedModuleLabel');
      const slider = document.getElementById('perModuleRotation');
      el.style.display = '';
      label.textContent = `Riga ${p.row + 1}, Colonna ${p.col + 1}`;
      slider.value = controls.state.perModuleRotations[best];
      controls._notify();
      return;
    }
  }

  // clicked empty area — deselect
  controls.state.selectedIndex = -1;
  document.getElementById('selectedModuleControls').style.display = 'none';
  controls._notify();
});

canvas.addEventListener('mousemove', e => {
  if (draggingAttractor === -1) return;
  const rect = canvas.getBoundingClientRect();
  controls.syncAttractorFromCanvas(draggingAttractor, e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('mouseup', () => {
  draggingAttractor = -1;
});

canvas.addEventListener('mouseleave', () => {
  draggingAttractor = -1;
});

function syncFromControls(state) {
  module.bgColor = state.bgColor;
  module.rotation = state.snap90 ? Math.round(state.rotation / 90) * 90 : state.rotation;
  module.scale = state.scale;
  module.offsetX = state.offsetX;
  module.offsetY = state.offsetY;
  module.arcs = state.arcs;
  module.perModuleRotations = state.perModuleRotations;
  module.snap90 = state.snap90;
  module.tilingMode = state.tilingMode;
  module.alternateRotation = state.alternateRotation;
  module.randomRotation = state.randomRotation;
  module.randomSpeed = state.randomSpeed;
  module.randomStroke = state.randomStroke;
  module.maxStrokeVar = state.maxStrokeVar;

  if (state.randomStroke) {
    const total = state.rows * state.cols * 3;
    if (strokePhases.length !== total) {
      strokePhases = Array.from({ length: total }, () => Math.random() * Math.PI * 2);
      strokeSpeeds = Array.from({ length: total }, () => (Math.random() * 2 - 1) * 0.05);
    }
  } else {
    strokePhases = [];
    strokeSpeeds = [];
  }

  if (state.randomRotation) {
    const total = state.rows * state.cols;
    if (randomSpeeds.length !== total) {
      randomSpeeds = Array.from({ length: total }, () =>
        (Math.random() * 2 - 1) * state.randomSpeed
      );
    }
  } else {
    randomSpeeds = [];
  }

  grid.rows = state.rows;
  grid.cols = state.cols;
  grid.moduleSize = state.moduleSize;
  grid.gutter = state.gutter;
  grid.attractors = state.attractors;
}

controls.onChange(syncFromControls);
syncFromControls(controls.state);

function draw() {
  if (module.randomRotation && randomSpeeds.length > 0) {
    const total = grid.rows * grid.cols;
    for (let i = 0; i < total; i++) {
      if (!controls.state.perModuleRotations[i]) controls.state.perModuleRotations[i] = 0;
      controls.state.perModuleRotations[i] = (controls.state.perModuleRotations[i] + randomSpeeds[i]) % 360;
    }
  }

  if (module.randomStroke && strokePhases.length > 0) {
    const total = grid.rows * grid.cols;
    const strokes = [];
    for (let i = 0; i < total; i++) {
      const moduleStrokes = [];
      for (let a = 0; a < 3; a++) {
        const idx = i * 3 + a;
        strokePhases[idx] = (strokePhases[idx] + strokeSpeeds[idx]) % (Math.PI * 2);
        const base = controls.state.arcs[a].strokeWidth;
        const animated = Math.max(0.5, base + Math.sin(strokePhases[idx]) * module.maxStrokeVar);
        moduleStrokes.push(animated);
      }
      strokes.push(moduleStrokes);
    }
    module.animatedStrokes = strokes;
  } else {
    module.animatedStrokes = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = module.bgColor || '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  grid.draw(ctx, module, canvas.width, canvas.height);

  // highlight selected module
  if (controls.state.selectedIndex >= 0 && grid.lastPositions) {
    const p = grid.lastPositions.find(pp => pp.index === controls.state.selectedIndex);
    if (p) {
      const s = grid.moduleSize;
      ctx.save();
      ctx.strokeStyle = '#6af';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(p.x - s / 2, p.y - s / 2, s, s);
      ctx.restore();
    }
  }

  requestAnimationFrame(draw);
}

draw();
