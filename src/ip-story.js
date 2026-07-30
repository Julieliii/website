import * as THREE from "https://esm.sh/three@0.185.1";
import { GLTFLoader } from "https://esm.sh/three@0.185.1/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "https://esm.sh/three@0.185.1/examples/jsm/environments/RoomEnvironment.js";
import gsap from "https://esm.sh/gsap@3.15.0";
import { ScrollTrigger } from "https://esm.sh/gsap@3.15.0/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mount = document.getElementById("ip-canvas");
const story = document.getElementById("ip-story");

if (mount && story) {
  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog("#fff8f1", 8, 18);

  const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.05, 100);
  camera.position.set(0, 1.05, 6.35);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  const target = new THREE.Vector3(0, 1.3, 0);
  const cameraState = {
    x: 0,
    y: 1.05,
    z: 6.35,
    tx: 0,
    ty: 0.95,
    tz: 0,
    modelX: 0,
    modelY: 0,
    modelScale: 1,
    modelRotY: 0,
    opacity: 1,
  };

  const root = new THREE.Group();
  scene.add(root);

  const warmKey = new THREE.DirectionalLight("#fff8f0", 2.35);
  warmKey.position.set(3.6, 5.8, 4.6);
  warmKey.castShadow = true;
  warmKey.shadow.mapSize.set(2048, 2048);
  warmKey.shadow.camera.near = 0.5;
  warmKey.shadow.camera.far = 14;
  warmKey.shadow.camera.left = -4;
  warmKey.shadow.camera.right = 4;
  warmKey.shadow.camera.top = 4;
  warmKey.shadow.camera.bottom = -4;
  scene.add(warmKey);

  const orangeFill = new THREE.DirectionalLight("#e56a3e", 0.42);
  orangeFill.position.set(-4.4, 2.6, 2.2);
  scene.add(orangeFill);
  const rimLight = new THREE.DirectionalLight("#fff2dd", 0.82);
  rimLight.position.set(-3.4, 3.5, -4.2);
  scene.add(rimLight);
  const softFaceLight = new THREE.PointLight("#fff4e8", 0.28, 5, 2);
  softFaceLight.position.set(0.25, 1.9, 2.2);
  scene.add(softFaceLight);
  scene.add(new THREE.HemisphereLight("#fffaf4", "#d8a48e", 0.95));

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 96),
    new THREE.ShadowMaterial({ color: "#8f5b42", transparent: true, opacity: 0.18 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.18;
  floor.receiveShadow = true;
  floor.renderOrder = 0;
  floor.material.depthWrite = false;
  scene.add(floor);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: "#e56a3e", transparent: true, opacity: 0.12 });
  const rings = [
    { radius: 2.7, x: -0.35, y: 0.95, z: -1.7, ry: 0.35 },
    { radius: 1.35, x: 1.55, y: 1.55, z: -1.9, ry: -0.5 },
  ].map((ring) => {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(ring.radius, 0.01, 12, 120), ringMaterial.clone());
    mesh.position.set(ring.x, ring.y, ring.z);
    mesh.rotation.set(Math.PI / 2.4, ring.ry, 0);
    mesh.renderOrder = 1;
    mesh.material.depthWrite = false;
    scene.add(mesh);
    return mesh;
  });

  const blobs = Array.from({ length: 5 }, (_, index) => {
    const geometry = index % 2
      ? new THREE.BoxGeometry(0.28, 0.28, 0.28)
      : new THREE.SphereGeometry(0.16, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      color: index % 2 ? "#fff8f1" : "#e56a3e",
      roughness: 0.72,
      transparent: true,
      opacity: index % 2 ? 0.45 : 0.28,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-2.2 + index * 1.05, 0.2 + (index % 3) * 0.58, -1.4 - index * 0.1);
    mesh.rotation.set(index * 0.7, index * 0.35, index * 0.2);
    mesh.renderOrder = 1;
    mesh.material.depthWrite = false;
    scene.add(mesh);
    return mesh;
  });

  let model;
  let modelBaseScale = 1;
  const loader = new GLTFLoader();
  loader.load(
    "public/assets/models/fox-ip.glb",
    (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 2.02 / Math.max(size.x, size.y, size.z);
      modelBaseScale = scale;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.position.y += 0.9;
      model.traverse((child) => {
        if (!child.isMesh) return;
        child.renderOrder = 10;
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.transparent = true;
          child.material.roughness = Math.max(child.material.roughness ?? 0.72, 0.72);
          child.material.metalness = Math.min(child.material.metalness ?? 0.03, 0.04);
          child.material.envMapIntensity = 0.42;
          child.material.depthWrite = true;
          if (child.material.map) child.material.map.anisotropy = 8;
          if ("clearcoat" in child.material) child.material.clearcoat = 0.02;
          if ("clearcoatRoughness" in child.material) child.material.clearcoatRoughness = 0.9;
          child.material.needsUpdate = true;
        }
      });
      root.add(model);
      mount.classList.add("is-loaded");
    },
    undefined,
    () => mount.classList.add("model-failed")
  );

  const panels = gsap.utils.toArray(".story-panel");
  panels.forEach((panel) => {
    gsap.fromTo(
      panel.querySelectorAll(".story-copy"),
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: panel,
          start: "top 64%",
          end: "bottom 42%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.timeline({
    defaults: { ease: "power3.inOut" },
    scrollTrigger: {
      trigger: story,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.4,
    },
  })
    .to(cameraState, { x: 0.92, y: 1.38, z: 2.86, tx: -1.02, ty: 1.48, modelX: -2.24, modelY: 0.0, modelScale: 1.36, modelRotY: 0.24, duration: 1 })
    .to(cameraState, { x: -1.45, y: 1.44, z: 3.45, tx: 0.18, ty: 1.22, modelX: 0.78, modelY: 0.0, modelScale: 1.08, modelRotY: -0.3, duration: 1 })
    .to(cameraState, { x: 1.18, y: 1.36, z: 2.95, tx: -0.68, ty: 1.48, modelX: -1.62, modelY: 0.02, modelScale: 1.32, modelRotY: 0.38, duration: 1 })
    .to(cameraState, { x: 0.2, y: 1.58, z: 4.25, tx: -0.05, ty: 1.3, modelX: 0.42, modelY: 0.18, modelScale: 1.02, modelRotY: 0.05, opacity: 1, duration: 0.8 });

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.16;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.1;
  });

  function resize() {
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", resize);

  const startedAt = performance.now();
  function render() {
    const time = (performance.now() - startedAt) / 1000;
    camera.position.set(cameraState.x + pointer.x, cameraState.y - pointer.y, cameraState.z);
    target.set(cameraState.tx, cameraState.ty, cameraState.tz);
    camera.lookAt(target);

    if (model) {
      root.position.x = cameraState.modelX;
      root.position.y = Math.sin(time * 1.2) * 0.035 + cameraState.modelY;
      root.rotation.y = cameraState.modelRotY + pointer.x * 0.55;
      const breath = 1 + Math.sin(time * 1.45) * 0.008;
      model.scale.setScalar(modelBaseScale * breath * cameraState.modelScale);
      model.traverse((child) => {
        if (child.isMesh && child.material) child.material.opacity = cameraState.opacity;
      });
    }

    rings.forEach((ring, index) => {
      ring.rotation.z = time * (index ? -0.08 : 0.06);
      ring.material.opacity = 0.16 + Math.sin(time + index) * 0.035;
    });
    blobs.forEach((blob, index) => {
      blob.rotation.y += 0.004 + index * 0.0008;
      blob.position.y += Math.sin(time + index) * 0.0008;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}
