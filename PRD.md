# Product Requirements Document (PRD)

### Project Title:

**The Brutalist Gallery — An Immersive 3D Portfolio Experience**

---

## 1. Vision Statement

To create a **digital brutalist art gallery** where visitors **step inside** your creative world rather than browse a typical website.
This experience merges **architecture**, **art**, and **technology**, inviting users to explore your portfolio as if they were inside a **museum installation** — immersive, tactile, and cinematic.

The project embodies **raw realism**, **spatial storytelling**, and **interactive exploration**, emphasizing brutalist principles: **form, material honesty, and light**.

---

## 2. Core Objectives

1. Present your **portfolio and artworks** in an architectural 3D space that reflects your design ethos.
2. Deliver a **high-fidelity visual experience** — lighting, shadows, reflections, and textures that evoke realism.
3. Encourage **interaction and curiosity** — users can look, walk, and engage with the environment.
4. Maintain a **smooth, cinematic user flow**, blending 3D space with minimal UI overlays.
5. Be performant and accessible across desktop and modern browsers.

---

## 3. Target Audience

* **Creative professionals**, art directors, and clients evaluating your design and conceptual ability.
* **Art & architecture enthusiasts** exploring immersive 3D spaces.
* **Potential collaborators** in digital art, interactive media, or architectural visualization.
* **Tech-savvy visitors** who value experimental digital experiences.

---

## 4. Experience Overview

### 🏛 Concept:

Visitors enter a **brutalist gallery interior** — vast concrete forms, ambient lighting, minimalist furniture, and framed artworks or digital installations representing your portfolio.

### 🎮 Interaction Flow:

1. **Entrance Scene**

   * Fade from black → Camera moves through a concrete corridor.
   * Ambient soundscape sets the tone (soft reverb, spatial echoes).
   * Intro title (“The Brutalist Gallery — by [Your Name]”) fades in.

2. **Main Gallery Space**

   * Visitors navigate the gallery with **Orbit or First-Person controls**.
   * Each art piece is a **3D-framed work**, screen, or projection.
   * Hovering highlights an artwork; clicking opens a **React overlay** with project info, images, or video.

3. **Portfolio Interaction**

   * Clicking a portfolio piece triggers a **camera dolly movement** to focus on it.
   * A **modal UI** (React overlay) slides in, describing the project.

4. **Exit / Transition**

   * Optional: “Exit the gallery” zone returns users to an overview or 2D landing page.

---

## 5. Visual and Artistic Direction

| Element                | Description                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **Architecture Style** | Brutalist — raw concrete, steel, glass; geometric forms and stark lighting.                    |
| **Lighting**           | Realistic PBR lighting with long shadows and ambient bounce; physically-correct light sources. |
| **Materials**          | High-resolution PBR maps for concrete, metal, and glass (from AmbientCG / Polyhaven).          |
| **Color Palette**      | Muted greys, blacks, off-whites with subtle accent tones.                                      |
| **Mood**               | Quiet, contemplative, cinematic — inspired by museum and architectural visualization.          |
| **Sound Design**       | Optional spatial audio (subtle echo, footsteps, wind hum).                                     |

---

## 6. Technical Architecture

### 🧩 Core Stack

| Component        | Library / Tool                             | Purpose                                          |
| ---------------- | ------------------------------------------ | ------------------------------------------------ |
| Framework        | **React + Vite**                           | Modern build tool for fast development           |
| 3D Engine        | **@react-three/fiber**                     | React renderer for Three.js                      |
| 3D Utilities     | **@react-three/drei**                      | Helpers for lighting, cameras, controls, loaders |
| Postprocessing   | **@react-three/postprocessing**            | Bloom, SSAO, tone mapping, DOF                   |
| Animations       | **framer-motion-3d**                       | Camera transitions, intro animation, UI sync     |
| Asset Pipeline   | **GLTF / GLB models** from Blender         | Optimized architectural and art models           |
| Textures         | HDR / PBR maps from Polyhaven or AmbientCG | Realistic lighting and surface fidelity          |
| UI Framework     | React + Tailwind CSS                       | Minimalistic interface overlays                  |
| State Management | Zustand / React Context                    | Scene and modal control                          |
| Audio            | Three.js Audio API                         | Optional ambient environmental sound             |

---

## 7. Core Features

### A. Environment & Navigation

* Physically-based rendered (PBR) environment.
* Realistic lighting setup with tone mapping (`ACESFilmicToneMapping`).
* Navigation via `OrbitControls` or `FirstPersonControls`.
* Dynamic fog and ambient light for depth perception.

### B. Portfolio Interactions

* Load art or projects dynamically from a JSON or CMS source.
* Hover and click triggers:

  * Camera dolly to project location.
  * React modal overlay with content.
  * Smooth transitions using Framer Motion.

### C. Scene Composition

* Modular scene files (`GalleryScene`, `EntranceScene`, etc.).
* Each scene has lighting, environment, and objects as components.
* Models preloaded via `useGLTF` and `Suspense`.

### D. Performance & Optimization

* GLTF compression with Draco or Meshopt.
* Lazy loading for secondary assets.
* Efficient texture encoding and mipmapping.
* Use of postprocessing selectively for performance balance.

---

## 8. System Architecture (Flow)

**Frontend (React App)**
➡ Scene rendering (React Three Fiber)
➡ UI & portfolio data (React)
➡ Interactions (Framer Motion / Zustand)
➡ Static assets (models, HDRIs, textures)

**Hosting Options**

* Vercel / Netlify for React site
* Firebase Hosting for easy deployment and asset delivery

---

## 9. File & Folder Structure

```
src/
 ├─ assets/
 │   ├─ models/
 │   ├─ textures/
 │   └─ hdr/
 ├─ components/
 │   ├─ GalleryArt.jsx
 │   ├─ Lighting.jsx
 │   ├─ CameraControls.jsx
 │   ├─ SceneTransition.jsx
 ├─ scenes/
 │   ├─ EntranceScene.jsx
 │   ├─ GalleryScene.jsx
 ├─ ui/
 │   ├─ ProjectModal.jsx
 │   ├─ HUDOverlay.jsx
 ├─ App.jsx
 ├─ main.jsx
 └─ styles/
     └─ tailwind.css
```

---

## 10. Realism Techniques

| Technique                       | Implementation                                                      |
| ------------------------------- | ------------------------------------------------------------------- |
| **Physically Correct Lighting** | `renderer.physicallyCorrectLights = true;`                          |
| **Tone Mapping**                | `THREE.ACESFilmicToneMapping`                                       |
| **Environment Mapping**         | HDRI environment using `<Environment files="hdr/industrial.hdr" />` |
| **Postprocessing**              | Bloom, SSAO, DepthOfField via `@react-three/postprocessing`         |
| **Shadows**                     | Soft shadows via `AccumulativeShadows` and `ContactShadows`         |
| **Reflections**                 | CubeCamera or PMREM-generated reflections                           |
| **PBR Materials**               | Concrete, glass, metal with normal + roughness maps                 |

---

## 11. Milestones & Roadmap

| Phase                              | Deliverable                       | Description                                  |
| ---------------------------------- | --------------------------------- | -------------------------------------------- |
| **Phase 1: Foundation**            | Base React + R3F setup            | Canvas, controls, and sample model rendering |
| **Phase 2: Environment**           | Gallery architecture design       | Blender model, lighting, materials           |
| **Phase 3: Interaction**           | Portfolio object interaction + UI | Hover/click behaviors and modal overlay      |
| **Phase 4: Cinematic Polish**      | Camera animations, sound, post FX | Full sensory immersion                       |
| **Phase 5: Optimization & Launch** | Performance tuning + deploy       | Asset compression, hosting setup             |

---

## 12. Future Expansions

* VR/AR support with WebXR (`@react-three/xr`).
* Multi-room galleries (narrative exploration).
* Real-time events or networked exhibitions.
* NFT or digital collectibles display integration.
* Procedural lighting based on time of day.

---

## 13. Success Metrics

* **Engagement Time:** Average session duration over 2 minutes.
* **Interaction Rate:** >50% users interact with at least one portfolio item.
* **Visual Fidelity:** Lighting, shadows, and materials render consistently across devices.
* **Performance:** Maintain >50 FPS on midrange hardware.
* **Brand Recall:** Users describe the site as *memorable*, *immersive*, or *architectural*.

---

## 14. References / Inspiration

* *Rafael Rozendaal — websites as art spaces*
* *Zaha Hadid’s fluid brutalism in digital form*
* *Art gallery walkthroughs in Unreal Engine / Archviz*
* *PlayCanvas & Three.js architectural demos*

---

### ✅ Summary

Your new PRD defines an **immersive brutalist 3D portfolio experience** built with **React Three Fiber**, balancing art and engineering.
It combines **architectural design principles** with **real-time rendering**, enabling visitors to *enter* your creative world — a space where every wall, shadow, and sound reflects your aesthetic.

---

