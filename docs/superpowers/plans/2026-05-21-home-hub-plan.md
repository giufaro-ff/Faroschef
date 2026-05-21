# Home Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a static home page at the root of `sito/` that acts as a hub linking to all 5 subfolder projects.

**Architecture:** Single `index.html` file with inline CSS and JS. No build tools. macOS-style floating folder icons link to each subfolder's `index.html`.

**Tech Stack:** HTML5, CSS3, vanilla JS, Google Fonts (Alfa Slab One, Inter)

---

### Task 1: HTML skeleton + fonts + base CSS layout

**Files:**
- Create: `/Users/giuliafaro/Desktop/workshop_05/sito/index.html`

- [ ] **Step 1: Create the file with HTML structure, Google Fonts, and base CSS**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Giulia Faro</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #000;
      color: #fff;
      font-family: 'Inter', sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    #about {
      position: fixed;
      top: 24px;
      left: 24px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      z-index: 10;
    }

    #title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Alfa Slab One', serif;
      font-size: clamp(48px, 10vw, 120px);
      color: #fff;
      text-align: center;
      z-index: 1;
      pointer-events: none;
      white-space: nowrap;
    }

    #folders {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
    }

    .folder {
      position: absolute;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      user-select: none;
    }

    .folder svg {
      width: 72px;
      height: 60px;
      display: block;
    }

    .folder-label {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #fff;
      text-align: center;
      line-height: 1.2;
      max-width: 100px;
    }

    @media (max-width: 768px) {
      .folder svg {
        width: 56px;
        height: 46px;
      }
      .folder-label {
        font-size: 10px;
        max-width: 80px;
      }
    }
  </style>
</head>
<body>
  <div id="about">about</div>
  <div id="title">Giulia Faro</div>
  <div id="folders"></div>
  <script>
    // JS will go here in Task 2
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify file exists and structure is correct**

Run: `ls -la "/Users/giuliafaro/Desktop/workshop_05/sito/index.html"`
Expected: file exists, non-empty

---

### Task 2: Folder data model + SVG icon generation + floating animation

**Files:**
- Modify: `/Users/giuliafaro/Desktop/workshop_05/sito/index.html` (add JS inside `<script>`)

- [ ] **Step 1: Replace the empty script with complete JS logic**

```html
  <script>
    const folders = [
      { name: 'marionetta 1', path: 'marionetta 1/index.html' },
      { name: 'maschera sonora 1', path: 'maschera sonora 1/index.html' },
      { name: 'pattern esercizio 1', path: 'pattern esercizio 1/index.html' },
      { name: 'ricetta pasta al pesto 2 1', path: 'ricetta pasta al pesto 2 1/index.html' },
      { name: 'tipografia cinetica 1', path: 'tipografia cinetica 1/index.html' },
    ];

    const folderSvg = `<svg viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6C8 4.89543 8.89543 4 10 4H28.3819C28.873 4 29.3282 4.24392 29.5902 4.64636L32.4721 9H64C65.1046 9 66 9.89543 66 11V50C66 51.1046 65.1046 52 64 52H10C8.89543 52 8 51.1046 8 50V6Z" fill="#B0B0B0"/>
      <path d="M8 12C8 10.8954 8.89543 10 10 10H64C65.1046 10 66 10.8954 66 12V52C66 53.1046 65.1046 54 64 54H10C8.89543 54 8 53.1046 8 52V12Z" fill="#D0D0D0"/>
      <path d="M10 12H64V14H10V12Z" fill="#A0A0A0"/>
    </svg>`;

    const container = document.getElementById('folders');
    const titleEl = document.getElementById('title');

    const folderEls = folders.map((f, i) => {
      const div = document.createElement('div');
      div.className = 'folder';
      div.innerHTML = folderSvg + `<span class="folder-label">${f.name}</span>`;
      div.addEventListener('click', () => {
        window.location.href = f.path;
      });
      container.appendChild(div);
      return div;
    });

    function getTitleRect() {
      const rect = titleEl.getBoundingClientRect();
      const pad = 60;
      return {
        x: rect.left - pad,
        y: rect.top - pad,
        w: rect.width + pad * 2,
        h: rect.height + pad * 2,
      };
    }

    function overlapsTitle(x, y, w, h) {
      const t = getTitleRect();
      return x < t.x + t.w && x + w > t.x && y < t.y + t.h && y + h > t.y;
    }

    function randomPosition(w, h) {
      const fw = 100;
      const fh = 90;
      const maxAttempts = 100;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.random() * (w - fw);
        const y = Math.random() * (h - fh);
        if (!overlapsTitle(x, y, fw, fh)) {
          return { x, y };
        }
      }
      const side = Math.floor(attempt / (maxAttempts / 4));
      const positions = [
        { x: 20, y: 20 },
        { x: w - fw - 20, y: 20 },
        { x: 20, y: h - fh - 20 },
        { x: w - fw - 20, y: h - fh - 20 },
      ];
      return positions[side % positions.length];
    }

    const states = folderEls.map(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const pos = randomPosition(w, h);
      return {
        startX: pos.x,
        startY: pos.y,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        ampX: 8 + Math.random() * 16,
        ampY: 6 + Math.random() * 12,
        rot: 0,
        rotPhase: Math.random() * Math.PI * 2,
        rotAmp: 1 + Math.random() * 2,
      };
    });

    function animate(time) {
      const t = time / 1000;
      folderEls.forEach((el, i) => {
        const s = states[i];
        const x = s.startX + Math.sin(t * 0.8 + s.phaseX) * s.ampX;
        const y = s.startY + Math.cos(t * 0.6 + s.phaseY) * s.ampY;
        const r = Math.sin(t * 0.4 + s.rotPhase) * s.rotAmp;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      });
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      folderEls.forEach((el, i) => {
        const pos = randomPosition(w, h);
        states[i].startX = pos.x;
        states[i].startY = pos.y;
      });
    });
  </script>
```

- [ ] **Step 2: Verify the folder SVGs render properly — open in browser**

Run: `open "/Users/giuliafaro/Desktop/workshop_05/sito/index.html"`
Expected: page shows "Giulia Faro" centered, "about" top-left, 5 folder icons floating with labels

- [ ] **Step 3: Click each folder to verify navigation works**

Expected: clicking each folder navigates to that project's `index.html`

---

### Task 3: Edge case handling + polish

**Files:**
- Modify: `/Users/giuliafaro/Desktop/workshop_05/sito/index.html`

- [ ] **Step 1: Add cursor pointer on folders and hover effect**

Add to CSS inside `<style>`:
```css
    .folder:hover svg {
      filter: brightness(1.2);
    }
```

- [ ] **Step 2: Verify the hover effect works**

Open in browser and hover over folders — expected: folder icon brightens slightly

- [ ] **Step 3: Final verification — open page, confirm all 5 folders display, float, and navigate correctly on click**

Run: `open "/Users/giuliafaro/Desktop/workshop_05/sito/index.html"`
Expected: full experience working — floating folders, labels visible, no overlaps with title, navigation works
