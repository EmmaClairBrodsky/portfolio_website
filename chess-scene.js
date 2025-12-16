import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Get the canvas
const canvas = document.getElementById('chess-canvas');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Sizes
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

// Load materials first, then the model
const mtlLoader = new MTLLoader();
mtlLoader.load(
    './queen.mtl',  // <-- Change to your .mtl filename
    (materials) => {
        materials.preload();
        
        // Now load the OBJ with materials
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            './queen.obj',  // <-- Change to your .obj filename
            (object) => {
                scene.add(object);
                
                // Center the model
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);
            },
            (progress) => {
                console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading OBJ:', error);
            }
        );
    },
    (progress) => {
        console.log('Loading materials:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading MTL:', error);
    }
);

// Controls - allows you to rotate and zoom with mouse
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle window resize
window.addEventListener('resize', () => {
    sizes.width = canvas.clientWidth;
    sizes.height = canvas.clientHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();