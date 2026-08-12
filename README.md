# Conway's Game of Life 🧬

A high-performance, web-based simulation of John Conway's Game of Life built with **React 19**, **Vite**, and **HTML5 Canvas**. Engineered with `Uint8Array` double-buffered state management, multi-touch gesture support, Web Audio API ambient sonification, customizable cellular rulesets, and interactive pattern stamping.

---

## 🕊️ Dedication & Tribute

> **In Memory of My Father (19?? – 2001)**
>
> *This project is dedicated in loving memory to my father. From the mid-1960s until his passing in 2001, whenever he set out to learn a new programming language—from assembly and punch cards to modern high-level code—his very first benchmark project was always Conway's Game of Life.*
> 
> *Building this modern implementation is my tribute to his lifelong passion for computing, curiosity, and problem solving. May his legacy continue to compute.*

---

## ✨ Features

- **⚡ High-Performance Canvas Engine**
  - Custom HTML5 2D Canvas renderer powered by `Uint8Array` TypedArrays for ultra-fast generation calculations (60 FPS @ 10,000+ cells).
  - Smooth cell age decay trails where dying cells leave a fading, atmospheric glow.
  - Multi-touch gesture support: pinch-to-zoom ($0.5\times$ to $50\times$) and two-finger pan on mobile; cursor drag and scroll wheel zoom on desktop.

- **🎵 Web Audio API Ambient Sonification**
  - Procedural sound synthesis engine that translates cellular births into pentatonic harmonic chimes (C4 to C6).
  - Dynamic pitch mapping based on total population density and grid activity.

- **🎨 Themes & Modern Glassmorphic UI**
  - **Cyberpunk Neon**: Radiant cyan and vivid magenta glow.
  - **Bioluminescence**: Deep oceanic teal and emerald.
  - **Deep Space**: Violet, indigo, and nebula purple.
  - **Matrix**: Classic hacker green terminal aesthetic.
  - **Solarized Amber**: Warm retro gold luminescence.

- **🧩 Pattern Stamp Library**
  - Interactive placement preview with 90° rotation and horizontal/vertical flipping.
  - Pre-loaded iconic structures across multiple categories:
    - **Spaceships**: Glider, Lightweight Spaceship (LWSS), Middleweight Spaceship (MWSS).
    - **Guns & Generators**: Gosper Glider Gun.
    - **Oscillators**: Pulsar, Blinker, Toad.
    - **Methuselahs**: R-Pentomino, Acorn.

- **⚙️ Customizable Cellular Automata Rules & World Physics**
  - **Standard Conway's Life** (`B3/S23`)
  - **HighLife** (`B36/S23`) — Replicator-rich evolution.
  - **Seeds** (`B2/S`) — Pure birth chaos.
  - **Day & Night** (`B3678/S34678`) — Symmetric dark/light dual states.
  - **Life Without Death** (`B3/S012345678`) — Ink-spread maze generation.
  - **Custom Rule Builder**: Input any custom `B.../S...` string.
  - **Grid Boundaries**: Choose between **Toroidal** (wrap-around edges) or **Bounded** canvas walls.

- **📊 Real-time HUD & Analytics**
  - Live Generation Counter, Population Count, Births/Deaths metrics, and target/actual FPS readout.
  - Real-time population sparkline graph tracking life cycles over generations.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` or `yarn`

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CaliMark/game-of-life.git
   cd game-of-life
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Linting:**
   ```bash
   npm run lint
   ```

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **UI Framework** | [React 19](https://react.dev/) | Component architecture & state synchronization |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Lightning-fast HMR and bundle compilation |
| **Graphics** | HTML5 Canvas 2D API | Canvas grid renderer with double-buffered `Uint8Array` |
| **Audio** | Web Audio API | Synth engine playing pentatonic chimes based on birth events |
| **Styling** | Vanilla CSS3 | Custom CSS variables, glassmorphic filters, responsive layout |
| **Linter** | [Oxlint](https://oxc.rs/) | Fast JavaScript code linting |

---

## 📂 Project Structure

```
game-of-life/
├── public/                 # Static assets & favicon
├── src/
│   ├── components/         # React UI Components
│   │   ├── CanvasViewport.jsx        # Main Canvas render engine & input handlers
│   │   ├── ControlBar.jsx            # Transport controls (Play/Pause, Step, Speed)
│   │   ├── PatternLibraryModal.jsx   # Pattern selection dialog
│   │   ├── SettingsModal.jsx         # Rulesets, grid size & audio settings
│   │   ├── StatsHUD.jsx              # Generation counters & population sparkline
│   │   ├── ThemeSelectorModal.jsx    # Visual theme picker
│   │   ├── ToolBar.jsx               # Drawing tools (Pencil, Eraser, Stamp)
│   │   └── UnifiedControlDock.jsx    # Floating glassmorphic dock container
│   ├── styles/             # Modular CSS styles & theme variables
│   ├── utils/              # Pure engine utilities & physics logic
│   │   ├── lifeEngine.js             # Double-buffered cell grid computation engine
│   │   ├── patterns.js               # Pattern library matrices
│   │   └── soundEngine.js            # Web Audio synthesizer tone engine
│   ├── App.jsx             # Main application container
│   ├── App.css             # Main styling & layout rules
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
