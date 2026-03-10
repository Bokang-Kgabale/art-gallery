# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **3D brutalist art gallery** built with React Three Fiber (R3F) that renders an irregular pentagonal gallery space with physically-based materials, interactive camera controls, and postprocessing effects. The project migrated from vanilla Three.js to React Three Fiber for better component architecture and state management.

## Development Commands

```bash
# Start development server (Vite HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:5173` with hot module replacement.

## Architecture & Key Concepts

### Coordinate System & Scaling

**CRITICAL**: The gallery uses a **scaled coordinate system** that differs from ARCH.md specifications:

- ARCH.md specifies original dimensions (e.g., 6.8m × 6.0m pentagon)
- **Current implementation**: All dimensions scaled by **1.5x** (10.2m × 9.0m)
- Group offset: `[-5.1, 0, -4.5]` centers the pentagon at world origin
- Pentagon vertices in local coordinates: `(0,0) → (10.2,0) → (10.2,6.6) → (7.5,9.0) → (0.9,9.0) → (0,0)`

### Scene Architecture

The 3D scene is built using a component hierarchy:

```
App.jsx (Canvas + Postprocessing)
├── GalleryScene.jsx (Main scene - pentagon geometry)
│   ├── Floor (ShapeGeometry with custom UVs)
│   ├── Walls A-E (BoxGeometry, 4.5m height)
│   ├── Angled Ceiling (slopes 3.2m → 5.0m)
│   ├── Pillars A & B (CylinderGeometry, 64 segments)
│   └── Door & Windows (meshPhysicalMaterial for glass)
├── CameraControls.jsx (WASD movement + OrbitControls)
│   └── Pentagon boundary collision detection
└── Lighting.jsx (PBR lighting setup)
```

### Pentagon Collision Detection

**CameraControls.jsx** implements custom boundary checking:

```javascript
// Converts world coords → local pentagon coords
// Checks rectangular bounds + angled Wall C slope
const isInsidePentagon = (worldX, worldZ) => {
  const localX = worldX + 5.1  // Account for group offset
  const localZ = worldZ + 4.5
  // Check bounds and angled wall slope (-8/9)
}
```

When modifying room dimensions, **update both**:
1. Pentagon shape in `GalleryScene.jsx`
2. Collision detection in `CameraControls.jsx` (matching group offset)

### Material System & PBR

All surfaces follow ARCH.md PBR specifications:

- **Concrete walls/ceiling**: `#BFB8B0`, roughness 0.82, metalness 0.0
- **Granite floor**: `#A6A0A0`, roughness 0.28, with displacement mapping
- **Windows**: `meshPhysicalMaterial` with transmission 0.9, dark tint
- **Door/frames**: Black steel `#0A0A0A`, metalness 0.9

**Textures**: 4K textures loaded from `/public/`:
- Concrete: `/textures/concrete/Concrete031_4K-PNG_*.png`
- Granite: `/Granite006A_4K-PNG/Granite006A_4K-PNG_*.png`

### Custom UV Mapping for Pentagon Floor

The pentagon floor uses `ShapeGeometry` which doesn't auto-generate UVs. **GalleryScene.jsx** includes a `useMemo` hook that:
1. Creates ShapeGeometry from pentagon path
2. Manually generates UV coordinates normalized to pentagon bounds
3. Ensures textures map correctly to the irregular shape

**When modifying floor**: Update the UV normalization factors to match new dimensions.

### Camera & Movement System

**CameraControls.jsx** combines:
- **OrbitControls** from drei (mouse look, damping)
- **WASD keyboard movement** (custom `useFrame` hook)
- **Collision detection** prevents walking through walls

Movement updates camera position in `useFrame`, then constrains via `isInsidePentagon()`. The OrbitControls target follows camera to maintain look direction.

### Wall Height Asymmetry

**Unique feature**: Wall A (entrance) kept at original 3.2m height, while walls B-E raised to 4.5m. This creates dramatic volume with the angled ceiling sloping from 3.2m (front) to 5.0m (back).

### Postprocessing Pipeline

Per ARCH.md, uses `@react-three/postprocessing`:
```jsx
<EffectComposer multisampling={4}>
  <Bloom luminanceThreshold={0.9} intensity={0.15} />
  <ChromaticAberration offset={[0.0003, 0.0003]} />
  <Vignette offset={0.3} darkness={0.5} />
</EffectComposer>
```

**Note**: SSAO and DepthOfField removed due to WebGL context errors. Keep multisampling ≤ 4.

## Important Implementation Details

### Pentagon Geometry Construction

Walls are **BoxGeometry** positioned at edges, **NOT extruded paths**. Wall C (angled) uses rotation `Math.PI / 4` for 45° bevel. Each wall:
- Position: Calculated from midpoint of edge
- Rotation: 0 or `Math.PI / 2` for vertical walls, `-Math.PI / 4` for Wall C
- Thickness: 0.3m (ARCH.md spec)

### Angled Ceiling Implementation

The ceiling slopes from Wall A to Wall D:
```javascript
position={[5.1, 4.1, 4.5]}  // Centered, midpoint height
rotation={[Math.PI / 2 + Math.atan((5.0 - 3.2) / 9.0), 0, 0]}
// Base rotation + slope angle
```

### Pillar Positioning

Two cylindrical pillars (ARCH.md scaled 1.5x):
- **Pillar A**: `(3.9, 2.25, 3.9)` - original (2.6, 2.6) × 1.5
- **Pillar B**: `(6.3, 2.25, 4.8)` - original (4.2, 3.2) × 1.5
- Diameter: 0.63m (0.42m × 1.5), Height: 4.5m, 64 segments

### Window & Door Glass Materials

Windows use `meshPhysicalMaterial` for realistic glass:
```javascript
transmission={0.9}  // Light passes through
opacity={0.4}
roughness={0.05}
thickness={0.5}
color="#87CEEB"  // Subtle blue tint
```

Frames use high metalness (0.9) black steel for contrast.

## Common Modifications

### Changing Room Size

1. **Update pentagon shape** in `GalleryScene.jsx`:
   ```javascript
   floorShape.lineTo(newX, newZ)  // For each vertex
   ```

2. **Update group offset** (to center):
   ```javascript
   <group position={[-newX/2, 0, -newZ/2]}>
   ```

3. **Update collision detection** in `CameraControls.jsx`:
   ```javascript
   const localX = worldX + newX/2
   const localZ = worldZ + newZ/2
   if (localX < margin || localX > newX - margin...)
   ```

4. **Update angled wall calculation** if changing Wall C slope.

### Adding Artworks

Currently removed from `GalleryScene.jsx`. To re-add:
1. Uncomment `GalleryArt` component imports
2. Use `portfolioData` from `/src/data/portfolio.json`
3. Position artworks along Wall D (back wall)
4. Pass `onArtworkSelect` prop from App.jsx

### Modifying Materials

All materials follow ARCH.md specifications. To change:
- Concrete: Update `#BFB8B0` and roughness 0.82
- Floor: Update granite texture paths in `useLoader`
- Glass: Adjust `transmission` and `opacity` in window meshes

Avoid changing metalness unless intentionally adding metallic surfaces.

## Texture Management

Textures live in `/public/` and load via relative paths:
- `/Granite006A_4K-PNG/` - Floor textures (Color, Normal, Roughness, Displacement)
- `/textures/concrete/` - Wall textures (Color, Normal, Roughness)

**Texture wrapping** configured via `RepeatWrapping` and `.repeat.set(x, y)` for tiling.

## ARCH.md Reference

The `ARCH.md` file contains **authoritative architectural specifications**:
- Original pentagon coordinates (unscaled)
- PBR material parameters (hex colors, roughness, metalness)
- Lighting specifications (color temps, intensities)
- Opening dimensions (door 0.95m × 2.2m, windows 0.45m × 2.0m)

**Current implementation deviates**:
- Scaled 1.5x from ARCH.md dimensions
- Wall heights modified (B-E raised to 4.5m)
- Simplified postprocessing (no SSAO/DOF)

When implementing ARCH.md features, apply 1.5x scaling factor and update collision detection.

## Known Issues & Limitations

- **WebGL context loss** with too many postprocessing effects (keep ≤3 effects)
- **Texture loading** requires local server (cannot use file:// protocol)
- **Pentagon collision** uses simplified rectangular + angled wall check (not true polygon containment)
- **No mobile support** (WASD controls desktop-only)

## State Management

Currently uses React `useState` in App.jsx for:
- `selectedArtwork` - Controls modal visibility

No Zustand store active (dependency present but unused). For complex state, consider implementing store in `/src/store/`.

## Rendering Performance

Target 60 FPS on modern GPUs:
- Shadow map resolution: 1024-2048
- Texture LODs: Use 2K for real-time, 4K for hero shots
- Cylinder segments: 64 for pillars (smooth but not excessive)
- Multisampling: 4 (higher causes WebGL issues)
