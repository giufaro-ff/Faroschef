# Sigaretta — Combustione Tipografica

## Overview

Web tool che anima la parola "Sigaretta" simulando la combustione di una sigaretta. Le lettere, disposte in verticale (ruotate 90°), bruciano dalla S in giù: ogni lettera si dissolve in particelle di fumo che poi si trasformano in cenere, fino alla consumazione completa.

## Stack

- Singolo file HTML
- Canvas 2D per il rendering
- Vanilla JS per fisica particellare e logica

## Layout

- Sfondo nero (`#000000`)
- Parola "Sigaretta" ruotata 90° in senso orario, al centro del canvas
- Sidebar a destra con slider di controllo

## Componenti

### Particle
Ogni particella ha:
- `x, y` — posizione
- `vx, vy` — velocità
- `size` — dimensione
- `opacity` — opacità (0–1)
- `state` — TEXT | SMOKE | ASH | GONE
- `color` — colore corrente
- `targetColor` — colore verso cui sfumare
- `age` — tick dall'attivazione

### CombustionEngine
- Fronte di combustione che scorre dalla S (alto) verso il basso
- Attiva le particelle che il fronte incontra
- Velocità regolabile (slider play/start)

### Renderer
- Loop di animazione con `requestAnimationFrame`
- Disegna ogni particella sul canvas principale
- Gestisce la trasformazione cromatica progressiva

### GUI
6 slider:
1. **Font size (px)** — dimensione del testo (default: 120px)
2. **Stroke** — spessore del contorno delle lettere (default: 0)
3. **Colore testo** — colore iniziale delle lettere (default: `#ffffff`)
4. **Colore fumo** — colore delle particelle in stato SMOKE (default: `#888888`)
5. **Colore cenere** — colore delle particelle in stato ASH (default: `#444444`)
6. **Play/Start** — avvia l'animazione (o reset se già completata)

## Ciclo di vita particella

1. **TEXT** — ferma, colore = colore testo selezionato
2. **SMOKE** — il fronte la attiva: velocità random verso l'alto, turbolenza sinusoidale, colore sfuma verso colore fumo, opacità cala gradualmente, dimensione aumenta (effetto espansione fumo)
3. **ASH** — dopo ~2-3 secondi: rallenta, inverte direzione (cade verso il basso), colore sfuma verso colore cenere, opacità si riduce ulteriormente
4. **GONE** — opacità ≈ 0, rimossa dal rendering

## Interazioni e controllo

- Slider aggiornano parametri in tempo reale
- Play/Start: se fermo, fa partire la combustione; se in corso, pausa; se finito, resetta
- Stroke controlla il `ctx.lineWidth` nel disegno del testo sul canvas off-screen

## Fisica

- **SMOKE**: `vy = -random(0.5, 1.5)`, `vx = sin(time + offset) * 0.5`, turbolenza con noise simplex o onde sovrapposte
- **ASH**: `vy = random(0.3, 1.0)` (caduta), `vx` si smorza
- **Opacità**: decresce linearmente da 1 a 0 durante ogni fase (durata fase SMOKE ~2s, fase ASH ~2s)

## Limiti

- Solo la parola "Sigaretta" (nessun input testo dinamico in questa versione)
- Non ci sono effetti sonori
- Non ci sono preset di animazione

## File struttura

```
tipografia cinetica/
  index.html          # unico file, contiene tutto (HTML, CSS, JS)
  docs/superpowers/specs/
    2026-05-19-sigaretta-combustione-design.md
```
