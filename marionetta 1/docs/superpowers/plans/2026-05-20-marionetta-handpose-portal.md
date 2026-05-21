# Marionetta — Handpose Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web app that tracks hand landmarks via webcam and renders a green Rick & Morty-style portal when the five fingertips cluster within 30px.

**Architecture:** Single vanilla HTML/CSS/JS page. Webcam video fed into TensorFlow.js MediaPipe hand-pose-detection. Results rendered on a fullscreen `<canvas>` 2D element.

**Tech Stack:** Vanilla JS, TensorFlow.js hand-pose-detection (CDN), MediaPipe Hands runtime, Canvas 2D.

---

### Task 1: Project scaffold + CDN imports

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `script.js`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>marionetta</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <video id="video" playsinline></video>
  <canvas id="canvas"></canvas>

  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>
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

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

video {
  display: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 3: Write script.js skeleton**

```js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let detector = null;
let portalActive = false;
let portalOpacity = 0;
const FINGERTIP_INDICES = [4, 8, 12, 16, 20];
const CLOSE_THRESHOLD = 30;

async function init() {
  // webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  // canvas sizing
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // detector
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  detector = await handPoseDetection.createDetector(model, {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
  });

  detectLoop();
}

function detectLoop() {
  if (!detector) return;
  detector.estimateHands(video).then(detectLoop);
}
```

- [ ] **Step 4: Verify the page loads without console errors**

Run: Open index.html in a browser (or `python3 -m http.server` and navigate to it)
Expected: Webcam permission prompt, no console errors after granting permission.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: project scaffold with handpose detection"
```

---

### Task 2: Canvas resize + main animation loop

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add resize handler and main animation loop**

```js
// After canvas setup in init()
window.addEventListener('resize', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
}
```

- [ ] **Step 2: Wire animation loop into init and detectLoop**

```js
// init() — after detector setup
animate();

// detectLoop — store hands result
let lastHands = [];

async function detectLoop() {
  if (!detector) return;
  lastHands = await detector.estimateHands(video);
  requestAnimationFrame(detectLoop);
}
```

- [ ] **Step 3: Verify the canvas renders a cleared frame**

Run: reload page
Expected: Canvas exists, cleared each frame, no flicker.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add animation loop and canvas resize"
```

---

### Task 3: Draw hand landmarks (subtle style)

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add landmark drawing function**

Add before `animate()`:

```js
const LANDMARK_COLOR = 'rgba(144, 238, 144, 0.4)';
const CONNECTION_COLOR = 'rgba(144, 238, 144, 0.2)';
const LANDMARK_PORTAL_ACTIVE_COLOR = 'rgba(144, 238, 144, 0.15)';
const CONNECTION_PORTAL_ACTIVE_COLOR = 'rgba(144, 238, 144, 0.08)';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

function drawLandmarks(hands) {
  const active = portalOpacity > 0.1;
  const landmarkColor = active ? LANDMARK_PORTAL_ACTIVE_COLOR : LANDMARK_COLOR;
  const connectionColor = active ? CONNECTION_PORTAL_ACTIVE_COLOR : CONNECTION_COLOR;

  for (const hand of hands) {
    const kp = hand.keypoints;

    // connections
    ctx.strokeStyle = connectionColor;
    ctx.lineWidth = active ? 0.5 : 1;
    for (const [i, j] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(kp[i].x, kp[i].y);
      ctx.lineTo(kp[j].x, kp[j].y);
      ctx.stroke();
    }

    // landmarks
    ctx.fillStyle = landmarkColor;
    for (const p of kp) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, active ? 2 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
```

- [ ] **Step 2: Call drawLandmarks in animate()**

```js
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLandmarks(lastHands);
  requestAnimationFrame(animate);
}
```

- [ ] **Step 3: Verify landmarks appear on screen**

Run: reload page, show hand to camera
Expected: Green dots and connection lines visible on canvas, following hand movement.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: draw hand landmarks and connections on canvas"
```

---

### Task 4: Portal trigger logic (fingertip distance)

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add distance + fingertip cluster detection**

```js
function distance2D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getFingertipCenter(hand) {
  const kp = hand.keypoints;
  const tips = FINGERTIP_INDICES.map(i => kp[i]);
  let maxDist = 0;
  let cx = 0, cy = 0;

  for (let i = 0; i < tips.length; i++) {
    cx += tips[i].x;
    cy += tips[i].y;
    for (let j = i + 1; j < tips.length; j++) {
      const d = distance2D(tips[i], tips[j]);
      if (d > maxDist) maxDist = d;
    }
  }

  cx /= tips.length;
  cy /= tips.length;

  return { centerX: cx, centerY: cy, maxDist };
}
```

- [ ] **Step 2: Add portal state update logic**

```js
function updatePortalState(hands) {
  if (hands.length === 0) {
    portalActive = false;
    return;
  }

  // Use closest hand (the one with most-clustered fingertips)
  let best = null;
  let bestDist = Infinity;
  for (const hand of hands) {
    const info = getFingertipCenter(hand);
    if (info.maxDist < bestDist) {
      bestDist = info.maxDist;
      best = info;
    }
  }

  portalActive = best !== null && bestDist < CLOSE_THRESHOLD;
  if (best) {
    window._portalCenter = { x: best.centerX, y: best.centerY };
    window._portalIntensity = Math.max(0, 1 - bestDist / CLOSE_THRESHOLD);
  }
}
```

- [ ] **Step 3: Wire into detectLoop**

```js
async function detectLoop() {
  if (!detector) return;
  lastHands = await detector.estimateHands(video);
  updatePortalState(lastHands);
  requestAnimationFrame(detectLoop);
}
```

- [ ] **Step 4: Add transition in animate**

```js
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLandmarks(lastHands);

  const target = portalActive ? 1 : 0;
  portalOpacity += (target - portalOpacity) * (portalActive ? 0.1 : 0.05);

  if (portalOpacity > 0.01 && window._portalCenter) {
    drawPortal(window._portalCenter, portalOpacity);
  }

  requestAnimationFrame(animate);
}
```

- [ ] **Step 5: Verify portal state changes in console**

Run: Add `console.log(portalActive)` in updatePortalState. Open hand vs closed fist.
Expected: `true` when fingertips close, `false` when spread.

- [ ] **Step 6: Commit**

```bash
git add script.js
git commit -m "feat: add fingertip clustering detection and portal trigger"
```

---

### Task 5: Portal rendering (Rick & Morty style)

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add portal drawing function**

Add before `animate()`:

```js
let portalTime = 0;

function drawPortal(center, opacity) {
  portalTime += 0.02;
  const baseRadius = 60 + 20 * (1 - window._portalIntensity || 0);

  ctx.save();
  ctx.globalAlpha = opacity;

  // outer glow
  const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, baseRadius * 1.5);
  gradient.addColorStop(0, 'rgba(50, 255, 50, 0.3)');
  gradient.addColorStop(0.5, 'rgba(50, 255, 50, 0.1)');
  gradient.addColorStop(1, 'rgba(50, 255, 50, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center.x, center.y, baseRadius * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // outer ring
  ctx.shadowColor = '#32ff32';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = `rgba(50, 255, 50, ${opacity})`;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center.x, center.y, baseRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // inner ring
  ctx.strokeStyle = `rgba(50, 255, 50, ${opacity * 0.6})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center.x, center.y, baseRadius * 0.6, 0, Math.PI * 2);
  ctx.stroke();

  // vortex spiral
  for (let i = 0; i < 5; i++) {
    const angle = portalTime * 2 + i * Math.PI * 0.4;
    const spiralRadius = baseRadius * (0.2 + 0.6 * (i / 5));
    ctx.strokeStyle = `rgba(100, 255, 100, ${opacity * (0.3 + 0.2 * (i / 5))})`;
    ctx.lineWidth = 2 + i * 1.5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, spiralRadius, angle, angle + Math.PI * 0.8);
    ctx.stroke();
  }

  // particles
  const particleCount = 12;
  for (let i = 0; i < particleCount; i++) {
    const angle = portalTime * 1.5 + (i / particleCount) * Math.PI * 2;
    const dist = baseRadius * (0.3 + 0.3 * Math.sin(portalTime * 3 + i));
    const px = center.x + Math.cos(angle) * dist;
    const py = center.y + Math.sin(angle) * dist;
    const size = 2 + Math.sin(portalTime * 4 + i * 2) * 1.5;
    ctx.fillStyle = `rgba(150, 255, 150, ${opacity * (0.5 + 0.3 * Math.sin(portalTime * 2 + i))})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

- [ ] **Step 2: Verify portal appears when fingertips cluster**

Run: reload page, make a fist or pinch fingertips together.
Expected: Green portal with glow, rotating spiral, and orbiting particles appears centered between fingertips. Portal fades in smoothly.

- [ ] **Step 3: Verify portal fades when fingers separate**

Run: open hand
Expected: Portal fades out smoothly over ~500ms.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add Rick & Morty style portal rendering with vortex and particles"
```

---

### Task 6: Polish — landmarks hide when portal active

Already handled in Task 3: `drawLandmarks` checks `portalOpacity > 0.1` and reduces landmark opacity.

- [ ] **Step 1: Verify visual hierarchy**

Run: Cluster fingertips → portal appears. Landmarks become very subtle.
Expected: Portal dominates, landmarks barely visible in background.

- [ ] **Step 2: Final check — full flow in browser**

Run: reload, grant camera, move hand around, cluster fingertips, spread them.
Expected: No console errors, landmarks visible normally, portal appears/clusters with smooth transition, portal fades on release.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: final polish and visual hierarchy adjustments"
```
