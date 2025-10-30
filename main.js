import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global variables
let scene, camera, renderer, controls;
let artworks = [];
let raycaster, mouse;
let selectedArtwork = null;
let hoveredArtwork = null;

// Keyboard movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const moveSpeed = 0.05;
const roomBounds = { min: -4.5, max: 4.5 }; // Room boundaries

// Artwork data
const artworkData = [
    { title: 'Starry Night', artist: 'Vincent van Gogh', year: '1889', image: 'assets/art1.png', wall: 'north', position: 0 },
    { title: 'The Great Wave', artist: 'Katsushika Hokusai', year: '1831', image: 'assets/art2.png', wall: 'north', position: 1 },
    { title: 'The Scream', artist: 'Edvard Munch', year: '1893', image: 'assets/art3.jpg', wall: 'east', position: 0 },
    { title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: '1665', image: 'assets/art4.png', wall: 'east', position: 1 },
];

/**
 * Initialize the Three.js scene, camera, and renderer
 */
function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, // FOV
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.set(0, 1.6, 3); // Eye level height, starting position

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Initialize raycaster and mouse for interactivity
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    console.log('Scene initialized');
}

/**
 * Set up camera controls
 */
function setupControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Disable zoom to prevent camera jumping
    controls.enableZoom = false;

    // No angle restrictions - free look
    // controls.maxPolarAngle - not set (unrestricted)
    // controls.minPolarAngle - not set (unrestricted)

    // Disable panning to keep within room
    controls.enablePan = false;

    // Set target relative to camera for first-person feel
    const lookDirection = new THREE.Vector3(0, 0, -1);
    controls.target.copy(camera.position).add(lookDirection);

    console.log('Controls initialized');
}

/**
 * Set up lighting for the gallery
 */
function setupLighting() {
    // Ambient light for base illumination (warm gallery lighting)
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.4);
    scene.add(ambientLight);

    // Main ceiling lights (multiple for even distribution)
    const ceilingLights = [
        { x: -2, z: -2 },
        { x: 2, z: -2 },
        { x: -2, z: 2 },
        { x: 2, z: 2 }
    ];

    ceilingLights.forEach(pos => {
        const light = new THREE.PointLight(0xfff5e6, 0.3, 15);
        light.position.set(pos.x, 2.7, pos.z);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 10;
        light.shadow.bias = -0.0001;
        scene.add(light);
    });

    console.log('Lighting set up');
}

/**
 * Create the gallery room (floor, walls, ceiling)
 */
function createRoom() {
    const roomSize = 10;
    const wallHeight = 3;

    // Floor with granite PBR texture
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const textureLoader = new THREE.TextureLoader();

    // Load granite textures
    const graniteColor = textureLoader.load('Granite006A_4K-PNG/Granite006A_4K-PNG_Color.png');
    const graniteNormal = textureLoader.load('Granite006A_4K-PNG/Granite006A_4K-PNG_NormalGL.png');
    const graniteRoughness = textureLoader.load('Granite006A_4K-PNG/Granite006A_4K-PNG_Roughness.png');
    const graniteDisplacement = textureLoader.load('Granite006A_4K-PNG/Granite006A_4K-PNG_Displacement.png');

    // Configure texture wrapping and repeat
    [graniteColor, graniteNormal, graniteRoughness, graniteDisplacement].forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 3); // Adjust for realistic granite tile size
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: graniteColor,
        normalMap: graniteNormal,
        roughnessMap: graniteRoughness,
        displacementMap: graniteDisplacement,
        displacementScale: 0.01,
        roughness: 0.7,
        metalness: 0.1
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.7
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = wallHeight;
    scene.add(ceiling);

    // Wall material with subtle texture
    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = 512;
    wallCanvas.height = 512;
    const wallCtx = wallCanvas.getContext('2d');

    // Base color
    wallCtx.fillStyle = '#f0f0f0';
    wallCtx.fillRect(0, 0, 512, 512);

    // Add subtle noise for texture
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 2;
        wallCtx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
        wallCtx.fillRect(x, y, size, size);
    }

    const wallTexture = new THREE.CanvasTexture(wallCanvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 2);

    const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture,
        roughness: 0.9,
        metalness: 0.1
    });

    // North wall (back)
    const northWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, wallHeight),
        wallMaterial
    );
    northWall.position.set(0, wallHeight / 2, -roomSize / 2);
    northWall.receiveShadow = true;
    scene.add(northWall);

    // South wall (front)
    const southWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, wallHeight),
        wallMaterial
    );
    southWall.position.set(0, wallHeight / 2, roomSize / 2);
    southWall.rotation.y = Math.PI;
    southWall.receiveShadow = true;
    scene.add(southWall);

    // East wall (right)
    const eastWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, wallHeight),
        wallMaterial
    );
    eastWall.position.set(roomSize / 2, wallHeight / 2, 0);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.receiveShadow = true;
    scene.add(eastWall);

    // West wall (left)
    const westWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, wallHeight),
        wallMaterial
    );
    westWall.position.set(-roomSize / 2, wallHeight / 2, 0);
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    scene.add(westWall);

    console.log('Room created');
}

/**
 * Load and display artworks on the walls
 */
function loadArtworks() {
    const textureLoader = new THREE.TextureLoader();
    const artworkHeight = 1.5; // Center of artwork at eye level

    artworkData.forEach((data, index) => {
        // Create artwork plane
        const artGeometry = new THREE.PlaneGeometry(1.2, 1.2);

        // Load texture (placeholder color for now, will load actual images)
        const artMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.1
        });

        // Try to load the actual texture
        textureLoader.load(
            data.image,
            (texture) => {
                artMaterial.map = texture;
                artMaterial.needsUpdate = true;
            },
            undefined,
            (error) => {
                console.warn(`Could not load texture: ${data.image}`);
                // Use a placeholder color based on index
                const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xffd3b6, 0xffaaa5, 0xff8b94, 0xa8dadc];
                artMaterial.color.setHex(colors[index % colors.length]);
            }
        );

        const artwork = new THREE.Mesh(artGeometry, artMaterial);
        artwork.castShadow = true;
        artwork.receiveShadow = true;

        // Position artwork based on wall and position
        const wallOffset = 4.8; // Distance from center
        const spacing = 2.5; // Spacing between artworks
        const offset = (data.position - 0.5) * spacing;

        switch (data.wall) {
            case 'north':
                artwork.position.set(offset, artworkHeight, -wallOffset);
                break;
            case 'south':
                artwork.position.set(-offset, artworkHeight, wallOffset);
                artwork.rotation.y = Math.PI;
                break;
            case 'east':
                artwork.position.set(wallOffset, artworkHeight, offset);
                artwork.rotation.y = -Math.PI / 2;
                break;
            case 'west':
                artwork.position.set(-wallOffset, artworkHeight, -offset);
                artwork.rotation.y = Math.PI / 2;
                break;
        }

        // Store artwork data
        artwork.userData = data;

        // Create frame
        const frameGeometry = new THREE.PlaneGeometry(1.3, 1.3);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.3,
            metalness: 0.7
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.copy(artwork.position);
        frame.rotation.copy(artwork.rotation);
        frame.position.z += (data.wall === 'north' || data.wall === 'south') ?
            (data.wall === 'north' ? -0.01 : 0.01) : 0;
        frame.position.x += (data.wall === 'east' || data.wall === 'west') ?
            (data.wall === 'east' ? 0.01 : -0.01) : 0;

        scene.add(frame);
        scene.add(artwork);
        artworks.push(artwork);

        // Add spotlight for this artwork (improved settings)
        const spotlight = new THREE.SpotLight(0xfff5e6, 2.0, 10, Math.PI / 8, 0.4, 1.5);
        spotlight.position.copy(artwork.position);
        spotlight.position.y += 1.2;

        // Adjust spotlight position based on wall
        switch (data.wall) {
            case 'north':
                spotlight.position.z += 0.6;
                break;
            case 'south':
                spotlight.position.z -= 0.6;
                break;
            case 'east':
                spotlight.position.x -= 0.6;
                break;
            case 'west':
                spotlight.position.x += 0.6;
                break;
        }

        spotlight.target = artwork;
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
        spotlight.shadow.camera.near = 0.1;
        spotlight.shadow.camera.far = 5;
        spotlight.shadow.bias = -0.0001;
        spotlight.shadow.radius = 2; // Softer shadows
        scene.add(spotlight);
    });

    console.log(`${artworks.length} artworks loaded`);
}

/**
 * Set up interactivity (raycasting, click events)
 */
function setupInteractivity() {
    // Mouse move event for hover detection
    window.addEventListener('mousemove', onMouseMove, false);

    // Click event for artwork selection
    window.addEventListener('click', onArtworkClick, false);

    // Keyboard event listeners for WASD movement
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);

    // Close button for info card
    document.getElementById('close-btn').addEventListener('click', closeInfoCard);

    console.log('Interactivity set up');
}

/**
 * Handle key down events
 */
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveForward = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveBackward = true;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveLeft = true;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveRight = true;
            break;
    }
}

/**
 * Handle key up events
 */
function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveForward = false;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveBackward = false;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveLeft = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveRight = false;
            break;
    }
}

/**
 * Update camera position based on keyboard input
 */
function updateCameraMovement() {
    if (!moveForward && !moveBackward && !moveLeft && !moveRight) {
        return; // No movement input, skip
    }

    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    // Get camera direction
    camera.getWorldDirection(direction);
    direction.y = 0; // Keep movement horizontal
    direction.normalize();

    // Get right vector (perpendicular to direction)
    right.crossVectors(camera.up, direction).normalize();

    // Calculate movement delta
    const moveDelta = new THREE.Vector3();

    if (moveForward) {
        moveDelta.add(direction.clone().multiplyScalar(moveSpeed));
    }
    if (moveBackward) {
        moveDelta.add(direction.clone().multiplyScalar(-moveSpeed));
    }
    if (moveLeft) {
        moveDelta.add(right.clone().multiplyScalar(moveSpeed));
    }
    if (moveRight) {
        moveDelta.add(right.clone().multiplyScalar(-moveSpeed));
    }

    // Save current look direction
    const lookDirection = new THREE.Vector3();
    lookDirection.subVectors(controls.target, camera.position);

    // Apply movement with collision detection
    const newPosition = camera.position.clone().add(moveDelta);

    // Check boundaries and update position
    if (newPosition.x > roomBounds.min && newPosition.x < roomBounds.max) {
        camera.position.x = newPosition.x;
    }
    if (newPosition.z > roomBounds.min && newPosition.z < roomBounds.max) {
        camera.position.z = newPosition.z;
    }

    // Update target to maintain look direction
    controls.target.copy(camera.position).add(lookDirection);
}

/**
 * Handle mouse movement for raycasting
 */
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworks);

    // Reset previous hovered artwork
    if (hoveredArtwork && (intersects.length === 0 || intersects[0].object !== hoveredArtwork)) {
        hoveredArtwork.scale.set(1, 1, 1);
        hoveredArtwork.material.emissive.setHex(0x000000);
        hoveredArtwork = null;
    }

    // Apply hover effect to current artwork
    if (intersects.length > 0) {
        const artwork = intersects[0].object;
        document.body.style.cursor = 'pointer';

        if (artwork !== hoveredArtwork) {
            hoveredArtwork = artwork;
            // Subtle scale up
            artwork.scale.set(1.05, 1.05, 1.05);
            // Add subtle glow
            artwork.material.emissive.setHex(0x222222);
        }
    } else {
        document.body.style.cursor = 'default';
    }
}

/**
 * Handle artwork click
 */
function onArtworkClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworks);

    if (intersects.length > 0) {
        const artwork = intersects[0].object;
        showInfoCard(artwork.userData);
    }
}

/**
 * Show info card for selected artwork
 */
function showInfoCard(data) {
    document.getElementById('artwork-title').textContent = data.title;
    document.getElementById('artwork-artist').textContent = `Artist: ${data.artist}`;
    document.getElementById('artwork-year').textContent = `Year: ${data.year}`;

    const infoCard = document.getElementById('info-card');
    infoCard.classList.remove('hidden');
    infoCard.style.opacity = '1';
}

/**
 * Close info card
 */
function closeInfoCard() {
    const infoCard = document.getElementById('info-card');
    infoCard.classList.add('hidden');
    infoCard.style.opacity = '0';
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Constrain camera position within room boundaries
 */
function constrainCamera() {
    // Clamp camera position within room bounds
    camera.position.x = Math.max(roomBounds.min, Math.min(roomBounds.max, camera.position.x));
    camera.position.z = Math.max(roomBounds.min, Math.min(roomBounds.max, camera.position.z));

    // Keep camera above floor and below ceiling
    camera.position.y = Math.max(0.5, Math.min(2.5, camera.position.y));
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);

    // Update keyboard movement
    updateCameraMovement();

    // Update controls
    controls.update();

    // Constrain camera within room
    constrainCamera();

    // Render scene
    renderer.render(scene, camera);
}

/**
 * Initialize the entire application
 */
function init() {
    initScene();
    setupControls();
    createRoom();
    setupLighting();
    loadArtworks();
    setupInteractivity();

    // Add window resize listener
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();

    console.log('Art Gallery initialized successfully!');
}

// Start the application
init();
