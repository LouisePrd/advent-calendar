"use client";

import { useEffect, useRef } from "react";
import BackHome from "../../components/DayNavigation";
import "../../styles/styles-jours.css";

export default function Day2() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const restartRef = useRef<HTMLButtonElement | null>(null);
  const logoFooterRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const unlockDay = 2;
    if (month !== 11 || date < unlockDay) {
      alert(`Jour ${unlockDay} non disponible !`);
      return;
    }

    const canvas = canvasRef.current;
    const restartBtn = restartRef.current;
    if (!canvas || !restartBtn) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = 900;
    const H = 200;
    canvas.width = W;
    canvas.height = H;

    let running = false;
    let lastTime = 0;
    let speed = 5;
    let spawnTimer = 0;
    let spawnInterval = 1200;
    let obstacles: any[] = [];
    let score = 0;

    const dino = {
      x: 50,
      y: 0,
      w: 28,
      h: 42,
      vy: 0,
      gravity: 1.1,
      jumpForce: -18,
      grounded: false,
      ducking: false,
      frame: 0,
      frameTimer: 0,
      frameInterval: 200,
    };

    const FRAME_W = 260;
    const FRAME_H = 450;
    const groundY = H - 40;

    const dinoSprite = new Image();
    dinoSprite.src = "/assets/sprites-v2.png";

    function jump() {
      if (!running && dinoSprite.complete) start();
      if (dino.grounded) {
        dino.vy = dino.jumpForce;
        dino.grounded = false;
        dino.ducking = false;
      }
    }

    function duck(on: boolean) {
      dino.ducking = !!on && dino.grounded;
    }

    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        duck(true);
      }
      keys[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
      if (e.code === "ArrowDown") duck(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        jump();
      },
      { passive: false }
    );

    function spawnObstacle() {
      const typeRand = Math.random();
      let width, height, y;
      if (typeRand < 0.5) {
        width = 18 + Math.random() * 22;
        height = 20 + Math.random() * 10;
        y = groundY - height;
      } else if (typeRand < 0.85) {
        width = 32 + Math.random() * 30;
        height = 35 + Math.random() * 12;
        y = groundY - height;
      } else {
        width = 28 + Math.random() * 32;
        height = 45 + Math.random() * 20;
        y = groundY - height - 60;
      }
      obstacles.push({
        x: W + 20,
        y: Math.floor(y),
        w: Math.floor(width),
        h: Math.floor(height),
      });
    }

    function start() {
      if (!dinoSprite.complete) {
        dinoSprite.onload = () => start();
        return;
      }
      running = true;
      lastTime = performance.now();
      speed = 5;
      spawnTimer = 0;
      spawnInterval = 1200;
      obstacles = [];
      score = 0;
      requestAnimationFrame(loop);
    }

    function gameOver() {
      running = false;
    }
    const restart = () => start();
    restartBtn.addEventListener("click", restart);

    function loop(t: number) {
      const dt = t - lastTime;
      lastTime = t;
      update(dt);
      render();
      if (running) requestAnimationFrame(loop);
    }

    function update(dt: number) {
      speed += 0.0005 * dt;
      spawnTimer += dt;
      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        spawnInterval = 650 + Math.random() * 1200 - Math.min(500, score * 2);
        spawnObstacle();
      }

      dino.vy += dino.gravity * (dt / 16);
      dino.y += dino.vy * (dt / 16);

      dino.frameTimer += dt;
      if (dino.frameTimer >= dino.frameInterval) {
        dino.frameTimer = 0;
        if (!dino.grounded) dino.frame = 4;
        else if (dino.ducking) dino.frame = 3;
        else dino.frame = dino.frame === 1 ? 2 : 1;
      }

      if (dino.y >= groundY - dino.h) {
        dino.y = groundY - dino.h;
        dino.vy = 0;
        dino.grounded = true;
      } else dino.grounded = false;

      const dh = dino.ducking ? dino.h * 0.55 : dino.h;
      const hitboxScale = 1.6;
      const hitbox = {
        x: dino.x - (dino.w * (hitboxScale - 1)) / 2 - 10,
        y: dino.y + (dino.h - dh) - dh * (hitboxScale - 1),
        w: dino.w * hitboxScale,
        h: dh * hitboxScale,
      };

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const ob = obstacles[i];
        ob.x -= speed * (dt / 16);
        if (rectIntersect(hitbox, ob)) gameOver();
        if (!ob.passed && ob.x + ob.w < dino.x) {
          ob.passed = true;
          score++;
        }
        if (ob.x + ob.w < -50) obstacles.splice(i, 1);
      }
    }

    function rectIntersect(a: any, b: any) {
      return (
        a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
      );
    }

    function render() {
      if (!ctx) return;

      ctx.fillStyle = "#b1d9ffff";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#07220bff";
      ctx.fillRect(0, groundY, W, H - groundY);

      ctx.save();
      ctx.fillStyle = "#082e16ff";
      for (const ob of obstacles) {
        ctx.fillRect(Math.round(ob.x), Math.round(ob.y), ob.w, ob.h);
        ctx.strokeRect(Math.round(ob.x), Math.round(ob.y), ob.w, ob.h);
      }
      ctx.restore();

      if (dinoSprite.complete) {
        ctx.save();
        ctx.translate(dino.x, 0);
        const dh = dino.ducking ? dino.h * 0.55 : dino.h;
        const visualScale = 0.16;
        const drawW = FRAME_W * visualScale;
        const drawH = FRAME_H * visualScale;
        const duckOffset = dino.ducking ? 25 : 0;
        const spriteY = dino.y - drawH + dh + duckOffset;
        ctx.drawImage(
          dinoSprite,
          dino.frame * FRAME_W,
          0,
          FRAME_W,
          FRAME_H,
          -drawW / 2,
          spriteY,
          drawW,
          drawH
        );
        ctx.restore();
      }
    }

    function fitCanvas() {
      if (!canvas) return;
      const containerWidth = Math.min(window.innerWidth - 40, 900);
      const scale = containerWidth / W;
      canvas.style.width = Math.round(W * scale) + "px";
      canvas.style.height = Math.round(H * scale) + "px";
    }

    window.addEventListener("resize", fitCanvas);
    fitCanvas();

    if (logoFooterRef.current) {
      logoFooterRef.current.addEventListener("click", () => {
        alert(
          "T'APPRENDS PAS DE TES ERRRRRREURS ??? LE CONSENTEMENT ?????? SAYER"
        );
      });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", fitCanvas);
      restartBtn.removeEventListener("click", restart);
    };
  }, []);

  return (
    <div>
      <BackHome />
      <header className="header">
        <h1>Jour 2 🎄</h1>
      </header>

      <main>
        <div className="game-wrap">
          <canvas ref={canvasRef} id="game"></canvas>
          <div className="controls">
            <strong>Espace</strong> ou <strong>Up</strong> pour sauter,{" "}
            <strong>Down</strong> pour s'accroupir
          </div>
          <div className="ui">
            <button ref={restartRef} id="restart">
              Play
            </button>
          </div>
        </div>
      </main>

      <footer>
        <img
          ref={logoFooterRef}
          id="logo-footer"
          src="../../assets/paindepice.png"
          alt="Pain d'épice"
        />
      </footer>
    </div>
  );
}
