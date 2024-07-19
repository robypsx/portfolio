
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const canvasContainer = document.getElementById('canvas-container');

// Set renderer size to match container
const width = canvasContainer.clientWidth;
const height = canvasContainer.clientHeight;
// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

//renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor(0x1c1c1c);

// Enable gamma correction for accurate colors and lighting
renderer.gammaFactor = 2.2;
renderer.gammaOutput = true;

// Append renderer's canvas to container
canvasContainer.appendChild(renderer.domElement);

const AmbientLight = new THREE.AmbientLight(0xffffff, 1); // white light
scene.add(AmbientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
camera.add(directionalLight); // Add light to camera
scene.add(camera); // Ensure the camera is added to the scene


// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional: Enables inertia for smoother control
controls.dampingFactor = 0.05; // Optional: Damping factor
controls.screenSpacePanning = false; // Optional: Disables panning

// GLTFLoader to load the model
const loader = new GLTFLoader();

// let mixer;  // To hold the AnimationMixer
let model;  // To hold the loaded model
// const actions = {};  // To hold the animation actions
// let activeAction;  // To hold the current active animation

// Load a GLB model
loader.load('assets/spyrocup.glb', (gltf) => {
    model = gltf.scene;
    model.traverse((o) => {
        if (o.isMesh && o.material.map) {
            o.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
    });
    scene.add(model);

    // Optionally, set model position, scale, etc.
    model.position.set(0, -1, 0);
    model.scale.set(1, 1, 1);

    // // Create an AnimationMixer, and get the list of animations from the model
    // mixer = new THREE.AnimationMixer(model);

    // // Loop through each animation clip and create an action for it
    // gltf.animations.forEach((clip) => {
    //     const action = mixer.clipAction(clip);
    //     actions[clip.name] = action;
    // });

    // // Set the initial pose or animation
    // setAction('[Action Stash].010'); 
    // Handle change animation button click
    // const changeAnimationBtn = document.getElementById('changeAnimationBtn');
    // let currentAnimationIndex = 10; // Initial index

    // changeAnimationBtn.addEventListener('click', () => {
    //     currentAnimationIndex++;
    //     if (currentAnimationIndex > 14) {
    //         currentAnimationIndex = 1; // Wrap around to the first animation
    //     }
    //     let animationName = `[Action Stash].${currentAnimationIndex.toString().padStart(3, '0')}`;
    //     setAction(animationName);
    // });
}, undefined, (error) => {
    console.error(error);
});

// Function to set the active animation
// function setAction(name) {
//     if (activeAction) {
//         activeAction.stop();
//     }
//     activeAction = actions[name];
//     if (activeAction) {  // Check if action exists before playing
//         activeAction.play();
//     } else {
//         console.warn(`Animation action '${name}' not found.`);
//     }
// }

// Position the camera
camera.position.set(0, 1.5, -4);

// Render function
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.01; // Rotate model if it's loaded
    }
    // // Update the mixer on each frame if it exists
    // if (mixer) {
    //     mixer.update(0.01);
    // }
    // Update controls
   
    controls.update();
    // Render the scene
    renderer.render(scene, camera);
}

// Call animate function to start rendering
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = (width / height) ;
    camera.updateProjectionMatrix();
});

