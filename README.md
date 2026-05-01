# ⚡ Garvit Ranka — Cybersecurity Portfolio

> *Breaking, building, securing. From frontend to firewall.*

A high-performance, cinematic personal portfolio built with a cybersecurity-first aesthetic. Features an immersive terminal preloader, matrix rain canvas, glassmorphism UI, a spatial soundscape, and interactive skill/certification modals.

---

## 🖥️ Live Demo

**[garvitranka.xyz](https://garvitranka.xyz)**

---

## ✨ Feature Highlights

### 🎬 Cinematic Loading Experience
- **Terminal-style preloader** — animated typewriter output mimicking a CLI boot sequence
- **Interactive audio prompt** — users type `Y` or `N` to enable the cinematic soundscape before the site loads
- **Smooth GSAP exit transition** — preloader slides off with an `expo.inOut` easing

### 🌧️ Matrix Rain Background
- **Canvas-based katakana + hex rain** — rendered at 60fps, fading in with transparency
- Subtle `0.12` opacity — atmospheric without distracting from content

### 🔊 Immersive Spatial Soundscape
- **Background music** (`bg.mp3`) — ambient loop with volume balanced at 50%
- **Click feedback** — sharp click sound at 100% volume
- **Hover texture** — soft hover audio triggered on all interactive elements (desktop only)
- **Mouse movement ambience** — ultra-subtle 20% volume layer for depth
- **Mobile-aware** — hover/movement sounds automatically disabled on touch devices
- **Manual controls** — Play/Pause + Mute buttons, hidden during loading, fade in after hero appears

### 🧲 Magnetic Custom Cursor
- **Delegated event system** — works on all elements including dynamically injected modals
- **Snap hand cursor** on hover, `mix-blend-mode: difference` for visibility everywhere

### 💼 Interactive Skill System
- **Skill tags by category** — Cybersecurity / Cloud / Development / Tools
- **Click any tag** → glassmorphic modal popup with description, tools, and experience level
- **Tech tags on project cards** — also clickable for expanded context

### 🏆 Certification Company Cards
- **Real company SVG logos** — Google, Microsoft (Windows logo), Oracle, GitHub
- **Click any card** → full modal listing all certs with descriptions
- **Glow on hover** — cyan drop shadow effect

### 🔭 Active Nav Highlight
- ScrollTrigger-based — nav link underlines with a neon cyan glow as you scroll into each section

### 🎞️ Lazy Video Background
- Background video deferred until **after the preloader exits** — instant terminal load even on slow connections

### 🔠 Animated Gradient Typography
- **Garvit Ranka** — white-to-grey animated gradient + subtle zoom pulse
- **Section titles** — white/cyan/purple cycling gradient, `font-weight: 700`
- **Project names** — same gradient, larger `clamp()` sizes
- **Hero subtitle** — typewriter cycling through 8 identity phrases (cybersecurity + cloud + dev)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5 (Semantic) |
| **Styling** | Vanilla CSS, CSS Custom Properties, Glassmorphism |
| **Animations** | GSAP 3.12, ScrollTrigger, CSS `@keyframes` |
| **Typography** | Space Grotesk + Inter (Google Fonts) |
| **Icons** | Font Awesome 6.5 |
| **Canvas** | Web Canvas API (Matrix Rain) |
| **Audio** | Web Audio API (HTML5 Audio elements) |
| **Hosting** | GitHub Pages |

---

## 📁 Project Structure

```
portfolio/
├── index.html          # Main page — all sections, HTML structure
├── style.css           # All styles — glassmorphism, animations, layout
├── script.js           # All logic — GSAP, audio, cursor, modals, canvas
└── assets/
    ├── Resume.pdf       # Downloadable CV
    ├── audio/
    │   ├── bg.mp3       # Ambient background loop
    │   ├── click.mp3    # Click feedback
    │   ├── hover.mp3    # Hover texture
    │   └── move.mp3     # Mouse movement ambience
    ├── images/
    │   ├── selfimg.png  # Profile photo
    │   ├── favicon.ico  # Browser tab icon
    │   └── preview.png  # Social preview image
    └── videos/
        └── vduie.mp4    # Background scroll video (lazy-loaded)
```

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/garvit835/portfolio.git
cd portfolio

# Serve with any static server (e.g. Python)
python -m http.server 8000

# Or with Node
npx serve .
```

Then open **http://localhost:8000**

---

## 🎯 SEO & Performance

- ✅ Open Graph + Twitter Card meta tags
- ✅ Semantic HTML5 (`<section>`, `<nav>`, `<main>`, `<footer>`)
- ✅ Lazy-loaded video (deferred until post-preloader)
- ✅ `preload="none"` on video — no bandwidth wasted on load
- ✅ `pointer-events: none` on canvas — zero interaction cost for matrix rain
- ✅ Mobile-optimized — hover/move sounds disabled on touch devices

---

## 👤 About Garvit

Cybersecurity student with hands-on VAPT experience and certifications from **Microsoft**, **Google**, **Oracle**, and **GitHub**. Building at the intersection of security, full-stack development, and AI.

- 🔗 [LinkedIn](https://linkedin.com/in/garvit835)
- 🐙 [GitHub](https://github.com/garvit835)
- 📧 garvitranka8@gmail.com

---

*Designed and developed by Garvit Ranka © 2026*
