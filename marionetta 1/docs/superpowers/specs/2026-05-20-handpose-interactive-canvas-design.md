# Interactive Canvas con Handpose — Design

## Overview
Web app che usa TensorFlow.js MediaPipe Hands per tracciare la mano via webcam e creare un'esperienza visiva interattiva: quando i polpastrelli si avvicinano entro 50px, appare un cerchio verde che genera quadratini colorati; i quadratini persistono e si muovono per tutta la canvas, ed esplodono se toccati dalla punta dell'indice.

## Requirements
1. Rilevamento mano via webcam con MediaPipe Hands (TensorFlow.js)
2. Cerchio verde quando i 5 polpastrelli (landmark 4,8,12,16,20) sono entro 50px di distanza
3. Dal cerchio emergono quadratini colorati che si muovono liberamente per la canvas
4. I quadratini persistono anche quando il cerchio si dissolve
5. Il dito indice (punta, landmark 8) fa esplodere i quadratini che tocca
6. Nessun elemento di debug o placeholder

## Architecture
- **index.html** — struttura + CDN librerie
- **style.css** — stili fullscreen, sfondo nero
- **script.js** — logica applicativa in unico file:
  - `HandTracker` — init webcam + detector MediaPipe, loop di detection
  - `CircleState` — calcolo distanza polpastrelli, gestione opacità cerchio
  - `SquareSystem` — spawn, movimento, rendering quadratini
  - `ExplosionSystem` — particelle esplosione al collasso dei quadratini
  - `CollisionDetector` — rilevamento tocco indice-su-quadratino
  - `Renderer` — draw cerchio, quadratini, esplosioni su canvas

## Data Flow
1. Webcam → MediaPipe → landmarks (x,y) di 21 punti mano
2. Ogni frame: calcolo maxDist tra polpastrelli; se < 50px → circleActive = true
3. Se circleActive → spawn timer incrementa → ogni N frame spawna quadratino
4. Ogni frame: aggiorna posizione quadratini (movimento, rimbalzo bordi)
5. Ogni frame: controlla collisione landmark[8] con ogni quadratino → explosion
6. Opacità cerchio segue smooth (lerp) verso target (1 se attivo, 0 se no)
7. Canvas clear + render

## Visual Specification
- **Cerchio**: verde, glow (`#32ff32`), gradiente radiale, linea 3px, raggio 50px
- **Quadratini**: hue random (0–360), saturazione 90%, luminosità 55%, bordo bianco 2px, dimensioni 18–34px
- **Esplosione**: 15–25 particelle, hue caldo (30–60), life decay, fade out
- **Sfondo**: video webcam in tempo reale (disegnato su canvas con `ctx.drawImage`)

## States
- **Nessuna mano**: canvas vuoto
- **Mano presente, dita distanti**: solo quadratini esistenti (se presenti) si muovono
- **Polpastrelli vicini**: cerchio appare + spawn quadratini
- **Indice su quadratino**: esplosione, quadratino rimosso

## Out of Scope
- Mobile/responsive (vincolato a dimensioni webcam)
- Multi-mano avanzato (usa solo la mano più vicina)
- UI controls, settaggi
