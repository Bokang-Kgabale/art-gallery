# The Brutalist Gallery 🏛️

An immersive, interactive 3D virtual art gallery built with React Three Fiber and Three.js. The gallery hosts the digital and physical portfolio of B. Kgabale, combining brutalist concrete architecture, realistic physically-based rendering (PBR) materials, and cinematic lighting.

---

## 🌟 Key Features

### 🏛️ Interactive 3D Brutalist Environment
- **Monolithic Concrete Architecture**: Heavy slabs, columns, and raw textures rendered using high-detail PBR materials.
- **Natural Light Cycle**: Aligned morning sunlight path entering through the skylight and main entrance, casting dramatic, long shadows across the concrete gallery floor.
- **Warm Spotlight Washes**: Premium architectural spotlights with colored tints matched to each artwork's frame style to highlight canvas textures and depth.

### 🖼️ Advanced Framing System
Each portfolio piece is assigned a unique frame style tailored to its medium and aesthetic:
- **`dark-ornate`**: Matte black deep frame with a gold bevel edge, perfect for classic and high-contrast digital art.
- **`minimal`**: Sleek, thin brushed steel frame with realistic reflection properties, designed for graphite and charcoal work.
- **`float`**: Frameless display with back-lit, neon LED glow matching the artwork's accent color, designed for futuristic digital art.
- **`gilt`**: Rich gold leaf frame with a textured cream linen mat, bringing watercolours to life.

### 🔍 Cinematic Artwork Inspector
- **Isolated Studio Viewport**: Renders the selected artwork in a dedicated 3D canvas using the `"studio"` environment map for professional lighting.
- **Free-Look Orbit Controls**: Click **⊕ ROTATE** to unlock camera rotation, enabling visitors to drag, spin, and inspect the physical frame thickness, linen mat, and bevels.
- **Automatic State Reset**: Re-locking or closing the inspector automatically repositions the camera and resets rotation.
- **Suspense & Error Protection**: Native React `<Suspense>` boundaries prevent render crashes when fetching uncached textures and environmental assets.

---

## 🛠️ Technical Stack

- **Framework**: React (ES6+)
- **3D Graphics**: Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & Custom CSS

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version 16.x or newer
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd art+gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the local development server**
   ```bash
   npm run dev
   ```

4. **Open in your browser**
   - Access the site at `http://localhost:5173` (or the port indicated in your console output).

---

## 🎨 Customization & Portfolio Management

### Adding and Modifying Artworks
The gallery dynamically renders all pieces defined in `src/data/portfolio.json`. You can easily add or edit artworks:

```json
{
  "id": "moms-request",
  "title": "Mom's Request",
  "artist": "B. Kgabale",
  "year": "2025",
  "medium": "Digital Watercolour",
  "description": "Made at the request of the artist's mother. A tender piece...",
  "image": "/assets/Mom_s_Request.jpeg",
  "wall": "bottom",
  "localPos": [4.8, 2.0, 0.28],
  "width": 2.4,
  "height": 2.8,
  "collection": null,
  "frameStyle": "gilt",
  "frameAccent": "#c8a040"
}
```

### Frame Properties
- `frameStyle`: Choose from `dark-ornate`, `minimal`, `float`, or `gilt`.
- `frameAccent`: Hex color code for the emissive glow or frame reflection highlights.

---

## 📁 Project Structure

```text
art+gallery/
├── public/
│   └── assets/           # High-resolution artwork textures and image assets
├── src/
│   ├── components/       # R3F scene components (GalleryScene, GalleryArt, Floor, etc.)
│   ├── data/             # JSON configs (portfolio.json defining artwork locations)
│   ├── store/            # Zustand global state (camera positions, selection states)
│   ├── ui/               # 2D overlays, HUD, and the ArtworkInspector panel
│   ├── App.jsx           # Main application entry canvas
│   └── main.jsx          # React app DOM mounting point
├── package.json          # Dependencies & scripts
└── README.md             # Project documentation
```

---

## 📝 License
This project is open-source and licensed under the [MIT License](LICENSE).
