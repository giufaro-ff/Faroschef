# Sigaretta Combustione Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-file HTML page that animates the word "Sigaretta" (rotated 90°) burning from top to bottom — letters dissolve into smoke particles that transform into ash.

**Architecture:** Canvas 2D with a custom particle system. Text rasterized on off-screen canvas. Each pixel becomes a particle with states TEXT → SMOKE → ASH → GONE. A combustion front sweeps downward activating particles. requestAnimationFrame loop handles updates and rendering. 6 slider controls in a sidebar.

**Tech Stack:** Vanilla JS, HTML5 Canvas 2D, CSS

---

### Task 1: HTML skeleton and layout

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML structure**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sigaretta — Combustione Tipografica</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      display: flex;
      height: 100vh;
      overflow: hidden;
      font-family: 'Helvetica Neue', Arial, sans-serif;
    }
    #canvas-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #canvas {
      display: block;
    }
    #sidebar {
      width: 260px;
      background: #111;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-left: 1px solid #222;
    }
    #sidebar label {
      color: #ccc;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    #sidebar input[type="range"] {
      width: 100%;
      background: #333;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 2px;
      outline: none;
    }
    #sidebar input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
    }
    #sidebar input[type="color"] {
      width: 100%;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    #play-btn {
      padding: 12px;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    #play-btn:hover {
      background: #ddd;
    }
    #sidebar .value {
      color: #888;
      font-size: 11px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div id="canvas-container">
    <canvas id="canvas"></canvas>
  </div>
  <div id="sidebar">
    <label>
      Font Size (px)
      <input type="range" id="font-size" min="40" max="300" value="120">
      <span class="value" id="font-size-val">120</span>
    </label>
    <label>
      Stroke
      <input type="range" id="stroke" min="0" max="20" value="2" step="0.5">
      <span class="value" id="stroke-val">2</span>
    </label>
    <label>
      Colore Testo
      <input type="color" id="text-color" value="#ffffff">
    </label>
    <label>
      Colore Fumo
      <input type="color" id="smoke-color" value="#888888">
    </label>
    <label>
      Colore Cenere
      <input type="color" id="ash-color" value="#444444">
    </label>
    <button id="play-btn">▶ START</button>
  </div>
  <script>
    // JS will go here
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser to verify layout**

Run: `open index.html` (or manual check)
Expected: Black canvas area + dark sidebar with 6 controls

---

### Task 2: Canvas setup and text rasterization

**Files:**
- Modify: `index.html` (replace the empty `<script>` with the JS)

- [ ] **Step 1: Add canvas sizing and off-screen text rendering**

Replace the empty script block with:

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');

let W, H;
let particles = [];
let combustionFront = 0;
let isPlaying = false;
let isComplete = false;
let animationId = null;

const WORD = 'Sigaretta';
const FONT_FAMILY = '"Helvetica Neue", Arial, sans-serif';

const WORD_LENGTH = WORD.length;

function getConfig() {
  return {
    fontSize: parseInt(document.getElementById('font-size').value),
    stroke: parseFloat(document.getElementById('stroke').value),
    textColor: document.getElementById('text-color').value,
    smokeColor: document.getElementById('smoke-color').value,
    ashColor: document.getElementById('ash-color').value,
  };
}

function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  W = container.clientWidth;
  H = container.clientHeight;
  canvas.width = W;
  canvas.height = H;
  document.body.style.height = window.innerHeight + 'px';
}

function rasterizeText() {
  const config = getConfig();
  const maxDim = Math.max(W, H);

  offCanvas.width = maxDim;
  offCanvas.height = maxDim;

  offCtx.clearRect(0, 0, maxDim, maxDim);
  offCtx.fillStyle = '#000';
  offCtx.fillRect(0, 0, maxDim, maxDim);

  offCtx.save();
  offCtx.translate(maxDim / 2, maxDim / 2);
  offCtx.rotate(Math.PI / 2);
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.font = config.stroke > 0
    ? `bold ${config.fontSize}px ${FONT_FAMILY}`
    : `${config.fontSize}px ${FONT_FAMILY}`;
  offCtx.fillStyle = '#fff';
  if (config.stroke > 0) {
    offCtx.lineWidth = config.stroke;
    offCtx.strokeStyle = '#fff';
    offCtx.strokeText(WORD, 0, 0);
  }
  offCtx.fillText(WORD, 0, 0);
  offCtx.restore();

  const imageData = offCtx.getImageData(0, 0, maxDim, maxDim);
  const data = imageData.data;

  particles = [];
  const centerX = W / 2;
  const centerY = H / 2;
  const offset = (maxDim - Math.max(W, H)) / 2;
  const scale = maxDim / Math.max(W, H);

  for (let y = 0; y < maxDim; y++) {
    for (let x = 0; x < maxDim; x++) {
      const idx = (y * maxDim + x) * 4;
      const alpha = data[idx + 3];
      if (alpha > 128) {
        const px = x - offset;
        const py = y - offset;
        particles.push({
          x: px,
          y: py,
          origX: px,
          origY: py,
          vx: 0,
          vy: 0,
          size: config.stroke > 0 ? config.stroke + 0.5 : 1.5,
          opacity: 1,
          state: 'TEXT',
          age: 0,
          color: '#ffffff',
        });
      }
    }
  }
}
```

- [ ] **Step 2: Wire resize + init on page load**

Add at the bottom of the script:

```javascript
window.addEventListener('resize', () => {
  resizeCanvas();
  rasterizeText();
  drawInitial();
});

resizeCanvas();
rasterizeText();
drawInitial();
```

- [ ] **Step 3: Add `drawInitial()` function**

Add before the resize event listener:

```javascript
function drawInitial() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
}
```

- [ ] **Step 4: Verify text renders in browser**

Open index.html. Expected: "Sigaretta" rotated 90° in white on black, centered.

---

### Task 3: Particle states and physics

**Files:**
- Modify: `index.html` (add physics functions inside the script)

- [ ] **Step 1: Add particle lifecycle update function**

Add these functions after `drawInitial`:

```javascript
const STATE_TEXT = 'TEXT';
const STATE_SMOKE = 'SMOKE';
const STATE_ASH = 'ASH';
const STATE_GONE = 'GONE';

const SMOKE_DURATION = 120;  // frames (~2s at 60fps)
const ASH_DURATION = 120;    // frames (~2s)

function updateParticles(config, front, dt) {
  const totalParticles = particles.length;
  const frontProgress = front;

  particles.forEach((p, i) => {
    const particleProgress = i / totalParticles;

    if (p.state === STATE_TEXT && particleProgress <= frontProgress) {
      p.state = STATE_SMOKE;
      p.age = 0;
      p.vx = (Math.random() - 0.5) * 2;
      p.vy = -(Math.random() * 1.5 + 0.5);
      p.color = config.textColor;
    }

    p.age++;

    if (p.state === STATE_SMOKE) {
      const t = p.age / SMOKE_DURATION;
      p.vy += (Math.random() - 0.5) * 0.05;
      p.vx += (Math.random() - 0.5) * 0.05;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.size += 0.03;
      p.opacity = Math.max(0, 1 - t * 0.6);
      lerpColor(p, config.textColor, config.smokeColor, t);

      if (p.age >= SMOKE_DURATION) {
        p.state = STATE_ASH;
        p.age = 0;
        p.vy = Math.random() * 0.8 + 0.3;
        p.vx = (Math.random() - 0.5) * 0.5;
      }
    } else if (p.state === STATE_ASH) {
      const t = p.age / ASH_DURATION;
      p.vy += 0.01;
      p.x += p.vx;
      p.y += p.vy;
      p.size = Math.max(0.5, p.size - 0.01);
      p.opacity = Math.max(0, 1 - t);
      lerpColor(p, config.smokeColor, config.ashColor, t);

      if (p.age >= ASH_DURATION || p.opacity <= 0.01) {
        p.state = STATE_GONE;
      }
    }
  });
}

function lerpColor(p, fromHex, toHex, t) {
  t = Math.max(0, Math.min(1, t));
  const fr = parseInt(fromHex.slice(1,3), 16);
  const fg = parseInt(fromHex.slice(3,5), 16);
  const fb = parseInt(fromHex.slice(5,7), 16);
  const tr = parseInt(toHex.slice(1,3), 16);
  const tg = parseInt(toHex.slice(3,5), 16);
  const tb = parseInt(toHex.slice(5,7), 16);
  const r = Math.round(fr + (tr - fr) * t);
  const g = Math.round(fg + (tg - fg) * t);
  const b = Math.round(fb + (tb - fb) * t);
  p.color = `rgb(${r},${g},${b})`;
}
```

- [ ] **Step 2: Verify logic by inspection**

Check: particles start TEXT, transition to SMOKE when front passes them, age through SMOKE_DURATION, transition to ASH, age through ASH_DURATION, then GONE. Color lerp follows each transition.

---

### Task 4: Animation loop and rendering

**Files:**
- Modify: `index.html` (add animation loop and render function)

- [ ] **Step 1: Add render function and animation loop**

Add before the event listeners:

```javascript
function render(config) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  particles.forEach(p => {
    if (p.state === STATE_GONE) return;
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

let lastTime = 0;

function animate(timestamp) {
  const dt = lastTime ? (timestamp - lastTime) / 16.67 : 1;
  lastTime = timestamp;

  if (isPlaying && !isComplete) {
    const config = getConfig();
    combustionFront += 0.002 * dt;
    if (combustionFront >= 1) {
      combustionFront = 1;
      isComplete = true;
    }
    updateParticles(config, combustionFront, dt);
    render(config);
  } else if (isComplete) {
    render(getConfig());
    isPlaying = false;
    document.getElementById('play-btn').textContent = '⟳ RESET';
    return;
  }

  animationId = requestAnimationFrame(animate);
}

animate(0);
```

- [ ] **Step 2: Wire the Play button**

Add after the animate function:

```javascript
document.getElementById('play-btn').addEventListener('click', () => {
  if (isComplete) {
    resetAnimation();
  } else {
    isPlaying = !isPlaying;
    document.getElementById('play-btn').textContent = isPlaying ? '⏸ PAUSE' : '▶ START';
  }
});

function resetAnimation() {
  isComplete = false;
  isPlaying = false;
  combustionFront = 0;
  document.getElementById('play-btn').textContent = '▶ START';
  rasterizeText();
  drawInitial();
}
```

- [ ] **Step 3: Test the animation**

Open index.html, click START. Expected: particles activate from top (letter S area) downward, drift up as smoke, turn gray, fall as ash, fade out.

---

### Task 5: Slider controls

**Files:**
- Modify: `index.html` (wire all range/color inputs)

- [ ] **Step 1: Add input event listeners for all sliders**

Add after the play button listener:

```javascript
document.getElementById('font-size').addEventListener('input', function() {
  document.getElementById('font-size-val').textContent = this.value;
  if (!isPlaying && !isComplete) {
    rasterizeText();
    drawInitial();
  }
});

document.getElementById('stroke').addEventListener('input', function() {
  document.getElementById('stroke-val').textContent = this.value;
  if (!isPlaying && !isComplete) {
    rasterizeText();
    drawInitial();
  }
});

document.getElementById('text-color').addEventListener('input', function() {
  if (!isPlaying && !isComplete) {
    rasterizeText();
    drawInitial();
  }
});

document.getElementById('smoke-color').addEventListener('input', () => {});
document.getElementById('ash-color').addEventListener('input', () => {});
```

- [ ] **Step 2: Verify all sliders work**

Open index.html. Change font size, stroke, text color — text should update immediately (when not playing). Smoke/ash color changes should affect particles mid-animation.

---

### Task 6: Smooth rendering and polish

**Files:**
- Modify: `index.html` (add imageSmoothing, initial color application)

- [ ] **Step 1: Improve drawInitial to use config colors**

Update `drawInitial`:

```javascript
function drawInitial() {
  const config = getConfig();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = config.textColor;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}
```

- [ ] **Step 2: Disable image smoothing for crisp pixels**

Add at the bottom of `resizeCanvas`:

```javascript
ctx.imageSmoothingEnabled = false;
```

- [ ] **Step 3: Full file verification**

Open index.html. Verify:
- Word renders rotated 90°, white on black
- Clicking START begins combustion from letter S downward
- Particles drift up as smoke (gray), then fall as ash (dark gray)
- When complete, clicking RESET restores initial state
- Sliders change font size, stroke, colors in real-time
