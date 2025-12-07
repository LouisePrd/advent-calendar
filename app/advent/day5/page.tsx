"use client";
import { useEffect } from "react";
import BackHome from "../../components/DayNavigation";
import "../../styles/styles-jours.css";

export default function Day5() {
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const unlockDay = 5;

    if (month !== 11 || date < unlockDay) {
      alert(`Jour ${unlockDay} non disponible !`);
      document.body.innerHTML = `
        <header class="header">
          <h1>Accès verrouillé</h1>
        </header>
        <main class="card">
          <p>Tssss arrête de tricher... #nerd </p>
        </main>`;
      return;
    }

    const body = document.body;

    function createAngryEmoji() {
      const emoji = document.createElement("div");
      emoji.textContent = "😡";
      emoji.style.position = "fixed";
      emoji.style.left = Math.random() * window.innerWidth + "px";
      emoji.style.top = "-50px";
      emoji.style.fontSize = Math.random() * 30 + 20 + "px";
      emoji.style.pointerEvents = "none";
      if (Math.random() < 0.7) {
        emoji.style.zIndex = "10";
      } else {
        emoji.style.zIndex = "0";
      }
      body.appendChild(emoji);

      let top = -50;
      const speed = Math.random() * 3 + 1;

      function fall() {
        top += speed;
        emoji.style.top = top + "px";
        if (top < window.innerHeight) {
          requestAnimationFrame(fall);
        } else {
          emoji.remove();
        }
      }
      fall();
    }

    const interval = setInterval(createAngryEmoji, 300);

    return () => clearInterval(interval);

  }, []);

  return (
    <div>
      <BackHome />
      <header className="header">
        <h1>Jour 5 🎄</h1>
      </header>

      <p>
        Aujourd'hui c'est grêve. Bon en vrai je suis de retour demain. <br />
        Je laisse mon syndicat gérer.
      </p>

      <img id="greve" src="/assets/greve.png" alt="Grève" />
    </div>
  );
}
