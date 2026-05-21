# Marionetta — Handpose Portal Design

## Overview
Web app that uses TensorFlow.js hand-pose-detection (MediaPipe Hands) via webcam to detect when the five fingertips (landmarks 4, 8, 12, 16, 20) cluster within 30px of each other in 2D space, triggering a green animated portal effect (Rick & Morty style) centered on the hand.

## Tech Stack
- **Runtime:** Vanilla HTML/CSS/JS (no framework)
- **Hand tracking:** `@tensorflow-models/hand-pose-detection` with MediaPipe runtime, via CDN
- **Rendering:** Single `<canvas>` 2D element

## File Structure
```
marionetta/
├── index.html     # Single page: fullscreen canvas + hidden video
├── style.css      # Layout: fullscreen canvas, minimal UI
└── script.js      # Core logic: setup, detection loop, rendering
```

## Data Flow
1. Page load → webcam permission via `getUserMedia`
2. Each animation frame:
   - `detector.estimateHands(video)` → array of detected hands with keypoints
   - For each hand: extract 5 fingertip keypoints (indices 4, 8, 12, 16, 20)
   - Compute max pairwise 2D distance among those 5 points
3. **Trigger:** `maxDistance < 30px` → portal activates; otherwise fade out
4. Canvas cleared and redrawn each frame

## Portal Rendering (Canvas 2D)
- **Position:** Centroid of the 5 fingertip points
- **Visual elements:**
  - Outer ring with green glow (`shadowBlur`)
  - Rotating spiral/vortex drawn with overlapping arcs at varying opacity
  - Orbiting green particles around the portal
- **Size:** Scales with cluster tightness (tighter = larger/more intense)
- **Transitions:**
  - Open: opacity 0→1 over ~300ms, ease-out
  - Close: opacity 1→0 over ~500ms, ease-out (when fingers separate)

## Landmarks Rendering
- Subtle dots (radius ~3px, green/white, opacity 0.4)
- Connection lines (`lineWidth: 1`, opacity 0.2)
- When portal active: further reduced opacity (0.15) so portal dominates

## Future Considerations (not implemented now)
- Adjustable threshold slider in UI
- Portal size and intensity controls
