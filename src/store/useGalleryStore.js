import { create } from 'zustand'

/**
 * Central Zustand store for the gallery.
 */
const useGalleryStore = create((set) => ({
    // ── Artwork selection ────────────────────────────────────────────
    selectedArtwork: null,
    isTransitioning: false,

    // ── Device State ─────────────────────────────────────────────────
    isMobile: false,
    setIsMobile: (val) => set({ isMobile: val }),

    // ── Time of Day ──────────────────────────────────────────────────
    // Default 7am: with AZ_OFFSET=+π/2 the sun rises from the south at 6am,
    // so at 7am it is low and golden, beaming straight through the entry door.
    timeOfDay: 7,
    timeScale: 40,
    isTimePaused: false,
    setTimeOfDay: (time) => set({ timeOfDay: time }),
    setTimeScale: (scale) => set({ timeScale: scale }),
    setTimePaused: (paused) => set({ isTimePaused: paused }),
    resetTimeOfDay: () => set({ timeOfDay: 7, timeScale: 40, isTimePaused: false }),

    timePanelExpanded: false,
    setTimePanelExpanded: (val) => set({ timePanelExpanded: val }),

    // ── HUD Visibility ────────────────────────────────────────────────
    hudVisible: true,
    toggleHUD: () => set((state) => ({ hudVisible: !state.hudVisible })),

    // Movement state for mobile controls
    moveState: { forward: false, backward: false, left: false, right: false, up: false, down: false },
    setMoveState: (dir, val) => set((state) => ({ moveState: { ...state.moveState, [dir]: val } })),

    // Movement mode
    movementMode: 'float',
    setMovementMode: (mode) => set({ movementMode: mode }),


    // The camera pose the dolly is heading towards
    cameraTarget: null,

    // Default camera resting state — positioned outside the building
    defaultCameraPosition: [8, 2.2, 18],
    defaultCameraLookAt: [7.96, 2.196, 17.908],

    // The camera pose to return to after inspecting
    previousCameraTarget: null,

    selectArtwork: (artwork, cameraPosition, cameraLookAt, currentPos, currentLook) =>
        set({
            selectedArtwork: artwork,
            isTransitioning: true,
            cameraTarget: { position: cameraPosition, lookAt: cameraLookAt },
            previousCameraTarget: { position: currentPos, lookAt: currentLook },
        }),

    clearArtwork: () =>
        set((state) => ({
            selectedArtwork: null,
            isTransitioning: true,
            cameraTarget: state.previousCameraTarget || null, // null → return to default if no history
        })),

    fastTravel: (position, lookAt) =>
        set({
            selectedArtwork: null,
            isTransitioning: true,
            cameraTarget: { position, lookAt },
            defaultCameraPosition: position,
            defaultCameraLookAt: lookAt
        }),

    setTransitioning: (val) => set({ isTransitioning: val }),
}))

export default useGalleryStore
