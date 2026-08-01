<div align="center">

# 🎂 Maria's Birthday Website

### ✨ React + Vite + Vercel Ready

*A beautiful interactive birthday experience wrapped in a modern React application without changing any of the original animations or functionality.*

---

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)
![Status](https://img.shields.io/badge/Status-Ready-success?style=for-the-badge)

</div>

---

# 💖 About

This project is the original **Maria's Birthday Website**, carefully repackaged into a **React (Vite)** application so it can be deployed effortlessly to **Vercel**.

Instead of rebuilding the entire animation engine in React—which could easily break the carefully crafted experience—this project uses a lightweight wrapper approach that preserves **100% of the original behavior**.

> ✨ Every animation, interaction, transition, and effect works exactly as before.

---

# ✨ Features

- 🎉 Original birthday experience preserved
- ⚛️ React 18 powered
- ⚡ Vite for lightning-fast development
- 🌐 One-click deployment to Vercel
- 🎵 Background music
- 🎆 Confetti effects
- ✉️ Interactive envelope
- 🎁 Scratch card
- ❓ Quiz section
- 📖 Chapter pagination
- 🖼️ Gallery & memories
- 🔍 Image lightbox
- 💫 GSAP animations
- 🌊 Smooth Lenis scrolling

---

# 📁 Project Structure

```
.
├── public/
│   ├── images/
│   └── music/
│
├── src/
│   ├── site/
│   │   ├── markup.html
│   │   └── scripts/
│   ├── App.jsx
│   └── styles.css
│
├── index.html
├── package.json
└── README.md
```

---

# 🏗 How It Works

Rather than converting hundreds of lines of handcrafted HTML, CSS, Canvas, and JavaScript into React components, this project follows the **Legacy JS in React** pattern.

## `index.html`

Loads:

- Google Fonts
- GSAP
- ScrollTrigger
- Lenis
- Canvas Confetti
- React entry point

---

## `src/App.jsx`

Responsible for:

- Injecting the original HTML
- Executing the original script files
- Preserving the exact execution order

Nothing is rewritten.

---

## `src/site/markup.html`

Contains the original page markup.

Imported using:

```js
import markup from "./site/markup.html?raw";
```

---

## `src/site/scripts/`

Contains every original inline script split into individual files.

Examples:

```
gallery-reasons-quiz.js
scratch-card.js
music-player.js
pagination.js
envelope.js
lightbox.js
...
```

---

## `src/styles.css`

Contains the original CSS exactly as it appeared in the standalone website.

---

# ❤️ Why This Approach?

Instead of rewriting everything into React components...

❌ No broken animations

❌ No lost functionality

❌ No debugging GSAP timelines

❌ No React lifecycle issues

Instead...

✅ Original JavaScript runs unchanged

✅ React simply mounts the page

✅ Every interaction behaves exactly like the original

---

# 📦 Required Assets

Create the following folders before deployment.

```
public/
├── images/
│   ├── hero.jpg
│   └── chapter2.jpg
│
└── music/
    └── birthday.mp3
```

### Images

| File | Purpose |
|------|----------|
| `hero.jpg` | Chapter 1 Hero Image |
| `chapter2.jpg` | Chapter 2 Photo |

### Music

| File | Purpose |
|------|----------|
| `birthday.mp3` | Background Music |

---

## 📸 Memory Gallery

The photos used inside the **Beautiful Memories** section are already embedded as **Base64** data inside:

```
src/site/scripts/gallery-reasons-quiz.js
```

No additional image files are required.

---

# 🚀 Run Locally

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open the URL shown by Vite (usually)

```
http://localhost:5173
```

---

# 🌍 Deploy to Vercel

## Option 1 — Vercel CLI

Install the CLI

```bash
npm install -g vercel
```

Deploy

```bash
vercel
```

Vercel automatically detects the project as a **Vite** application.

---

## Option 2 — Vercel Dashboard

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Open **Vercel Dashboard**.
3. Click **Add New Project**.
4. Import the repository.
5. Vercel automatically detects:

```
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

6. Click **Deploy** 🚀

---

# 📚 Tech Stack

| Technology | Purpose |
|------------|----------|
| React 18 | Application Wrapper |
| Vite 5 | Development & Build Tool |
| GSAP | Animations |
| ScrollTrigger | Scroll Animations |
| Lenis | Smooth Scrolling |
| Canvas Confetti | Celebration Effects |
| HTML/CSS/JavaScript | Original Website |

---

# 📝 Notes

- Uses **React 18**
- Uses **Vite 5**
- No additional GSAP packages required
- CDN libraries remain unchanged
- Original animations are preserved
- Fully compatible with Vercel deployment

---

# 🔮 Future Possibilities

If desired, this wrapper can later evolve into a fully component-based React application featuring:

- ⚛️ React state management
- 🧩 Reusable components
- 📱 Better responsiveness
- 🎨 Easier customization
- 🛠️ Cleaner code architecture

The current implementation prioritizes **zero behavior changes** while providing the fastest path to deployment.

---

<div align="center">

### 🎂 Made with ❤️ for Maria

*Preserving every animation, every interaction, and every magical moment.*

⭐ If you like this project, consider giving it a star!

</div>