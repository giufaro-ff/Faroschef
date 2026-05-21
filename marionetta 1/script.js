const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ufoImg = new Image();
const galaxyImg = new Image();
let ufoLoaded = false;
let galaxyLoaded = false;

function loadImages() {
  return new Promise((resolve) => {
    ufoImg.onload = () => {
      ufoLoaded = true;
      if (galaxyLoaded) resolve();
    };
    ufoImg.src = 'ufo.svg';
    galaxyImg.onload = () => {
      galaxyLoaded = true;
      if (ufoLoaded) resolve();
    };
    galaxyImg.src = 'galaxy.svg';
  });
}

let detector = null;
let lastHands = [];
let circleOpacity = 0;
const PALM_INDICES = [0, 5, 9, 13, 17];

function getPalmCenter(hand) {
  const kp = hand.keypoints;
  let cx = 0, cy = 0;
  for (const i of PALM_INDICES) {
    cx += kp[i].x;
    cy += kp[i].y;
  }
  cx /= PALM_INDICES.length;
  cy /= PALM_INDICES.length;
  return { x: cx, y: cy };
}

let portalActivated = false;

let portalStartFrame = 0;
const PORTAL_DURATION = 3600;

function updateCircleState(hands) {
  if (hands.length >= 2 && !portalActivated) {
    portalActivated = true;
    portalStartFrame = frameCount;
    window._circleCenter = { x: canvas.width / 2, y: canvas.height / 2 };
  }
  if (portalActivated && frameCount - portalStartFrame >= PORTAL_DURATION) {
    portalActivated = false;
  }
}

let squares = [];
let spawnTimer = 0;
const SPAWN_INTERVAL = 10;
const MAX_SQUARES = 120;

let frameCount = 0;
let score = 0;

function spawnSquare(center) {
  if (squares.length >= MAX_SQUARES) return;
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.5 + Math.random() * 3;
  squares.push({
    x: center.x, y: center.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 30 + Math.random() * 20,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    spawnFrame: frameCount,
  });
}

function updateSquares() {
  for (const s of squares) {
    s.x += s.vx;
    s.y += s.vy;
    s.rotation += s.rotSpeed;
    if (s.x < -s.size || s.x > canvas.width + s.size) {
      s.vx *= -1;
      s.x = Math.max(-s.size + 1, Math.min(canvas.width + s.size - 1, s.x));
    }
    if (s.y < -s.size || s.y > canvas.height + s.size) {
      s.vy *= -1;
      s.y = Math.max(-s.size + 1, Math.min(canvas.height + s.size - 1, s.y));
    }
  }
}

function drawUfos() {
  if (!ufoLoaded) return;
  const svgAspect = 841.89 / 595.28;
  for (const s of squares) {
    const w = s.size * 2;
    const h = w * svgAspect;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.drawImage(ufoImg, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

let explosions = [];

function createExplosion(x, y) {
  const count = 8 + Math.floor(Math.random() * 6);
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x: 0, y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.03 + Math.random() * 0.04,
      size: 2 + Math.random() * 4,
      hue: 0 + Math.random() * 20,
    });
  }
  explosions.push({ x, y, particles, life: 1 });
}

function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const ex = explosions[i];
    ex.life -= 0.04;
    for (const p of ex.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= p.decay;
    }
    if (ex.life <= 0) explosions.splice(i, 1);
  }
}

function drawExplosions() {
  for (const ex of explosions) {
    for (const p of ex.particles) {
      if (p.life <= 0) continue;
      ctx.globalAlpha = p.life * 0.6;
      ctx.fillStyle = `hsl(${p.hue}, 100%, ${50 + p.life * 40}%)`;
      ctx.beginPath();
      ctx.arc(ex.x + p.x, ex.y + p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawScore() {
  const text = `SCORE: ${score}`;
  const x = 20;
  const y = 40;

  ctx.save();

  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.textBaseline = 'top';

  ctx.shadowColor = '#00ff41';
  ctx.shadowBlur = 12;

  ctx.fillStyle = '#00ff41';
  ctx.strokeStyle = '#003300';
  ctx.lineWidth = 4;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);

  for (let i = 0; i < 2; i++) {
    const offX = (Math.random() - 0.5) * 3;
    const offY = (Math.random() - 0.5) * 1.5;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = i === 0 ? '#ff0040' : '#00aaff';
    ctx.fillText(text, x + offX, y + offY);
  }

  ctx.restore();
}

function checkFingerCollisions(hands) {
  if (!hands.length) return;
  const GUN_FINGERTIPS = [4, 8, 12];
  for (const hand of hands) {
    const tips = GUN_FINGERTIPS.map(i => hand.keypoints[i]).filter(Boolean);
    if (tips.length < 3) continue;
    const cx = tips.reduce((s, t) => s + t.x, 0) / 3;
    const cy = tips.reduce((s, t) => s + t.y, 0) / 3;
    for (let i = squares.length - 1; i >= 0; i--) {
      const s = squares[i];
      if (frameCount - s.spawnFrame < 20) continue;
      const dx = Math.abs(cx - s.x);
      const dy = Math.abs(cy - s.y);
      if (dx < s.size * 2 && dy < s.size * 2) {
        createExplosion(s.x, s.y);
        score++;
        squares.splice(i, 1);
      }
    }
  }
}

function drawBlob(cx, cy, radius, stretch, angle, t) {
  const points = 24;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wave = Math.sin(a * 3 + t * 1.2) * 0.15
              + Math.sin(a * 5 + t * 0.7) * 0.08;
    const r = radius * (1 + wave) * (1 + Math.cos(a - angle) * stretch);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawPortal(center, opacity) {
  const t = frameCount * 0.025;
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.globalAlpha = opacity;

  const slimeColor1 = '#4ade80';
  const slimeColor2 = '#22c55e';
  const slimeColor3 = '#16a34a';
  const slimeDark = '#15803d';

  ctx.shadowColor = 'rgba(74, 222, 128, 0.4)';
  ctx.shadowBlur = 40;

  const s1 = 0.15 + Math.sin(t * 0.5) * 0.05;
  drawBlob(0, 0, 100, s1, t * 0.3, t);
  ctx.fillStyle = slimeColor1;
  ctx.globalAlpha = opacity * 0.35;
  ctx.fill();

  const s2 = 0.1 + Math.cos(t * 0.4 + 1) * 0.06;
  drawBlob(Math.sin(t * 0.2) * 25, Math.cos(t * 0.3) * 20, 80, s2, -t * 0.2 + 1, t + 1);
  ctx.fillStyle = slimeColor2;
  ctx.globalAlpha = opacity * 0.3;
  ctx.fill();

  const s3 = 0.12 + Math.sin(t * 0.6 + 2) * 0.07;
  drawBlob(Math.cos(t * 0.25) * 30, Math.sin(t * 0.35) * 25, 65, s3, t * 0.4 + 2, t + 2);
  ctx.fillStyle = slimeColor3;
  ctx.globalAlpha = opacity * 0.4;
  ctx.fill();

  drawBlob(Math.sin(t * 0.15) * 15, Math.cos(t * 0.2) * 15, 50, 0.05, t * 0.1, t + 3);
  ctx.fillStyle = slimeDark;
  ctx.globalAlpha = opacity * 0.55;
  ctx.fill();

  const dropCount = 5;
  for (let i = 0; i < dropCount; i++) {
    const a = (i / dropCount) * Math.PI * 2 + t * 0.15;
    const dist = 70 + Math.sin(t * 0.8 + i * 2) * 25;
    const dx = Math.cos(a) * dist;
    const dy = Math.sin(a) * dist;
    const ds = 8 + Math.sin(t * 0.5 + i * 1.5) * 4;
    ctx.globalAlpha = opacity * 0.3;
    ctx.fillStyle = slimeColor1;
    ctx.beginPath();
    ctx.arc(dx, dy, ds, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17]
];

function drawHandLandmarks(hands) {
  if (!hands.length) return;
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (const hand of hands) {
    const kp = hand.keypoints;
    for (const [i, j] of HAND_CONNECTIONS) {
      ctx.strokeStyle = '#66ff66';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(kp[i].x, kp[i].y);
      ctx.lineTo(kp[j].x, kp[j].y);
      ctx.stroke();
    }
    for (const p of kp) {
      ctx.fillStyle = '#88ff88';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

async function init() {
  await loadImages();

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  window.addEventListener('resize', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  });

  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  detector = await handPoseDetection.createDetector(model, {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
  });

  detectLoop();
  animate();
}

async function detectLoop() {
  if (!detector) return;
  lastHands = await detector.estimateHands(video);
  updateCircleState(lastHands);
  requestAnimationFrame(detectLoop);
}

function animate() {
  if (galaxyLoaded) {
    ctx.drawImage(galaxyImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  frameCount++;

  if (portalActivated && window._circleCenter) {
    spawnTimer++;
    if (spawnTimer >= SPAWN_INTERVAL) {
      spawnTimer = 0;
      spawnSquare(window._circleCenter);
    }
  }
  updateSquares();
  updateExplosions();
  checkFingerCollisions(lastHands);

  const target = portalActivated ? 1 : 0;
  circleOpacity += (target - circleOpacity) * (portalActivated ? 0.02 : 0.02);

  if (circleOpacity > 0.01 && window._circleCenter) {
    drawPortal(window._circleCenter, circleOpacity);
  }

  drawHandLandmarks(lastHands);
  drawUfos();
  drawExplosions();
  drawScore();

  requestAnimationFrame(animate);
}

init();
