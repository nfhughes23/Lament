// Import necessary modules (Ensure you have imported THREE.js, GLTFLoader, GSAP, Lenis, ScrollTrigger, and SplitType in your HTML)

 // ANIMATE TEXT

  // Select the title text element
  const titleText = document.getElementById("title-text");

  // Initial and final text values
  const initialText = "Lament for a Dying Planet";
  const finalText = "Lament.Earth";

  // Set the initial text (optional if already set in HTML)
  titleText.textContent = initialText;

  // Delay before starting the text animation (in seconds)
  const delayBeforeTextAnimation = 1; // Adjust as needed

  // Function to animate the text change
  function animateTextChange() {
    // Animate the deletion of "for a Dying Planet"
    gsap.to(titleText, {
      duration: 2, // Duration of the deletion animation
      text: "Lament", // Text to change to during deletion
      ease: "none",
      onComplete: function () {
        // After deleting, animate typing ".Earth"
        gsap.to(titleText, {
          duration: 2, // Duration of the typing animation
          text: finalText, // Final text
          ease: "none",
        });
      },
    });
  }
  // Start the text animation after a delay
  gsap.delayedCall(delayBeforeTextAnimation, animateTextChange);


// Initialize Lenis for smooth scrolling
const lenis = new Lenis();

// Update ScrollTrigger on Lenis scroll
lenis.on("scroll", ScrollTrigger.update);

// Use GSAP's ticker to synchronize Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Create a new THREE.js scene
const scene = new THREE.Scene();

// Set up the camera with perspective projection
const camera = new THREE.PerspectiveCamera(
  45, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Initialize the WebGL renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0); // Set background to transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;

// Append the renderer to the DOM
document.querySelector(".model").appendChild(renderer.domElement);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

// Add main directional light
const mainLight = new THREE.DirectionalLight(0xffffff, 0.5);
mainLight.position.set(0.5, 7.5, 2.5);
scene.add(mainLight);

// Add fill directional light
const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
fillLight.position.set(-15, 0, -5);
scene.add(fillLight);

// Add hemisphere light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

// Optional: Add AxesHelper to visualize axes (useful for debugging)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Basic animation loop (will be canceled once the model is loaded)
function basicAnimate() {
  renderer.render(scene, camera);
  requestAnimationFrame(basicAnimate);
}
basicAnimate();

// Declare variables for the model and loader
let model;
const loader = new THREE.GLTFLoader();

// Load the chair model
loader.load("./assets/chair.glb", function (gltf) {
  model = gltf.scene;

  // Traverse through all nodes to set material properties and enable shadows
  model.traverse((node) => {
    if (node.isMesh) {
      if (node.material) {
        node.material.metalness = 2;
        node.material.roughness = 3;
        node.material.envMapIntensity = 5;
      }
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  // Center the model
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  scene.add(model);

  // Adjust camera position based on model size
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.z = maxDim * 1.75;

  // Initialize model scale and rotation
  model.scale.set(0, 0, 0);
  model.rotation.set(0.5, 0, 0); // **Changed from (0, 0.5, 0) to (0.5, 0, 0) for x-axis rotation**
  playInitialAnimation();

  // Cancel the basic animation loop and start the main animation loop
  cancelAnimationFrame(basicAnimate);
  animate();
});

// Variables for floating and rotation animations
const floatAmplitude = 0.2;
const floatSpeed = 1.5;
const rotationSpeed = 0.3;
let isFloating = true;
let currentScroll = 0;

// Calculate total scroll height for scroll-based rotation
const totalScrollHeight =
  document.documentElement.scrollHeight - window.innerHeight;

// Function to play the initial scaling animation
function playInitialAnimation() {
  if (model) {
    gsap.to(model.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power2.out",
    });
  }
}

// Update current scroll position on Lenis scroll
lenis.on("scroll", (e) => {
  currentScroll = e.scroll;
});

// Main animation loop
function animate() {
  if (model) {
    // Floating animation
    if (isFloating) {
      const floatOffset =
        Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
      model.position.y = floatOffset;
    }

    // Calculate scroll progress (clamped between 0 and 1)
    const scrollProgress = Math.min(currentScroll / totalScrollHeight, 1);

    const baseTilt = 0.5;

    // **Rotate the model around the x-axis based on scroll progress**
    model.rotation.y = scrollProgress * Math.PI * 4 + baseTilt;
  }

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);

  // Request the next frame
  requestAnimationFrame(animate);
}

// Select sections for scroll-triggered text animations
const introSection = document.querySelector(".intro");
const archiveSection = document.querySelector(".archive");
const outroSection = document.querySelector(".outro");

// Split text into lines for animation
const splitText = new SplitType(".outro-copy h2", {
  types: "lines",
  lineClass: "line",
});

// Wrap each line in a span for individual animation
splitText.lines.forEach((line) => {
  const text = line.innerHTML;
  line.innerHTML = `<span style="display: block; transform: translateY(70px);">${text}</span>`;
});

// Create a ScrollTrigger for the outro section
ScrollTrigger.create({
  trigger: ".outro",
  start: "top center",
  onEnter: () => {
    gsap.to(".outro-copy h2 .line span", {
      translateY: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      force3D: true,
    });
  },
  onLeaveBack: () => {
    gsap.to(".outro-copy h2 .line span", {
      translateY: 70,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      force3D: true,
    });
  },
  toggleActions: "play reverse play reverse",
});

// Handle window resize to update camera and renderer
window.addEventListener("resize", () => {
  // Update camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size and pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});