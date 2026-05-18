# 3D Virtual Art Gallery

An immersive, interactive 3D art gallery built with React Three Fiber that allows visitors to explore a virtual exhibition space and view artwork in a realistic environment.

## Features

### Interactive 3D Environment
- Fully enclosed gallery room with realistic proportions
- Physically-based rendering (PBR) materials for realistic lighting
- Curated gallery layout with dedicated hang zones

### Advanced Framing & Display System
- **Multi-Style Framing**: Support for various frame styles to match the artwork medium:
  - `dark-ornate`: Matte black box with recessed gold bevel (e.g., for classic or dark pieces)
  - `minimal`: Brushed steel thin-bar frames (e.g., for graphite/charcoal)
  - `float`: Frameless with LED-emissive edges matching specific accent colors (e.g., for digital art)
  - `gilt`: Gold leaf with cream linen mat (e.g., for watercolours)
- **Dynamic Lighting**: Spotlights are subtly tinted to match individual frame accent colors.

### Artwork Inspection
- Click on any artwork to open the **Artwork Inspector**
- View high-resolution 3D models of the artwork with matching frames
- Detailed information cards (title, artist, year, medium, description)
- 3D orbit controls to examine the framing and texture closely

### Navigation Controls
- **Mouse**: Click and drag to look around
- **W/A/S/D or Arrow Keys**: Move through the gallery
- **Scroll**: Zoom in and out
- **Click on artwork**: Open the Artwork Inspector
- **ESC or X button**: Close the inspector

## Technical Stack

- **Frontend**: React (ES6+)
- **3D Engine**: Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **State Management**: Zustand
- **Build Tool**: Vite
- **Data**: JSON-based portfolio configuration

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Quick Start

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd art+gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown by Vite)

## Customization

### Adding More Artworks
Edit the `src/data/portfolio.json` file to add or modify artworks. Each entry supports detailed metadata, including custom frame styles:

```json
{
  "id": "new-artwork",
  "title": "Your Artwork Title",
  "artist": "Artist Name",
  "year": "2024",
  "medium": "Digital",
  "description": "Artwork description...",
  "image": "/assets/art/your-image.jpg",
  "wall": "Left",
  "position": [-5, 2, -2],
  "scale": [2, 3],
  "frameStyle": "float",
  "frameAccent": "#ff0000"
}
```

### Supported Frame Styles
- `dark-ornate`
- `minimal`
- `float`
- `gilt`

## Project Structure

```text
art+gallery/
├── public/
│   └── assets/           # Artwork images and textures
├── src/
│   ├── components/       # React Three Fiber components (GalleryArt, Lighting, etc.)
│   ├── data/             # JSON configuration files (portfolio.json)
│   ├── store/            # Zustand state management
│   ├── ui/               # 2D UI overlays and Artwork Inspector
│   ├── App.jsx           # Main application component
│   └── main.jsx          # React entry point
└── package.json          # Dependencies and scripts
```

## Known Limitations
- No mobile touch controls (desktop navigation prioritized)
- High-resolution textures may require optimization for lower-end devices

## Future Enhancements
- [ ] Mobile touch controls and joystick navigation
- [ ] VR mode with WebXR support
- [ ] Multiple gallery rooms and dynamic routing
- [ ] Audio tour integration

## License
This project is open source and available under the MIT License.
