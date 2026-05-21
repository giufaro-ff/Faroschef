# Maschera Sonora Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax.

**Goal:** Single HTML page showing an SVG mask that opens/closes its mouth in real-time based on microphone input.

**Architecture:** Single `index.html` with inline SVG, CSS, and vanilla JS. Audio via Web Audio API (AnalyserNode). Mouth path interpolated between closed/open SVGs with micro-vibrations for natural speech effect.

**Tech Stack:** Vanilla HTML/CSS/JS, Web Audio API, SVG path manipulation.

---

### Task 1: Create index.html

**Files:**
- Create: `index.html`

- [x] **Step 1: Write the complete HTML file**

The file contains:
- Inline SVG combining the face (eyes, nose, background) from both SVGs
- Both mouth paths embedded as data for JS interpolation
- CSS for layout, fullscreen centering, button styling
- JS for: microphone access, audio analysis, path interpolation algorithm, animation loop

### Completed features:
- 9 elementi interpolati (bocca, 2 palpebre, 2 occhi, 4 linee occhi, 2 narici)
- 3 bande audio (low/mid/high) con smoothing indipendente
- Modello movimento realistico: attack veloce/decay lento, oscillazione parlato
- Vibrazioni differenziate per feature
- Campionamento `getPointAtLength(40)` + Catmull-Rom spline
- Gradienti aggiornati da SVG Illustrator

- [ ] **Step 2: Test locally**

Open `index.html` via a local server (`python3 -m http.server 8000`) and verify:
- The mask renders correctly in its resting state (mouth closed)
- Clicking "Attiva microfono" prompts for mic permission
- Speaking into the mic causes the mouth to open with natural vibration
- Silence returns the mouth to closed state
