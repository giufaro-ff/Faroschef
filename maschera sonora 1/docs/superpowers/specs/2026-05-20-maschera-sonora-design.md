# Maschera Sonora — Design Document

## Obiettivo

Realizzare una maschera SVG che reagisce al suono captato dal microfono: in silenzio mostra la bocca chiusa, quando rileva suoni la bocca si apre con un'animazione fluida che simula il parlato in tempo reale.

## Architettura

Singolo file `index.html` con HTML, CSS e JS inline. Nessuna dipendenza esterna.

### Componenti

- **SVG statico**: volto completo (sfondo, occhi, naso) embedded nell'HTML. Si usano i path dai due SVG esistenti, prendendo occhi/naso/sfondo come reference comune.
- **Path bocca dinamico**: il `d` del path `<path id="bocca">` viene aggiornato via JavaScript a ogni frame dell'animazione.
- **Pipeline audio**: `navigator.mediaDevices.getUserMedia({ audio: true })` → `AudioContext` → `AnalyserNode` (fftSize: 256).
- **Interpolatore path**: normalizza i due `d` string (bocca chiusa / bocca aperta) in array di punti di controllo e interpola in base al volume.

### Data flow

```
Microfono → AnalyserNode → getByteFrequencyData() → 3 bande (low/mid/high)
→ smoothing esponenziale per banda → openness per-feature (bocca, palpebre, occhi, linee, narici)
→ interpolazione path: p(t) = chiuso + (aperto - chiuso) * openness
→ vibrazioni differenziate per feature → Catmull-Rom → aggiornamento attributo d
```

## Pipeline audio

- Richiesta permesso microfono con `getUserMedia` su click utente (evita autoplay block).
- `AnalyserNode` con `fftSize: 256` per bassa latenza.
- Ogni frame: `getByteFrequencyData()` restituisce array di 128 valori (0-255).
- Lo spettro è diviso in 3 bande:
  - **Low** (0-15%): guidano l'apertura della bocca
  - **Mid** (15-50%): modulano il parlato e l'oscillazione
  - **High** (50-100%): guidano jitter e micro-vibrazioni
- Smoothing esponenziale per banda: `smoothed += (raw - smoothed) * coeff` (coeff 0.35-0.55).

## Motore di interpolazione SVG

1. **Sampling**: `pathEl.getPointAtLength()` su SVG nascosto (`#pathSampler`) per campionare N=40 punti equidistanti da ogni path chiuso e aperto.
2. **Interpolazione lineare**: per ogni feature, `p(t) = closed + (open - closed) * openness`, dove `openness` varia per feature.
3. **Micro-vibrazioni**: offset pseudo-casuali ai punti usando `noisePhase` globale avanzata per frame + seno/coseno per movimenti fluidi. Intensità differenziata: bocca 100%, palpebre 40%, occhi 20%, linee/narici 15%.
4. **Ricostruzione Catmull-Rom**: i punti interpolati sono convertiti in path C tramite formula CR: `cp1 = p1 + (p2-p0)/6`, `cp2 = p2 - (p3-p1)/6`, con chiusura Z.

## Modello di movimento realistico

- **Multi-banda**: bassi per apertura mascella, medi per oscillazione parlato, alti per micro-vibrazioni.
- **Asimmetria bocca**: attack 0.7 (si apre subito), decay 0.25 (si chiude lentamente) — simula inerzia fisica.
- **Oscillazione parlato**: `talkPhase` incrementata da medi + frequenza base, `wobble = 0.35 + 0.65 * (0.5 + 0.5 * sin(talkPhase))`.
- **Openness per-feature**:
  - Bocca: direttamente da low+mid, con oscillazione parlato
  - Palpebre: `mouthOpenness` smussato (smoothing 0.15) — seguono in ritardo
  - Occhi: `mouthOpenness * 0.5` con smoothing 0.1 — movimento sottile
  - Linee occhi e narici: `mouthOpenness * 0.2` con smoothing 0.08 — accenno appena percettibile

## Animazione e dettagli visivi

- `requestAnimationFrame` loop, parte subito anche senza microfono (mostra stato di riposo).
- **Microfono button**: pulsante "Attiva microfono" iniziale per richiesta permesso esplicita.
- **Gestione errori**: se l'utente nega il permesso, mostra messaggio con pulsante per riprovare.
- **Fallback**: se `getUserMedia` non supportata, mostra avviso.

## Struttura file

```
maschera sonora/
├── index.html              (singola pagina, tutto inline)
├── bocca aperta.svg        (file sorgente)
├── bocca chiusa.svg        (file sorgente)
└── docs/superpowers/specs/
    └── 2026-05-20-maschera-sonora-design.md
```

## Browser support

- Chrome 55+, Firefox 52+, Safari 11+, Edge 15+ (getUserMedia + AudioContext + AnalyserNode).
- Richiede HTTPS o localhost per l'accesso al microfono.
