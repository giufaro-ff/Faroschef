# Pattern Generator — Design Doc

## Concetto

Web tool statico (HTML/JS/CSS) per generare pattern geometrici a partire da un modulo base. L'utente controlla parametri classici (rotazione, scala, posizione, colore) e una distorsione sperimentale della griglia tramite attrattori.

## Il Modulo

Base: un quadrato invisibile di lato `S`. Il vertice **basso-destra** è il centro di tre archi concentrici di 90°.

Ogni arco spazza in alto (nord) e a sinistra (ovest):

| Arco | Raggio | Descrizione |
|------|--------|-------------|
| 1    | S × 0.25 | Più interno |
| 2    | S × 0.50 | Intermedio |
| 3    | S × 1.00 | Più esterno, tocca i vertici alto-destra e basso-sinistra del quadrato |

Ogni arco ha colore e spessore indipendenti.

### Stato

```js
{
  x: Number,        // offset posizione X
  y: Number,        // offset posizione Y
  rotation: Number, // gradi (0–360)
  scale: Number,    // fattore scala (0.1–3.0)
  arcs: [
    { color: String, strokeWidth: Number },
    { color: String, strokeWidth: Number },
    { color: String, strokeWidth: Number }
  ]
}
```

## Griglia e Distorsione

### Griglia base

Disposizione regolare N righe × M colonne. Ogni cella occupa `S × S` pixel con gutter configurabile.

### Attrattori

Punti piazzabili sulla canvas che deformano la griglia. Ogni attrattore:

```js
{
  x: Number,
  y: Number,
  radius: Number,   // raggio di influenza
  strength: Number   // intensità (negativo = repulsione)
}
```

Per ogni modulo, se la distanza `d` dall'attrattore è < `radius`:

```
offset = direction × strength × (1 - d / radius)
```

Con più attrattori gli offset si sommano.

## Architettura Software

### Stack

- HTML5 Canvas per il rendering
- CSS per layout e stile del pannello controlli
- Vanilla JS, nessuna libreria esterna

### File

```
pattern esercizio/
├── index.html        # struttura pagina, canvas, pannello
├── style.css         # layout, controlli, responsive
├── script.js         # entry point: canvas, eventi, orchestrazione
├── module.js         # classe Module: disegna 3 archi su ctx
├── grid.js           # classe Grid: griglia N×M, attrattori, distorsione
└── controls.js       # binding UI → parametri, slider, picker
```

### Flusso rendering

```
requestAnimationFrame loop
  → controls.js legge stato parametri
  → grid.js calcola posizioni (con distortion)
  → module.js disegna ogni modulo su ctx
```

## UI

### Layout

- Canvas occupa la finestra (o area principale)
- Pannello controlli laterale (destra) scrollabile

### Controlli modulo

- Rotazione (slider 0–360°)
- Scala (slider 0.1–3.0)
- Offset X/Y (slider)
- Colore arco 1/2/3 (color picker)
- Spessore arco 1/2/3 (slider px)

### Controlli griglia

- Righe, colonne (slider numerico)
- Gutter (slider)
- Dimensione modulo S (slider)

### Controlli attrattori

- Aggiungi/rimuovi attrattore
- Trascinamento diretto sulla canvas
- Raggio influenza (slider)
- Intensità (slider, negativo = repulsione)
