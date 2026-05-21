# Blog di Cucina — Specifica di Design

## Panoramica
Sito web statico per blog di cucina, con una prima ricetta (Pasta al Pesto) e struttura scalabile.

## Tecnologia
- **Framework:** Astro (static site generator)
- **Hosting:** Statico (GitHub Pages / Netlify)
- **Font:** Playfair Display (titoli) + Inter (testi) da Google Fonts

## Architettura

### Pagine
- `/` — Homepage, griglia di card ricette
- `/ricette/pasta-al-pesto/` — Pagina singola ricetta con procedimento
- `/chi-siamo/` — Pagina informativa
- `/contatti/` — Pagina contatti

### Dati (Markdown frontmatter)
Ogni ricetta è un file `.md` con frontmatter:
```yaml
title: "Pasta al Pesto"
image: "/images/pasta-al-pesto.jpg"
time: 25
difficulty: "Facile"
servings: 3
description: "La vera pasta al pesto genovese, semplice e veloce."
```
Il corpo del file contiene il procedimento in step Markdown.

### Componenti
- `Header` — navigazione, reattivo
- `Footer` — crediti
- `CardRicetta` — immagine + titolo + icona "i"
- `ModalInfo` — popup con tempo, difficoltà, porzioni, descrizione
- `StepRicetta` — componente per passo nella pagina ricetta
- `Layout` — struttura base HTML, head, nav, footer

## Grafica
- **Sfondo:** `#FDF8F0` (panna)
- **Accenti:** `#8CB08A` (verde salvia)
- **Testi:** `#4A3F35` (marrone tenue)
- **Card:** bianco, `border-radius: 16px`, ombra leggera, hover sollevamento
- **Homepage griglia:** 1 col (mobile), 2 (tablet), 3-4 (desktop)
- **Pagina ricetta:** timeline verticale per gli step

## Flussi
### Homepage → Dettaglio
1. Card mostra immagine + titolo + icona "i"
2. Click sulla card → naviga a `/ricette/:slug/`
3. Click su "i" → modal con riepilogo

### Aggiungere nuova ricetta
1. Creare file `.md` in `src/content/ricette/`
2. Inserire immagine in `public/images/`
3. Build → la ricetta appare in homepage

## Criteri di successo
- Build statica funzionante
- Responsive (mobile/tablet/desktop)
- Palette colori soft uniforme
- Card con modal info funzionante
