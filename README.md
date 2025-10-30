# 3D Virtual Art Gallery

An immersive, interactive 3D art gallery built with Three.js that allows visitors to explore a virtual exhibition space and view artwork in a realistic environment.

![Art Gallery Preview](preview.gif)

## Features

### Interactive 3D Environment
- Fully enclosed gallery room with realistic proportions (10m x 10m x 3m)
- Textured wooden floor and matte walls
- Physically-based rendering (PBR) materials for realistic lighting

### Advanced Lighting System
- Multiple ceiling lights for even illumination
- Individual spotlights for each artwork
- Warm gallery lighting (~3500K color temperature)
- Real-time shadow rendering with soft edges

### Artwork Display
- Multiple artworks displayed on all four walls
- Custom frames with metallic finish
- Click-to-view information cards (title, artist, year)
- Hover effects with subtle scale and glow

### Navigation Controls
- **Mouse**: Click and drag to look around
- **W/A/S/D or Arrow Keys**: Move through the gallery
- **Scroll**: Zoom in and out
- **Click on artwork**: Display detailed information
- **ESC or X button**: Close information card

### Visual Effects
- Hover highlights on artworks
- Smooth camera movement with collision detection
- Dynamic shadows and reflections
- Responsive design that adapts to viewport size

## Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **3D Engine**: Three.js (v0.160.0)
- **Rendering**: WebGL via Three.js
- **Controls**: OrbitControls for camera movement
- **No Backend Required**: Static hosting compatible

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, or Edge)
- Local web server (required for ES6 modules)

### Quick Start

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd art+gallery
   ```

2. **Add your artwork images**
   - Place artwork images in the `/assets/` folder
   - Supported formats: JPG, PNG
   - Recommended size: 1024x1024px or similar aspect ratio

3. **Start a local server**

   Choose one of the following methods:

   **Option 1: Python**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Node.js**
   ```bash
   npx serve
   # or
   npx http-server
   ```

   **Option 3: VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **Open in browser**
   - Navigate to `http://localhost:8000` (or the port shown by your server)
   - The gallery will load automatically

## Project Structure

```
art+gallery/
├── index.html          # Main HTML entry point
├── main.js            # Three.js application logic
├── style.css          # Styling for UI overlays
├── assets/            # Artwork images and textures
│   ├── art1.png
│   ├── art2.png
│   ├── art3.jpg
│   └── art4.png
├── PRD.md             # Product Requirements Document
├── TASKS.md           # Development task checklist
└── README.md          # This file
```

## Customization

### Adding More Artworks

Edit the `artworkData` array in [main.js](main.js#L20):

```javascript
const artworkData = [
    {
        title: 'Your Artwork Title',
        artist: 'Artist Name',
        year: '2024',
        image: 'assets/your-image.jpg',
        wall: 'north',  // north, south, east, or west
        position: 0     // 0 for left, 1 for right
    },
    // Add more artworks...
];
```

### Adjusting Room Size

Modify the room dimensions in the `createRoom()` function in [main.js](main.js#L108):

```javascript
const roomSize = 10;      // Width and depth in meters
const wallHeight = 3;     // Height in meters
```

### Changing Lighting

Adjust lighting parameters in the `setupLighting()` function in [main.js](main.js#L77):

```javascript
// Ambient light intensity
const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.4);

// Spotlight intensity and angle
const spotlight = new THREE.SpotLight(0xfff5e6, 2.0, 10, Math.PI / 8, 0.4, 1.5);
```

### Movement Speed

Change the movement speed in [main.js](main.js#L15):

```javascript
const moveSpeed = 0.05;  // Increase for faster movement
```

### Room Boundaries

Adjust collision boundaries in [main.js](main.js#L16):

```javascript
const roomBounds = { min: -4.5, max: 4.5 };
```

## Code Structure

The application is organized into modular functions:

- `initScene()` - Initialize Three.js scene, camera, and renderer
- `setupControls()` - Configure OrbitControls for navigation
- `createRoom()` - Build the gallery room geometry and textures
- `setupLighting()` - Configure ambient and spotlight illumination
- `loadArtworks()` - Load and position artworks with frames
- `setupInteractivity()` - Handle mouse/keyboard events and raycasting
- `updateCameraMovement()` - Process WASD keyboard movement
- `animate()` - Main animation loop

## Performance Optimization

The gallery is optimized for 60+ FPS on modern browsers:

- Efficient shadow mapping (1024x1024 resolution)
- Optimized texture sizes with canvas-based procedural generation
- Culling of off-screen objects
- Hardware-accelerated WebGL rendering

## Browser Compatibility

Tested and supported on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)

**Requirements:**
- WebGL support
- ES6 module support
- Modern JavaScript features

## Accessibility

- Full keyboard navigation support (W/A/S/D + Arrow keys)
- Mouse-only navigation available
- Info cards with clear, readable text
- On-screen control instructions

## Known Limitations

- Requires local server for ES6 module imports
- No mobile touch controls (desktop only)
- Maximum 4 artworks per wall (8 total recommended)
- Asset loading depends on local file paths

## Future Enhancements

Potential features for future development:

- [ ] Multiple gallery rooms
- [ ] Backend integration for dynamic artwork loading
- [ ] VR mode with WebXR support
- [ ] Animated transitions between rooms
- [ ] Background ambient audio
- [ ] First-person PointerLock controls option
- [ ] Mobile touch controls
- [ ] Artwork zoom/detail view
- [ ] Social sharing features
- [ ] Admin panel for artwork management

## Deployment

The gallery can be deployed to any static hosting service:

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
# Drag and drop the folder to netlify.com
# Or use Netlify CLI
npm i -g netlify-cli
netlify deploy
```

### GitHub Pages
1. Push to a GitHub repository
2. Go to Settings > Pages
3. Select branch and folder
4. Save and wait for deployment

## Troubleshooting

### Gallery doesn't load
- Make sure you're using a local server (not file://)
- Check browser console for errors
- Verify Three.js CDN is accessible

### Artworks not showing
- Check image file paths in `artworkData`
- Ensure images exist in `/assets/` folder
- Check browser console for 404 errors

### Performance issues
- Reduce shadow map resolution
- Decrease number of lights
- Optimize texture sizes
- Close other browser tabs

### Controls not working
- Click on the canvas to focus
- Check browser console for JavaScript errors
- Try refreshing the page

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.

## Credits

- Built with [Three.js](https://threejs.org/)
- Inspired by real-world art galleries and virtual museums

## Contact

For questions or feedback, please open an issue in the repository.

---

**Enjoy exploring the virtual gallery!**
