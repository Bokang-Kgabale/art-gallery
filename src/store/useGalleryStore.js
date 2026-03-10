import { create } from 'zustand'

/**
 * Central Zustand store for the gallery.
 */
const useGalleryStore = create((set) => ({
    // ── Artwork selection ────────────────────────────────────────────
    selectedArtwork: null,
    isTransitioning: false,

    // The camera pose the dolly is heading towards
    cameraTarget: null,

    // Default camera resting state — positioned outside the building
    defaultCameraPosition: [8, 2.2, 18],
    defaultCameraLookAt: [2, 1.6, 4],

    selectArtwork: (artwork, cameraPosition, cameraLookAt) =>
        set({
            selectedArtwork: artwork,
            isTransitioning: true,
            cameraTarget: { position: cameraPosition, lookAt: cameraLookAt },
        }),

    clearArtwork: () =>
        set({
            selectedArtwork: null,
            isTransitioning: true,
            cameraTarget: null, // null → return to default
        }),

    setTransitioning: (val) => set({ isTransitioning: val }),
}))

export default useGalleryStore
