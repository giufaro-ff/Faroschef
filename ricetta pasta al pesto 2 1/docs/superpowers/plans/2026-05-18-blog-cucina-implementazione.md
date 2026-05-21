# "In Cucina con Giù" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static cooking blog site "In Cucina con Giù" with Astro featuring the "Pasta al Pesto" recipe.

**Architecture:** Astro static site with Markdown content for recipes, shared components for Header/Footer/Cards/Modal, responsive CSS grid layout with soft color palette.

**Tech Stack:** Astro 5, TypeScript, CSS (vanilla), Google Fonts (Playfair Display + Inter), Markdown frontmatter

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Initialize Astro project**

Run:
```bash
npm create astro@latest . -- --template basics --typescript --no-install --skip-git --yes
```

- [ ] **Step 2: Verify structure**

Run:
```bash
ls src/pages/
```
Expected: `index.astro` exists.

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

- [ ] **Step 4: Add Google Fonts to global CSS**

Write to `src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap');

:root {
  --bg: #FDF8F0;
  --accent: #8CB08A;
  --text: #4A3F35;
  --card-bg: #FFFFFF;
  --radius: 16px;
  --shadow: 0 2px 12px rgba(0,0,0,0.06);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

h1, h2, h3, h4 {
  font-family: 'Playfair Display', serif;
  color: var(--text);
}

a {
  color: var(--accent);
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}
```

- [ ] **Step 5: Configure Astro**

Write to `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://incucinacon giu.netlify.app',
  devToolbar: { enabled: false },
});
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold Astro project"
```

---

### Task 2: Create Layout component

**Files:**
- Create: `src/components/Layout.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Layout component**

Write to `src/components/Layout.astro`:
```astro
---
export interface Props {
  title: string;
}

const { title } = Astro.props;
---
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | In Cucina con Giù</title>
  <link rel="stylesheet" href="/src/styles/global.css" />
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 2: Update index page**

Write to `src/pages/index.astro`:
```astro
---
import Layout from '../components/Layout.astro';
---

<Layout title="Homepage">
  <main>
    <h1>In Cucina con Giù</h1>
  </main>
</Layout>
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Layout component"
```

---

### Task 3: Create Header and Footer components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/components/Layout.astro`

- [ ] **Step 1: Create Header**

Write to `src/components/Header.astro`:
```astro
---
const links = [
  { href: '/', label: 'Home' },
  { href: '/chi-siamo', label: 'Chi Siamo' },
  { href: '/contatti', label: 'Contatti' },
];
---
<header>
  <nav>
    <a href="/" class="logo">In Cucina con Giù</a>
    <ul>
      {links.map((link) => (
        <li><a href={link.href}>{link.label}</a></li>
      ))}
    </ul>
  </nav>
</header>

<style>
  header {
    background: var(--card-bg);
    padding: 1rem 2rem;
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent);
  }
  ul {
    list-style: none;
    display: flex;
    gap: 2rem;
  }
  li a {
    color: var(--text);
    font-weight: 500;
    transition: color 0.2s;
  }
  li a:hover {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Create Footer**

Write to `src/components/Footer.astro`:
```astro
<footer>
  <p>&copy; 2026 In Cucina con Giù. Tutti i diritti riservati.</p>
</footer>

<style>
  footer {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-size: 0.875rem;
    border-top: 1px solid #eee;
    margin-top: 4rem;
  }
</style>
```

- [ ] **Step 3: Update Layout to include Header and Footer**

Edit `src/components/Layout.astro` to add:
```astro
---
import Header from './Header.astro';
import Footer from './Footer.astro';
---
<!DOCTYPE html>
<html lang="it">
 <head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <title>{title} | In Cucina con Giù</title>
   <link rel="stylesheet" href="/src/styles/global.css" />
 </head>
 <body>
   <Header />
   <slot />
   <Footer />
 </body>
</html>
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Header and Footer"
```

---

### Task 4: Create recipe content file (Markdown)

**Files:**
- Create: `src/content/ricette/` directory
- Create: `src/content/ricette/pasta-al-pesto.md`
- Modify: `astro.config.mjs` (add content collections)

- [ ] **Step 1: Update Astro config for content collections**

Write to `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://incucinacongiu.netlify.app',
  devToolbar: { enabled: false },
});
```

- [ ] **Step 2: Create content directory structure**

```bash
mkdir -p src/content/ricette
```

- [ ] **Step 3: Write recipe Markdown**

Write to `src/content/ricette/pasta-al-pesto.md`:
```markdown
---
title: "Pasta al Pesto"
image: "/images/pasta-al-pesto.jpg"
time: 25
difficulty: "Facile"
servings: 3
description: "La vera pasta al pesto genovese, semplice e veloce con ingredienti freschi."
---

1. Prendere una pentola e mettere all'interno acqua e un cucchiaino di sale; mettere la pentola sul fuoco alto e fare bollire l'acqua.

2. Lavare tante foglie di basilico, prendere uno spicchio d'aglio, pinoli, olio e parmigiano.

3. Prendere un frullatore e inserire: foglie di basilico appena lavate, pinoli, uno spicchio di aglio, tanto parmigiano (6/8 cucchiai), olio circa un bicchiere. Frullare il tutto.

4. Appena l'acqua nella pentola bolle, versare 250g di pasta (a scelta tra pennette, trofie, fusilli ecc.), lasciare cuocere per 12 min circa, assaggiando a metà cottura.

5. In una padella antiaderente versare il pesto e riscaldare a fuoco lento.

6. Scolare la pasta quasi del tutto cotta (deve esserci un minimo di bianco all'interno del chicco).

7. Scolare la pasta con lo scolapasta e versarla nella padella con il pesto a fuoco basso. Mantecare per circa 2 min.

8. Impiattare (piatto bianco per far risaltare il verde del pesto), mettere il parmigiano sopra, e a scelta 2 foglioline di basilico crude per l'estetica.
```

- [ ] **Step 4: Create collection config**

Create `src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

export const collections = {
  ricette: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      image: z.string(),
      time: z.number(),
      difficulty: z.string(),
      servings: z.number(),
      description: z.string(),
    }),
  }),
};
```

- [ ] **Step 5: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 6: Placeholder recipe image**

```bash
mkdir -p public/images
```
Create a simple placeholder div or download a placeholder. Since we don't have an image, we'll just create a CSS placeholder. We'll handle this in the Card component.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add recipe content and content collection config"
```

---

### Task 5: Create CardRicetta and ModalInfo components

**Files:**
- Create: `src/components/CardRicetta.astro`
- Create: `src/components/ModalInfo.astro`

- [ ] **Step 1: Create CardRicetta component**

Write to `src/components/CardRicetta.astro`:
```astro
---
export interface Props {
  title: string;
  image: string;
  slug: string;
  difficulty: string;
  time: number;
  servings: number;
  description: string;
}

const { title, image, slug, difficulty, time, servings, description } = Astro.props;
---
<article class="card">
  <a href={`/ricette/${slug}`}>
    <div class="card-image">
      <img src={image} alt={title} loading="lazy" />
      <button class="info-btn" data-slug={slug} aria-label="Info su {title}" type="button">i</button>
    </div>
    <div class="card-body">
      <h3>{title}</h3>
    </div>
  </a>
</article>

<script>
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const slug = btn.dataset.slug;
      // Dispatch custom event to open modal
      document.dispatchEvent(new CustomEvent('open-modal', { detail: { slug } }));
    });
  });
</script>

<style>
  .card {
    background: var(--card-bg);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  .card a {
    color: inherit;
  }
  .card-image {
    position: relative;
    aspect-ratio: 4 / 3;
    background: #e8e0d8;
    overflow: hidden;
  }
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .info-btn {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: var(--card-bg);
    color: var(--accent);
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: transform 0.2s;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info-btn:hover {
    transform: scale(1.1);
  }
  .card-body {
    padding: 1rem 1.25rem 1.25rem;
  }
  .card-body h3 {
    font-size: 1.125rem;
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Create ModalInfo component**

Write to `src/components/ModalInfo.astro`:
```astro
---
export interface Props {
  title: string;
  difficulty: string;
  time: number;
  servings: number;
  description: string;
  slug: string;
  open: boolean;
}

const { title, difficulty, time, servings, description, slug, open } = Astro.props;
---
<div class={`modal-overlay${open ? ' open' : ''}`} id="modal-overlay">
  <div class="modal" role="dialog" aria-modal="true" aria-label="Info ricetta">
    <button class="modal-close" id="modal-close" aria-label="Chiudi">&times;</button>
    <h2>{title}</h2>
    <div class="modal-meta">
      <span>⏱ {time} min</span>
      <span>📋 {difficulty}</span>
      <span>👥 {servings} persone</span>
    </div>
    <p>{description}</p>
    <a href={`/ricette/${slug}`} class="modal-link">Vedi ricetta completa</a>
  </div>
</div>

<script>
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  // Update modal content when event fires
  document.addEventListener('open-modal', (e) => {
    const { slug } = e.detail;
    // Fetch recipe data via inline data
    if (overlay) overlay.classList.add('open');
  });

  function closeModal() {
    if (overlay) overlay.classList.remove('open');
  }

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
</script>

<style>
  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 200;
    align-items: center;
    justify-content: center;
  }
  .modal-overlay.open {
    display: flex;
  }
  .modal {
    background: var(--card-bg);
    border-radius: var(--radius);
    padding: 2rem;
    max-width: 480px;
    width: 90%;
    position: relative;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text);
  }
  .modal h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .modal-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
  .modal p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  .modal-link {
    display: inline-block;
    background: var(--accent);
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  .modal-link:hover {
    opacity: 0.9;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add CardRicetta and ModalInfo components"
```

---

### Task 6: Build homepage with recipe grid

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write homepage**

Write to `src/pages/index.astro`:
```astro
---
import Layout from '../components/Layout.astro';
import CardRicetta from '../components/CardRicetta.astro';
import ModalInfo from '../components/ModalInfo.astro';
import { getCollection } from 'astro:content';

const ricette = await getCollection('ricette');
---

<Layout title="Homepage">
  <main class="home">
    <section class="hero">
      <h1>In Cucina con Giù</h1>
      <p>Ricette semplici e genuine, raccontate con passione.</p>
    </section>

    <section class="grid">
      {ricette.map((ricetta) => (
        <CardRicetta
          title={ricetta.data.title}
          image={ricetta.data.image}
          slug={ricetta.slug}
          difficulty={ricetta.data.difficulty}
          time={ricetta.data.time}
          servings={ricetta.data.servings}
          description={ricetta.data.description}
        />
      ))}
    </section>
  </main>
</Layout>

<style>
  .home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  .hero p {
    font-size: 1.125rem;
    color: #777;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
</style>
```

- [ ] **Step 2: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: build homepage with recipe grid"
```

---

### Task 7: Create recipe detail page

**Files:**
- Create: `src/pages/ricette/[...slug].astro`
- Create: `src/components/StepRicetta.astro`

- [ ] **Step 1: Create StepRicetta component**

Write to `src/components/StepRicetta.astro`:
```astro
---
export interface Props {
  number: number;
  text: string;
}

const { number, text } = Astro.props;
---
<div class="step">
  <div class="step-number">{number}</div>
  <p class="step-text">{text}</p>
</div>

<style>
  .step {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    padding: 1.25rem 0;
    border-left: 2px solid var(--accent);
    padding-left: 1.5rem;
    position: relative;
  }
  .step::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 1.5rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }
  .step-number {
    min-width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent);
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  .step-text {
    line-height: 1.7;
    padding-top: 0.25rem;
  }
</style>
```

- [ ] **Step 2: Create dynamic recipe page**

Write to `src/pages/ricette/[...slug].astro`:
```astro
---
import Layout from '../../components/Layout.astro';
import StepRicetta from '../../components/StepRicetta.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const ricette = await getCollection('ricette');
  return ricette.map((ricetta) => ({
    params: { slug: ricetta.slug },
    props: { ricetta },
  }));
}

const { ricetta } = Astro.props;
const { Content, data } = await ricetta.render();
const steps = ricetta.body.split('\n').filter(line => line.trim() && !line.startsWith('---'));
---

<Layout title={data.title}>
  <main class="recipe-page">
    <article>
      <div class="recipe-header">
        <div class="recipe-image">
          <img src={data.image} alt={data.title} />
        </div>
        <div class="recipe-info">
          <h1>{data.title}</h1>
          <div class="meta">
            <span>⏱ {data.time} min</span>
            <span>📋 {data.difficulty}</span>
            <span>👥 {data.servings} persone</span>
          </div>
          <p class="description">{data.description}</p>
        </div>
      </div>

      <section class="steps">
        <h2>Procedimento</h2>
        {steps.map((step, i) => (
          <StepRicetta number={i + 1} text={step.trim()} />
        ))}
      </section>
    </article>

    <div class="back">
      <a href="/">&larr; Torna alla homepage</a>
    </div>
  </main>
</Layout>

<style>
  .recipe-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
  .recipe-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  .recipe-image {
    border-radius: var(--radius);
    overflow: hidden;
    background: #e8e0d8;
    aspect-ratio: 4 / 3;
  }
  .recipe-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .recipe-info h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    flex-wrap: wrap;
  }
  .description {
    color: #666;
    line-height: 1.7;
  }
  .steps {
    margin-top: 2rem;
  }
  .steps h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .back {
    margin-top: 3rem;
  }
  .back a {
    color: var(--accent);
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .recipe-header {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add recipe detail page with step timeline"
```

---

### Task 8: Create Chi Siamo and Contatti pages

**Files:**
- Create: `src/pages/chi-siamo.astro`
- Create: `src/pages/contatti.astro`

- [ ] **Step 1: Create Chi Siamo page**

Write to `src/pages/chi-siamo.astro`:
```astro
---
import Layout from '../components/Layout.astro';
---

<Layout title="Chi Siamo">
  <main class="page">
    <h1>Chi Siamo</h1>
    <p>Benvenuti in "In Cucina con Giù"! Questo è un angolo dedicato alla cucina semplice e genuina, dove condivido le ricette che ho imparato e sperimentato nella mia cucina di casa.</p>
    <p>La filosofia è semplice: ingredienti freschi, passione per i sapori autentici e tanto amore per la buona tavola.</p>
  </main>
</Layout>

<style>
  .page {
    max-width: 700px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }
  .page h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  .page p {
    margin-bottom: 1rem;
    line-height: 1.7;
  }
</style>
```

- [ ] **Step 2: Create Contatti page**

Write to `src/pages/contatti.astro`:
```astro
---
import Layout from '../components/Layout.astro';
---

<Layout title="Contatti">
  <main class="page">
    <h1>Contatti</h1>
    <p>Hai domande, suggerimenti o vuoi condividere una tua ricetta? Scrivimi!</p>
    <p>Email: <a href="mailto:hello@incucinacongiu.it">hello@incucinacongiu.it</a></p>
  </main>
</Layout>

<style>
  .page {
    max-width: 700px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }
  .page h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  .page p {
    margin-bottom: 1rem;
    line-height: 1.7;
  }
</style>
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Chi Siamo and Contatti pages"
```

---

### Task 9: Final polish and verification

- [ ] **Step 1: Full build test**

```bash
npm run build && npm run preview
```
Expected: Site builds and previews at localhost.

- [ ] **Step 2: Verify responsive layout**

Check that the grid goes to 1 column on mobile, 2 on tablet.

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "feat: complete In Cucina con Giù site"
```
