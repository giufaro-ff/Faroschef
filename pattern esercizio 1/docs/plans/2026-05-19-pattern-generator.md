# Pattern Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static HTML/JS/CSS pattern generator with quarter-circle module, grid layout, and attractor-based grid distortion.

**Architecture:** Hybrid approach — Canvas API for rendering, HTML/CSS for controls panel. Module, Grid, and Controls as separate JS classes for clean separation.

**Tech Stack:** Vanilla JS, HTML5 Canvas, CSS3 (no libraries)

---

### Task 1: HTML structure + CSS layout

**Files:**
- Create: `index.html`
- Create: `style.css`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pattern Generator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <canvas id="canvas"></canvas>
    <aside id="controls">
      <fieldset>
        <legend>Modulo</legend>
        <label>Rotazione <input type="range" id="rotation" min="0" max="360" value="0"></label>
        <label>Scala <input type="range" id="scale" min="0.1" max="3" step="0.01" value="1"></label>
        <label>Offset X <input type="range" id="offsetX" min="-100" max="100" value="0"></label>
        <label>Offset Y <input type="range" id="offsetY" min="-100" max="100" value="0"></label>
        <hr>
        <label>Arco 1 colore <input type="color" id="color1" value="#ff0000"></label>
        <label>Arco 1 spessore <input type="range" id="stroke1" min="0.5" max="20" step="0.5" value="2"></label>
        <label>Arco 2 colore <input type="color" id="color2" value="#00ff00"></label>
        <label>Arco 2 spessore <input type="range" id="stroke2" min="0.5" max="20" step="0.5" value="2"></label>
        <label>Arco 3 colore <input type="color" id="color3" value="#0000ff"></label>
        <label>Arco 3 spessore <input type="range" id="stroke3" min="0.5" max="20" step="0.5" value="2"></label>
      </fieldset>
      <fieldset>
        <legend>Griglia</legend>
        <label>Righe <input type="range" id="rows" min="1" max="20" value="6"></label>
        <label>Colonne <input type="range" id="cols" min="1" max="20" value="8"></label>
        <label>Modulo (px) <input type="range" id="moduleSize" min="20" max="200" value="80"></label>
        <label>Gutter <input type="range" id="gutter" min="0" max="50" value="10"></label>
      </fieldset>
      <fieldset>
        <legend>Attrattori</legend>
        <button id="addAttractor">+ Aggiungi attrattore</button>
        <div id="attractorList"></div>
      </fieldset>
    </aside>
  </div>
  <script src="module.js"></script>
  <script src="grid.js"></script>
  <script src="controls.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write style.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #1a1a1a;
  color: #eee;
  overflow: hidden;
  height: 100vh;
}

#app {
  display: flex;
  height: 100vh;
}

#canvas {
  flex: 1;
  display: block;
}

#controls {
  width: 280px;
  background: #222;
  padding: 16px;
  overflow-y: auto;
  border-left: 1px solid #333;
}

fieldset {
  border: 1px solid #444;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

legend {
  padding: 0 6px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

label input[type="range"] {
  width: 100%;
  margin-top: 2px;
}

label input[type="color"] {
  display: block;
  margin-top: 2px;
  border: none;
  background: none;
  width: 100%;
  height: 30px;
  cursor: pointer;
}

hr {
  border: none;
  border-top: 1px solid #333;
  margin: 8px 0;
}

button {
  width: 100%;
  padding: 8px;
  background: #3a3a3a;
  color: #eee;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

button:hover {
  background: #4a4a4a;
}

.attractor-item {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 8px;
  font-size: 0.8rem;
}

.attractor-item input[type="number"] {
  width: 60px;
  padding: 3px;
  background: #333;
  color: #eee;
  border: 1px solid #555;
  border-radius: 3px;
}

.attractor-item button {
  width: auto;
  padding: 3px 8px;
  background: #502;
  border-color: #a33;
}
```

- [ ] **Step 3: Verify files exist**

Run: `ls -la "/Users/giuliafaro/Desktop/workshop_05/pattern esercizio/index.html" "/Users/giuliafaro/Desktop/workshop_05/pattern esercizio/style.css"`
Expected: both files exist

---

### Task 2: Module class — draw 3 concentric arcs

**Files:**
- Create: `module.js`

- [ ] **Step 1: Write the module.js file**

```js
class Module {
  constructor(config = {}) {
    this.rotation = config.rotation ?? 0;
    this.scale = config.scale ?? 1;
    this.offsetX = config.offsetX ?? 0;
    this.offsetY = config.offsetY ?? 0;
    this.arcs = config.arcs ?? [
      { color: '#ff0000', strokeWidth: 2 },
      { color: '#00ff00', strokeWidth: 2 },
      { color: '#0000ff', strokeWidth: 2 },
    ];
  }

  draw(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.translate(this.offsetX, this.offsetY);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);

    const radii = [size * 0.25, size * 0.50, size * 1.00];

    for (let i = 0; i < 3; i++) {
      const arc = this.arcs[i];
      ctx.beginPath();
      // start from top (north) of the circle, sweep to left (west)
      // bottom-right center: sweep from -π/2 to -π (counterclockwise)
      ctx.arc(0, 0, radii[i], -Math.PI / 2, -Math.PI);
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = arc.strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
}
```

- [ ] **Step 2: Verify the file**

Run: `wc -l "/Users/giuliafaro/Desktop/workshop_05/pattern esercizio/module.js"`
Expected: line count around 30-40

---

### Task 3: Grid class — layout + attractor distortion

**Files:**
- Create: `grid.js`

- [ ] **Step 1: Write grid.js**

```js
class Grid {
  constructor(config = {}) {
    this.rows = config.rows ?? 6;
    this.cols = config.cols ?? 8;
    this.moduleSize = config.moduleSize ?? 80;
    this.gutter = config.gutter ?? 10;
    this.attractors = [];
  }

  addAttractor(x, y, radius = 200, strength = 50) {
    this.attractors.push({ x, y, radius, strength });
  }

  removeAttractor(index) {
    this.attractors.splice(index, 1);
  }

  updateAttractor(index, props) {
    Object.assign(this.attractors[index], props);
  }

  getModulePositions(canvasWidth, canvasHeight) {
    const cellSize = this.moduleSize + this.gutter;
    const offsetX = (canvasWidth - this.cols * cellSize + this.gutter) / 2;
    const offsetY = (canvasHeight - this.rows * cellSize + this.gutter) / 2;
    const positions = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let px = offsetX + c * cellSize + this.moduleSize / 2;
        let py = offsetY + r * cellSize + this.moduleSize / 2;

        let dx = 0, dy = 0;
        for (const a of this.attractors) {
          const dist = Math.hypot(px - a.x, py - a.y);
          if (dist < a.radius && dist > 0) {
            const strength = a.strength * (1 - dist / a.radius);
            dx += ((a.x - px) / dist) * strength;
            dy += ((a.y - py) / dist) * strength;
          }
        }

        positions.push({ x: px + dx, y: py + dy });
      }
    }

    return positions;
  }

  draw(ctx, module, canvasWidth, canvasHeight) {
    const positions = this.getModulePositions(canvasWidth, canvasHeight);
    for (const pos of positions) {
      module.draw(ctx, pos.x, pos.y, this.moduleSize);
    }
  }
}
```

- [ ] **Step 2: Verify the file**

Run: `wc -l grid.js`
Expected: line count ~60

---

### Task 4: Controls class — bind UI to state

**Files:**
- Create: `controls.js`

- [ ] **Step 1: Write controls.js**

```js
class Controls {
  constructor() {
    this.state = {
      rotation: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      arcs: [
        { color: '#ff0000', strokeWidth: 2 },
        { color: '#00ff00', strokeWidth: 2 },
        { color: '#0000ff', strokeWidth: 2 },
      ],
      rows: 6,
      cols: 8,
      moduleSize: 80,
      gutter: 10,
      attractors: [],
    };
    this.listeners = [];
    this._init();
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify() {
    for (const fn of this.listeners) fn(this.state);
  }

  _bind(id, key, transform = v => v) {
    const el = document.getElementById(id);
    if (!el) return;
    const update = () => {
      this.state[key] = transform(el.value);
      this._notify();
    };
    el.addEventListener('input', update);
  }

  _bindAttractor(index) {
    const container = document.getElementById('attractorList');
    const div = document.createElement('div');
    div.className = 'attractor-item';
    div.innerHTML = `
      <span>A${index + 1}</span>
      <input type="number" class="ax" value="${this.state.attractors[index].x}" step="1">
      <input type="number" class="ay" value="${this.state.attractors[index].y}" step="1">
      <input type="number" class="ar" value="${this.state.attractors[index].radius}" step="5" min="10" max="800" placeholder="R">
      <input type="number" class="as" value="${this.state.attractors[index].strength}" step="5" min="-500" max="500" placeholder="S">
      <button class="remove">X</button>
    `;
    const inputs = div.querySelectorAll('input');
    const onUpdate = () => {
      this.state.attractors[index] = {
        x: +inputs[0].value,
        y: +inputs[1].value,
        radius: +inputs[2].value,
        strength: +inputs[3].value,
      };
      this._notify();
    };
    inputs.forEach(inp => inp.addEventListener('input', onUpdate));
    div.querySelector('.remove').addEventListener('click', () => {
      this.state.attractors.splice(index, 1);
      this._renderAttractors();
      this._notify();
    });
    container.appendChild(div);
  }

  _renderAttractors() {
    document.getElementById('attractorList').innerHTML = '';
    for (let i = 0; i < this.state.attractors.length; i++) {
      this._bindAttractor(i);
    }
  }

  _init() {
    this._bind('rotation', 'rotation', Number);
    this._bind('scale', 'scale', Number);
    this._bind('offsetX', 'offsetX', Number);
    this._bind('offsetY', 'offsetY', Number);
    this._bind('color1', 'arcs', v => { this.state.arcs[0].color = v; return this.state.arcs; }, true);
    this._bind('stroke1', 'arcs', v => { this.state.arcs[0].strokeWidth = +v; return this.state.arcs; }, true);
    this._bind('color2', 'arcs', v => { this.state.arcs[1].color = v; return this.state.arcs; }, true);
    this._bind('stroke2', 'arcs', v => { this.state.arcs[1].strokeWidth = +v; return this.state.arcs; }, true);
    this._bind('color3', 'arcs', v => { this.state.arcs[2].color = v; return this.state.arcs; }, true);
    this._bind('stroke3', 'arcs', v => { this.state.arcs[2].strokeWidth = +v; return this.state.arcs; }, true);
    this._bind('rows', 'rows', Number);
    this._bind('cols', 'cols', Number);
    this._bind('moduleSize', 'moduleSize', Number);
    this._bind('gutter', 'gutter', Number);

    document.getElementById('addAttractor').addEventListener('click', () => {
      this.state.attractors.push({ x: 400, y: 300, radius: 200, strength: 50 });
      this._renderAttractors();
      this._notify();
    });
  }
}
```

Wait - the `_bind` call for color/stroke has different signature. Let me fix this to be cleaner.

- [ ] **Step 2: Write controls.js (fixed)**

```js
class Controls {
  constructor() {
    this.state = {
      rotation: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      arcs: [
        { color: '#ff0000', strokeWidth: 2 },
        { color: '#00ff00', strokeWidth: 2 },
        { color: '#0000ff', strokeWidth: 2 },
      ],
      rows: 6,
      cols: 8,
      moduleSize: 80,
      gutter: 10,
      attractors: [],
    };
    this.listeners = [];
    this._init();
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify() {
    for (const fn of this.listeners) fn(this.state);
  }

  _init() {
    document.getElementById('rotation').addEventListener('input', e => {
      this.state.rotation = +e.target.value;
      this._notify();
    });
    document.getElementById('scale').addEventListener('input', e => {
      this.state.scale = +e.target.value;
      this._notify();
    });
    document.getElementById('offsetX').addEventListener('input', e => {
      this.state.offsetX = +e.target.value;
      this._notify();
    });
    document.getElementById('offsetY').addEventListener('input', e => {
      this.state.offsetY = +e.target.value;
      this._notify();
    });
    document.getElementById('color1').addEventListener('input', e => {
      this.state.arcs[0].color = e.target.value;
      this._notify();
    });
    document.getElementById('stroke1').addEventListener('input', e => {
      this.state.arcs[0].strokeWidth = +e.target.value;
      this._notify();
    });
    document.getElementById('color2').addEventListener('input', e => {
      this.state.arcs[1].color = e.target.value;
      this._notify();
    });
    document.getElementById('stroke2').addEventListener('input', e => {
      this.state.arcs[1].strokeWidth = +e.target.value;
      this._notify();
    });
    document.getElementById('color3').addEventListener('input', e => {
      this.state.arcs[2].color = e.target.value;
      this._notify();
    });
    document.getElementById('stroke3').addEventListener('input', e => {
      this.state.arcs[2].strokeWidth = +e.target.value;
      this._notify();
    });
    document.getElementById('rows').addEventListener('input', e => {
      this.state.rows = +e.target.value;
      this._notify();
    });
    document.getElementById('cols').addEventListener('input', e => {
      this.state.cols = +e.target.value;
      this._notify();
    });
    document.getElementById('moduleSize').addEventListener('input', e => {
      this.state.moduleSize = +e.target.value;
      this._notify();
    });
    document.getElementById('gutter').addEventListener('input', e => {
      this.state.gutter = +e.target.value;
      this._notify();
    });

    document.getElementById('addAttractor').addEventListener('click', () => {
      const canvas = document.getElementById('canvas');
      this.state.attractors.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 200,
        strength: 50,
      });
      this._renderAttractors();
      this._notify();
    });
  }

  _renderAttractors() {
    const container = document.getElementById('attractorList');
    container.innerHTML = '';
    this.state.attractors.forEach((a, i) => {
      const div = document.createElement('div');
      div.className = 'attractor-item';
      div.innerHTML = `
        A${i + 1}
        X<input type="number" class="ax" value="${a.x}" step="1">
        Y<input type="number" class="ay" value="${a.y}" step="1">
        R<input type="number" class="ar" value="${a.radius}" step="5" min="10" max="800">
        S<input type="number" class="as" value="${a.strength}" step="5" min="-500" max="500">
        <button>X</button>
      `;
      const inputs = div.querySelectorAll('input');
      const onUpdate = () => {
        this.state.attractors[i] = {
          x: +inputs[0].value,
          y: +inputs[1].value,
          radius: +inputs[2].value,
          strength: +inputs[3].value,
        };
        this._notify();
      };
      inputs.forEach(inp => inp.addEventListener('input', onUpdate));
      div.querySelector('button').addEventListener('click', () => {
        this.state.attractors.splice(i, 1);
        this._renderAttractors();
        this._notify();
      });
      container.appendChild(div);
    });
  }

  syncAttractorFromCanvas(index, x, y) {
    if (this.state.attractors[index]) {
      this.state.attractors[index].x = x;
      this.state.attractors[index].y = y;
      this._renderAttractors();
      this._notify();
    }
  }
}
```

- [ ] **Step 3: Verify file**

Run: `wc -l controls.js`
Expected: ~130-150 lines

---

### Task 5: Script.js — orchestration + event loop

**Files:**
- Create: `script.js`

- [ ] **Step 1: Write script.js**

```js
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

let draggingAttractor = -1;

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  for (let i = 0; i < controls.state.attractors.length; i++) {
    const a = controls.state.attractors[i];
    if (Math.hypot(mx - a.x, my - a.y) < 15) {
      draggingAttractor = i;
      return;
    }
  }
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
  module.rotation = state.rotation;
  module.scale = state.scale;
  module.offsetX = state.offsetX;
  module.offsetY = state.offsetY;
  module.arcs = state.arcs;
  grid.rows = state.rows;
  grid.cols = state.cols;
  grid.moduleSize = state.moduleSize;
  grid.gutter = state.gutter;
  grid.attractors = state.attractors;
}

controls.onChange(syncFromControls);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  grid.draw(ctx, module, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}

draw();
```

- [ ] **Step 2: Verify file**

Run: `wc -l script.js`
Expected: ~55 lines

---

### Task 6: Final verification

**Files:**
- None (verification only)

- [ ] **Step 1: Check all files exist and have content**

Run:
```bash
ls -la index.html style.css module.js grid.js controls.js script.js
```

Expected: all 6 files exist, non-empty

- [ ] **Step 2: Manual review of the render loop**

Open `index.html` in a browser. Verify:
1. Canvas fills the viewport, controls panel on the right
2. Grid of quarter-circle arcs renders correctly (3 concentric arcs per cell)
3. Sliders update the pattern in real time
4. Adding an attractor deforms the grid
5. Dragging an attractor on the canvas repositions it
