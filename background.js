console.log("Background.js is loading...");

let scene, camera, renderer, aiAssistant, flyingDisc;
let isDragging = false;
let isRotating = false;
let rotationSpeed = 0.01;
let previousMousePosition = { x: 0, y: 0 };
let scale = 1;

function init() {
    console.log("Initializing AI Assistant...");
    const container = document.getElementById('ai-assistant-container');
    if (!container) {
        console.error("AI Assistant container not found!");
        return;
    }
    console.log("AI Assistant container found, dimensions:", container.clientWidth, container.clientHeight);
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    createAIAssistant();
    createFlyingDisc();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    container.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);
    container.addEventListener('click', onContainerClick);

    animate();
    console.log("3D scene initialized");

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const container = document.getElementById('ai-assistant-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function createAIAssistant() {
    console.log("Creating AI Assistant model...");
    aiAssistant = new THREE.Group();

    // 头部
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xFFE4E1 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.3;
    aiAssistant.add(head);

    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.1, 0.35, 0.25);
    const rightEye = leftEye.clone();
    rightEye.position.set(-0.1, 0.35, 0.25);
    aiAssistant.add(leftEye, rightEye);

    // 头发
    const hairGeometry = new THREE.ConeGeometry(0.35, 0.4, 32);
    const hairMaterial = new THREE.MeshPhongMaterial({ color: 0x66CCFF });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 0.5, 0);
    aiAssistant.add(hair);

    // 双马尾
    const ponytailGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.6, 32);
    const ponytailMaterial = new THREE.MeshPhongMaterial({ color: 0x66CCFF });
    const leftPonytail = new THREE.Mesh(ponytailGeometry, ponytailMaterial);
    leftPonytail.position.set(0.25, 0.1, 0);
    leftPonytail.rotation.z = Math.PI / 6;
    const rightPonytail = leftPonytail.clone();
    rightPonytail.position.set(-0.25, 0.1, 0);
    rightPonytail.rotation.z = -Math.PI / 6;
    aiAssistant.add(leftPonytail, rightPonytail);

    // 身体
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.6, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, -0.2, 0);
    aiAssistant.add(body);

    // 裙子
    const skirtGeometry = new THREE.ConeGeometry(0.3, 0.3, 32);
    const skirtMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const skirt = new THREE.Mesh(skirtGeometry, skirtMaterial);
    skirt.position.set(0, -0.5, 0);
    aiAssistant.add(skirt);

    scene.add(aiAssistant);
    console.log("AI Assistant model created");
}

function createFlyingDisc() {
    console.log("Creating flying disc...");
    const discGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
    const discMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.7,
        emissive: 0x00FFFF,
        emissiveIntensity: 0.5
    });
    flyingDisc = new THREE.Mesh(discGeometry, discMaterial);
    flyingDisc.position.y = -0.7;
    aiAssistant.add(flyingDisc);
    console.log("Flying disc created");
}

function animate() {
    requestAnimationFrame(animate);

    if (flyingDisc) {
        flyingDisc.rotation.y += 0.05;
    }

    renderer.render(scene, camera);
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    if (isRotating) {
        aiAssistant.rotation.y += deltaMove.x * rotationSpeed;
        aiAssistant.rotation.x += deltaMove.y * rotationSpeed;
    } else {
        aiAssistant.position.x += deltaMove.x * 0.01;
        aiAssistant.position.y -= deltaMove.y * 0.01;
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isDragging = false;
}

function onWheel(event) {
    event.preventDefault();
    scale += event.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale), 2);
    aiAssistant.scale.set(scale, scale, scale);
}

function onContainerClick(event) {
    isRotating = !isRotating;
    console.log("Rotation mode:", isRotating ? "ON" : "OFF");
}

window.addEventListener('load', init);

console.log("Background.js loaded and initialized.");