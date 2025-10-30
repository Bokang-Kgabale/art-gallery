A — Architectural floor plan (precise, in meters)

Use a consistent coordinate system: origin (0,0) at bottom-left corner of the plan (interior face of walls). Units = meters.

Room footprint (irregular pentagon, single floor):

Wall A (bottom): from (0, 0) to (6.8, 0). — includes entry door near right end.

Wall B (right vertical): from (6.8, 0) to (6.8, 4.4) — has two tall window bays (see below).

Wall C (angled): from (6.8, 4.4) to (5.0, 6.0) — 45° style bevel connecting right and top walls.

Wall D (top): from (5.0, 6.0) to (0.6, 6.0).

Wall E (left vertical): from (0.6, 6.0) to (0, 0).

Ceiling height:

Default slab: 3.2 m above finished floor.

Raised zone near Wall D (top half of room): 3.5 m to create subtle volume difference (optional ramp between heights 0.3 m).

Walls thickness:

0.3 m (concrete slab thickness). In the 3D model, wall meshes include a 0.3 m thickness volume.

Openings & interior items (absolute coordinates):

Main door (pivot)

Centered at x = 6.0 m on Wall A (bottom), offset so door leaf swings inward.

Door leaf width: 0.95 m, height: 2.2 m. Pivot door, black steel frame with 20 mm glazing margin if glass used; else solid black steel.

Vertical slit windows (right wall)

Two vertical windows (full height):

Window 1 center at (6.8, 1.6) — opening: 0.45 m wide × 2.0 m tall, bottom sill at 0.9 m above floor.

Window 2 center at (6.8, 3.0) — same dims.

Deeply recessed: opening depth = wall thickness + 0.1 m (so 0.4 m recess inside). Dark-tint glazing.

Circular accent window (top-left)

Center at (0.9, 5.4). Diameter: 0.6 m. High on wall (center 2.6 m above floor).

Ribbon window (left/long wall possibility)

Low horizontal ribbon along left wall is optional; if present: start (0.1, 1.0) to (0.1, 3.0) — height 0.6 m centered at 1.2 m above floor.

Two interior concrete pillars (cylindrical)

Pillar A center at (2.6, 2.6). Pillar B center at (4.2, 3.2).

Diameter: 0.42 m, full height to ceiling (3.2 m). Exposed board-formed concrete.

Bench / display platform (lower left)

Rectangular platform along Wall A left zone: from x=0.3 to x=3.3, depth 0.6 m, height 0.45 m (built into wall niche). Material: cast concrete top with wooden seat option.

Main display wall

Best wall for artworks: Wall D (top wall) or Wall B (right wall) depending on circulation. Provide 3.0 m × 1.6 m display zones with hidden cleats.

Circulation flow: Entry (bottom) → move past bench → between pillars → main display wall → angled corner highlights the space toward circular window.

B — Material & finish specification (exact PBR parameters)

Base material: Board-formed concrete (exposed)

Albedo / Base color: neutral beige-gray — hex #BFB8B0 (sRGB).

Roughness: 0.82

Metalness: 0.0

Normal intensity: 1.0 (use normal map from timber grain imprint)

AO: baked ambient occlusion map

Height/displacement: subtle 0.02 m displacement for formwork grain when rendering close-ups

Specular/reflectivity: use standard PBR (no metalness)

Window frames: Matte Black Steel

Albedo: #0B0B0B

Roughness: 0.5

Metalness: 0.7

Glazing

Transmission: 0.05 (dark tint)

Roughness: 0.05

IOR: 1.52

Use reflection with PMREM environment maps

Floor: Polished concrete / terrazzo

Albedo: #A6A0A0

Roughness: 0.28

Metalness: 0.0

Normal map: mild micro texture

Clear coat: optional slight specular clearcoat 0.15

Bench top (if wood accent used)

Albedo wood tone: #6F4E37

Roughness: 0.6

Metalness: 0

Pillars

Same as board-formed concrete with slightly higher roughness 0.86

Lighting color temps

Ambient fill: 4000K neutral (low intensity).

Accent spotlights: 3000K warm (artwork illumination).

Skylight / HDRI: 6500K neutral daylight depending on chosen HDRI.

Textures: prefer 4K source textures for close shots, but provide 2k LODs for performance.

C — Asset creation & export requirements (for AI / 3D artist)

Modeling tools: Blender (strongly recommended), 3ds Max or Rhino accepted. Units = meters. Apply scale transforms.

Export format:

Primary: glTF 2.0 (.glb) binary (preferred for web).

Include: embedded PBR textures (PNG or JPEG for basecolor; PNG for maps needing alpha), binary geometry.

Secondary: .blend / .fbx for source.

Modeling rules:

Walls and slabs modeled as real volumes (no thin planes). Bool cleaned, manifold meshes.

Floor and ceiling separate objects (named floor_concrete, ceiling_slab).

Pillars medium-poly cylinders: 64 segments for smoothness.

Windows: modeled as opening geometry (no separate glass object inside .blend — in .glb, separate glass_mesh with material).

Bench / platform: bench_concrete, optional bench_wood_top.

Provide lightmap UVs (second UV channel) for static baked AO if needed.

LODs: Provide LOD0 (full), LOD1 (50% tris), LOD2 (20% tris). Name convention: object_LOD0, etc.

Texture maps per material:

albedo/basecolor — sRGB

normal — linear normal map

roughness — linear map

metalness — linear map (mostly zero for concrete)

ao — linear map

height/displacement — linear (optional)

Each map: max resolution 4096×4096 (for hero assets); include 2048 and 1024 LOD versions.

Compression:

Geometry: use Draco or Meshopt compression for web glb.

Textures: provide WebP or JPEG for basecolor (visually lossless) and PNG for normal/roughness/metalness if transparency required.

Naming & metadata:

Each glb should include extras JSON with design: "brutalist_gallery_v1", units: "meters", and origin: [0,0,0].

D — Scene & lighting (React / R3F implementation guidance)

Renderer settings

renderer.physicallyCorrectLights = true

renderer.outputEncoding = THREE.sRGBEncoding

renderer.toneMapping = THREE.ACESFilmicToneMapping

renderer.toneMappingExposure = 1.0 (tweak in scene)

Environment

Use a neutral interior HDRI: Polyhaven sample studio_small_03 (or industrial_interior_01.hdr) blended with an Environment component:

<Environment files="/hdr/industrial_hall_01_2k.hdr" background={false} />


Additionally use a low intensity hemisphere light 0xebe8e3 and 0x22222a.

Direct / accent lights

SpotLights for each artwork: set angle: Math.PI/8, penumbra: 0.65, intensity 1.2–1.8, distance 6–10, castShadow = true.

A soft directional fill (DirectionalLight at 0.25 intensity) to simulate skylight if skylight used.

Shadows

Use PCFSoft or prefer Accumulative/Contact shadows from drei:

contactShadows under sculptures/bench for grounding.

Shadow map sizes: 1024 for secondary lights, 2048 for main key light.

Postprocessing (important for realism)

EffectComposer stack:

ToneMapping (ACES)

SSAO (small radius, sample count 16)

Bloom (threshold 0.9, intensity 0.15)

DepthOfField (focusDistance around 3–4m, focalLength small if hero shot)

ChromaticAberration subtle, vignette subtle

Camera

Default camera: perspective (fov 50), initial position (0.8, 1.6, 5.5) looking toward center (3.4, 1.6, 3.0).

Provide an idle dolly intro (duration 2.0 s) from far to initial camera.

E — Interaction & UX behaviors to replicate exactly

Controls

Two modes:

OrbitControls (for desktop viewers): enableDamping true, rotateSpeed 0.7, minDistance 1.5, maxDistance 12

PointerLockControls (walk mode): movement speed 2.4 m/s, gravity off (indoor)

Toggle UI control between modes via a button Walk / Look.

Artwork interaction

Raycast on click: if hit art_mesh, execute:

camera.dollyTo(targetPosition, targetLookAt, duration=0.9s, ease= cubicOut)

open React overlay modal with project content (title, images, text, links)

spotlight intensity subtly increases around the selected art

Proximity triggers

When user approaches within 1.6 m of a pillar or art, trigger subtle ambient audio (reverb change) and UI highlight.

Navigation

Invisible collision boxes on walls and pillars to prevent camera/POV clipping.

Accessibility

Provide a 2D overlay fallback: button Open 2D gallery — shows the same portfolio content in traditional HTML for assistive users.