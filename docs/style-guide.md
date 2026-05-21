# Style Guide — Giulia Faro Portfolio

## Tipografia

| Livello | Font | Peso | Dimensione | Uso |
|---------|------|------|------------|-----|
| Hero/titolo home | `Alfa Slab One`, serif | 400 | `clamp(48px, 10vw, 120px)` | "Giulia Faro" nella hub |
| Corpo/home label | `Inter`, sans-serif | 400 | 14px | Etichette cartelle, about |
| About | `Inter`, sans-serif | 500 | 20px | Fixed top-left nella hub |
| Titoli ricetta | `Playfair Display`, serif | — | `2.5rem` hero, `2rem` ricetta, `1.5rem` step |
| Corpo ricetta | `Inter`, sans-serif | — | `1rem` line-height `1.6` |
| Punteggio UFO | `Courier New`, monospace | bold | 28px | Verde matrix `#00ff41` |
| Pulsante microfono | `Helvetica Neue`, Arial, sans-serif | — | 18px | Maschera sonora |
| Label pattern | system sans-serif | 600 | `0.85rem` legenda, `0.8rem` label |
| Canvas tipografia | Arial / Helvetica Neue, sans-serif | — | 40–300px (slider) | Testo "sigarettaa" |

## Colori

### Palette primaria (tema scuro)

| Variabile | Valore | Uso |
|-----------|--------|-----|
| `--body-bg` | `#000` | Sfondo hub, UFO game, tipografia cinetica |
| `--text-primary` | `#fff` | Testo su sfondo nero |

### Hologram (home — aloni cartelle)

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Rosa | `#ff6ec7` | Alone 1 (ciclo 4s) |
| Verde | `#50ff8a` | Alone 2/4 (ciclo 4s / 3.5s) |
| Blu | `#50d0ff` | Alone 2 (ciclo 4s) |
| Viola | `#a050ff` | Alone 3 (ciclo 5s) |

Tutti gli aloni: opacità centro 0.65–0.75, bordo 0, blur 6px, clipPath rettangolo cartella.

### UFO game

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Punteggio | `#00ff41` | Verde matrix glow |
| Portale | `#4ade80` → `#15803d` | 4 strati concentrici |
| Esplosione | `hsl(0..20, 100%, 60%)` | Particelle random |
| Glow portale | `rgba(74,222,128,0.4)` | Ombra esterna |

### Maschera sonora

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Sfondo volto | `#9d9d9c` | Grigio medio SVG |
| Dettagli neri | `#1d1d1b` | Linee occhi, bocca, naso |
| Occhi aperti | `#e53935` | Rosso pieno |

### Pattern generator

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Sfondo pagina | `#1a1a1a` | Grigio scuro |
| Sidebar | `#334` | Pannello controlli |
| Accento | `#6af` | Slider, selezione, bordi |
| Sfondo canvas | `#ffffff` | Default pattern BG |

### Ricetta (tema chiaro)

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Sfondo | `#FDF8F0` | Crema caldo |
| Accento | `#8CB08A` | Verde salvia |
| Testo | `#4A3F35` | Marrone scuro |
| Card BG | `#FFFFFF` | Bianco |

### Tipografia cinetica

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Sidebar | `#111` | Grigio quasi nero |
| Filtro sigaretta | `#CC7722` | Ambra |
| Pulsante FUMA | `#CC7722` → `#B8661A` hover | Ambra |

## Componenti UI

### Cartelle (home)
- **Dimensione**: 130×108px SVG (icona), label sotto gap 2px, totale ~136px
- **Mobile**: 90×75px SVG
- **Bordo**: `0.5px solid rgba(255,255,255,0.2)`
- **Riempimento**: `rgba(255,255,255,0.08→0.14)` gradiente
- **Backdrop**: blur(8px) con aloni hologram dietro
- **Hover**: scala 1.18 + freeze posizione
- **Floating**: sin²(t·0.45), direction verso angoli, ampiezza min 6px

### Back button (tutti i progetti)
- **Taglia**: 40×40px, font-size 22px, border-radius 12px
- **Tema scuro** (UFO, maschera, tipografia): `rgba(255,255,255,0.12)` bg, `#fff` colore
- **Tema chiaro sfondo bianco** (pattern): `rgba(255,255,255,0.3)` bg, `#1a1a1a` colore
- **Tema chiaro caldo** (ricetta): `rgba(0,0,0,0.08)` bg, `#4A3F35` colore
- **Hover**: scale(1.12), bg più opaco
- **Transition**: `background 0.2s, transform 0.2s`
- **Z-index**: 9999, top/left 20px

## Spaziatura e layout

| Variabile | Valore | Uso |
|-----------|--------|-----|
| Body padding | `30px` | Home page |
| Gap tra cartelle | `200px` | Home page |
| Gap sopra titolo | `30px` (tra titolo e prime cartelle) |
| Gap sotto titolo | `55px` | Tra titolo e cartelle inferiori |
| Margine bordi | `30px` | Clamping posizioni cartelle |
| Sidebar pattern | `280px` width, `16px` padding |
| Sidebar tipografia | `260px` width, `30px 20px` padding |
| Gap sidebar elementi | `20px` | Tipografia cinetica |

## Gerarchia z-index

| Valore | Elemento |
|--------|----------|
| 1 | Titolo home |
| 5 | Cartelle home |
| 10 | About / microfono / pulsante FUMA |
| 100 | Header ricetta (sticky) |
| 200 | Modale overlay ricetta |
| 9999 | Back button (tutti i progetti) |

## Animation & easing

| Elemento | Proprietà | Tempo | Easing |
|----------|-----------|-------|--------|
| Back button hover | background, transform | 0.2s | ease |
| Card ricetta hover | transform, box-shadow | 0.2s | ease |
| Microfono hover | opacity, transform | 0.3s / 0.2s | ease |
| Status badge | opacity | 0.4s | ease |
| Cartelle hover scale | Lerp `(target-current)·0.12` | per frame | linear interpolation |
| Cartelle unhover riallineamento | Decay `·0.95` | per frame | esponenziale |
| Modale ricetta | opacity + scale | 0.2s | ease-out |

## Border-radius

| Valore | Uso |
|--------|-----|
| 3px | Input numerici (pattern) |
| 4px | Bottoni pattern, START/FUMA |
| 6px | Fieldset, status badge |
| 8px | Microfono, modal link |
| 12px | Back button, cartelle (clipPath) |
| 16px | Card, modale ricetta |
| 50% | Range thumb, info button, step number |

## Ombre

| Valore | Uso |
|--------|-----|
| `0 2px 12px rgba(0,0,0,0.06)` | Card ricetta |
| `0 8px 24px rgba(0,0,0,0.1)` | Card ricetta hover |
| `0 4px 24px rgba(0,0,0,0.15)` | Modale ricetta |
| `0 2px 8px rgba(0,0,0,0.15)` | Info button ricetta |
| `shadowBlur 40, rgba(74,222,128,0.4)` | Portale UFO |
| `shadowBlur 12, #00ff41` | Punteggio UFO |

## Progetti

| Progetto | Tema | Sfondo | File |
|----------|------|--------|------|
| Hub | Oscuro/hologram | `#000` | `index.html` |
| UFO game | Oscuro/neon | `#000` | `marionetta 1/` |
| Pattern generator | Scuro/tecnico | `#1a1a1a` | `pattern esercizio 1/` |
| Maschera sonora | Neutro/grigio | `#9d9d9c` | `maschera sonora 1/` |
| Ricetta | Chiaro/caldo | `#FDF8F0` | `ricetta pasta al pesto 2 1/` |
| Tipografia cinetica | Oscuro/minimal | `#000` | `tipografia cinetica 1/` |
