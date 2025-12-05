"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import "../../styles/styles-jours.css";

export default function Day3() {
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const unlockDay = 6;

    if (month !== 11 || date < unlockDay) {
      alert(`Jour ${unlockDay} non disponible !`);
      return;
    }

    // CONTAINER
    const container = document.getElementById("scene-container");
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();

    // --- SKYBOX ---
    const cubeLoader = new THREE.CubeTextureLoader();
    const texture = cubeLoader.load([
      "/sky/sky_41_cubemap_2k/px.png",
      "/sky/sky_41_cubemap_2k/nx.png",
      "/sky/sky_41_cubemap_2k/py.png",
      "/sky/sky_41_cubemap_2k/ny.png",
      "/sky/sky_41_cubemap_2k/pz.png",
      "/sky/sky_41_cubemap_2k/nz.png",
    ]);
    scene.background = texture;

    // SOL
    const groundGeo = new THREE.PlaneGeometry(20, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x222442 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 2, 6);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // LIGHTS
    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.update();

    // VARIABLES
    let mixer: THREE.AnimationMixer | null = null;
    const actions: Record<string, THREE.AnimationAction> = {};
    let activeAction: THREE.AnimationAction | null = null;
    let character: THREE.Object3D | null = null;
    const clock = new THREE.Clock();

    // MODEL
    const loader = new GLTFLoader();
    loader.load("/models/paindepice.glb", (gltf) => {
      character = gltf.scene;
      character.scale.set(0.35, 0.35, 0.35);
      character.rotation.y = -Math.PI / 2;

      scene.add(character);

      mixer = new THREE.AnimationMixer(character);
      gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer!.clipAction(clip);
      });
    });

    // PLAY ANIM
    function play(name: string) {
      if (!mixer || !actions[name]) return;
      if (activeAction) activeAction.stop();
      activeAction = actions[name];
      activeAction.play();
    }

    // BUTTONS
    const danceBtn = document.getElementById("danceBtn");
    const turnBtn = document.getElementById("turnBtn");
    const moonwalkBtn = document.getElementById("moonwalkBtn");
    const accBtn = document.getElementById("accBtn");

    danceBtn?.addEventListener("click", () => play("Twerk"));
    moonwalkBtn?.addEventListener("click", () => play("Moonwalk"));
    accBtn?.addEventListener("click", () => play("Seat"));

    turnBtn?.addEventListener("click", () => {
      if (!character) return;

      gsap.to(character.rotation, {
        y: character.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut",
      });
    });

    // SNOW
    const snowCount = 1500;
    const snowPositions = new Float32Array(snowCount * 3);
    const snowSpeeds = new Float32Array(snowCount);

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 20;
      snowPositions[i * 3 + 1] = Math.random() * 15;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      snowSpeeds[i] = 0.01 + Math.random() * 0.03;
    }

    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(snowPositions, 3)
    );

    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });

    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);

    // ANIMATE
    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      const pos = snowParticles.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        const yIndex = i * 3 + 1;
        pos[yIndex] -= snowSpeeds[i];
        if (pos[yIndex] < 0) pos[yIndex] = 15;
      }
      snowParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // RESIZE
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <header className="header">
        <h1>Jour 6 🎄</h1>
      </header>
      <p id="description">
        Pain d'épice sous BBL, merci Théodora pour les travaux
      </p>

      <div id="scene-container" style={{ width: "100%", height: "500px" }} />

      <div id="buttons">
        <button id="danceBtn">Twerk</button>
        <button id="moonwalkBtn">Moonwalk</button>
        <button id="turnBtn">Tourne</button>
        <button id="accBtn">Accroupi</button>
      </div>

      <footer>
        <img
          id="logo-footer6"
          src="/assets/paindepice.png"
          alt="Pain d'épice"
        />
      </footer>
    </div>
  );
}
