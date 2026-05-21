# Home Hub — Giulia Faro Portfolio Hub

## Overview
A static home page that serves as a central hub for all 5 subfolders in the `sito` directory. Displays "Giulia Faro" in large centered text with floating macOS-style folder icons that link to each project.

## Design

### Layout
- **Background:** Black (`#000`), full viewport
- **Text color:** White (`#fff`)
- **Top-left:** "about" in Inter font, small (14-16px)
- **Center:** "Giulia Faro" in Alfa Slab One font, large (80-120px responsive)
- **Floating elements:** 5 macOS-style folder icons distributed around the name, each with its folder name in Inter below it

### Fonts
- **Alfa Slab One** — for "Giulia Faro" (Google Fonts)
- **Inter** — for "about" and folder names (Google Fonts)

### Folder Icons
- Replica of macOS folder icon in SVG (gray, front/back face)
- Each folder displays its name below in Inter (12-14px, white)
- Clicking a folder navigates to `{folder-name}/index.html`

### Animation (Floating)
- JS-driven via `requestAnimationFrame`
- Each folder follows a unique floating path (gentle sine-wave oscillation on X + Y + slight rotation)
- Folders avoid overlapping with the "Giulia Faro" text
- Responsive: folders reposition/resize on smaller screens

### Folder Mapping
| Display Name | Target Path |
|---|---|
| marionetta 1 | `marionetta 1/index.html` |
| maschera sonora 1 | `maschera sonora 1/index.html` |
| pattern esercizio 1 | `pattern esercizio 1/index.html` |
| ricetta pasta al pesto 2 1 | `ricetta pasta al pesto 2 1/index.html` |
| tipografia cinetica 1 | `tipografia cinetica 1/index.html` |

### Technical
- Single `index.html` file in `/Users/giuliafaro/Desktop/workshop_05/sito/`
- All CSS inline in `<style>`, all JS inline in `<script>`
- No build tools or dependencies
- Google Fonts loaded via `<link>`
- SVG folder icons inline or loaded as data URIs

### About Link
- "about" in top-left corner, Inter font
- Currently static text (can link to a future about page)
