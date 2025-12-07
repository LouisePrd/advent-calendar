"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import BackHome from "../../components/DayNavigation";
import "../../styles/styles-jours.css";

export default function Day3() {
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const unlockDay = 3;

    if (month !== 11 || date < unlockDay) {
      alert(`Jour ${unlockDay} non disponible !`);
      return;
    }

    // --- SCENE ---
    const scene = new THREE.Scene();

    // --- SKYBOX ---
    const cubeLoader = new THREE.CubeTextureLoader();
    const texture = cubeLoader.load([
      "/sky/px.png",
      "/sky/nx.png",
      "/sky/py.png",
      "/sky/ny.png",
      "/sky/pz.png",
      "/sky/nz.png",
    ]);
    scene.background = texture;

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(
      60,
      (window.innerWidth - 600) / (window.innerHeight - 300),
      0.1,
      100
    );
    camera.position.set(0, 2, 6);

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 600, window.innerHeight - 300);
    const container = document.getElementById("scene-container");
    if (!container) return;
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // --- CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.update();

    // --- VARIABLES ---
    let mixer: THREE.AnimationMixer | null = null;
    const actions: Record<string, THREE.AnimationAction> = {};
    let activeAction: THREE.AnimationAction | null = null;
    let character: THREE.Object3D | null = null;
    let socle: THREE.Mesh;
    let socleVisible = false;
    const clock = new THREE.Clock();

    // --- SOCLE ---
    const socleGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const socleMat = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      metalness: 0.8,
      roughness: 0.2,
    });
    socle = new THREE.Mesh(socleGeo, socleMat);
    socle.position.set(0, -0.02, 0);
    socle.scale.y = 0.5;
    scene.add(socle);

    // --- LOAD MODEL ---
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

      animate();
    });

    // --- PLAY ANIMATION ---
    function play(name: string) {
      if (!mixer) return;
      if (activeAction) activeAction.stop();
      activeAction = actions[name];
      activeAction?.play();
    }

    // --- BUTTONS ---
    const danceBtn = document.getElementById("danceBtn");
    const jumpBtn = document.getElementById("jumpBtn");
    const turnBtn = document.getElementById("turnBtn");

    const onDance = () => play("Danse");
    const onJump = () => play("Jump");
    const onTurn = () => {
      if (!character) return;
      gsap.to(character.rotation, {
        y: character.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut",
      });

      socleVisible = !socleVisible;
      gsap.to(socle.scale, {
        y: socleVisible ? 1 : 0.01,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    danceBtn?.addEventListener("click", onDance);
    jumpBtn?.addEventListener("click", onJump);
    turnBtn?.addEventListener("click", onTurn);

    // --- SNOW ---
    const snowCount = 1500;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions: number[] = [];
    const snowSpeeds: number[] = [];
    const snowSizes: number[] = [];

    for (let i = 0; i < snowCount; i++) {
      snowPositions.push(
        (Math.random() - 0.5) * 20,
        Math.random() * 15,
        (Math.random() - 0.5) * 20
      );
      snowSpeeds.push(0.01 + Math.random() * 0.03);
      snowSizes.push(0.05 + Math.random() * 0.15);
    }

    snowGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(snowPositions, 3)
    );
    snowGeo.setAttribute(
      "speed",
      new THREE.Float32BufferAttribute(snowSpeeds, 1)
    );
    snowGeo.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(snowSizes, 1)
    );

    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });
    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);

    // --- ANIMATE LOOP ---
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      const positions = snowParticles.geometry.attributes
        .position.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        const idx = i * 3;
        positions[idx + 1] -= snowSpeeds[i];
        positions[idx] += Math.sin(Date.now() * 0.001 + i) * 0.002;
        positions[idx + 2] += Math.cos(Date.now() * 0.001 + i) * 0.002;

        if (positions[idx + 1] < 0) {
          positions[idx + 1] = 15;
          positions[idx] = (Math.random() - 0.5) * 20;
          positions[idx + 2] = (Math.random() - 0.5) * 20;
        }
      }
      snowParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    // --- RESIZE ---
    const handleResize = () => {
      camera.aspect = (window.innerWidth - 600) / (window.innerHeight - 300);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth - 600, window.innerHeight - 300);
    };
    window.addEventListener("resize", handleResize);

    // --- LOGO FOOTER ---
    const logoFooter = document.getElementById("logo-footer");
    const onLogoClick = () => {
      alert(
        "T'APPRENDS PAS DE TES ERRRRRREURS ??? LE CONSENTEMENT ?????? SAYER"
      );
    };
    logoFooter?.addEventListener("click", onLogoClick);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      danceBtn?.removeEventListener("click", onDance);
      jumpBtn?.removeEventListener("click", onJump);
      turnBtn?.removeEventListener("click", onTurn);
      logoFooter?.removeEventListener("click", onLogoClick);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <BackHome />
      <header className="header">
        <h1>Jour 3 🎄</h1>
      </header>
      <p id="description">
        Pain d'épice au max après tous les km du jour 2 😼⋆.ೃ🪩
      </p>
      <div id="scene-container" style={{ width: "100%", height: "500px" }} />
      <div id="buttons">
        <button id="danceBtn">Danse</button>
        <button id="jumpBtn">Saute</button>
        <button id="turnBtn">Tourne</button>
      </div>
      <footer>
        <img id="logo-footer" src="/assets/paindepice.png" alt="Pain d'épice" />
      </footer>
    </div>
  );
}
