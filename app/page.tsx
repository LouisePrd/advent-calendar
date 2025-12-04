"use client";

import { useEffect } from "react";
import "./styles/styles-home.css";
import initCalendar from "./scripts/calendar";

export default function Home() {
  useEffect(() => {
    initCalendar();

    // --- ANIMATION LOGO ---
    const logo = document.getElementById("logo") as HTMLImageElement | null;
    const header = document.querySelector("header") as HTMLElement | null;
    if (!logo || !header) return;

    let posX = 0;
    let speed = 2;
    let direction = 1;
    let animationFrameId: number | null = null;

    const updateMaxX = () => header.clientWidth - logo.clientWidth;
    let maxX = updateMaxX();

    window.addEventListener("resize", () => {
      maxX = updateMaxX();
    });

    function moveLogo() {
      if (!logo) return;

      posX += speed * direction;

      if (posX >= maxX || posX <= 0) {
        direction *= -1;
        logo.style.transform =
          direction === 1
            ? "translateY(-50%) scaleX(1)"
            : "translateY(-50%) scaleX(-1)";
      }

      logo.style.left = posX + "px";
      animationFrameId = requestAnimationFrame(moveLogo);
    }

    moveLogo();

    const popup = document.getElementById("popup") as HTMLDivElement | null;
    const closeBtn = document.getElementById("closePopup") as HTMLButtonElement | null;

    if (popup && closeBtn) {
      logo.addEventListener("click", () => {
        popup.style.display = "block";
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      });

      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
        moveLogo();
      });
    }

    // --- SNOWFLAKES ❄ ---
    const snowflakes: HTMLDivElement[] = [];
    const numFlakes = 50;

    for (let i = 0; i < numFlakes; i++) {
      const flake = document.createElement("div") as HTMLDivElement;
      flake.classList.add("snowflake");
      flake.innerText = "❄";
      flake.style.left = Math.random() * window.innerWidth + "px";
      flake.style.animationDuration = 2 + Math.random() * 3 + "s";
      flake.style.opacity = (0.5 + Math.random() * 0.5).toString();
      flake.style.fontSize = 10 + Math.random() * 20 + "px";
      document.body.appendChild(flake);
      snowflakes.push(flake);
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      snowflakes.forEach((flake) => flake.remove());
    };
  }, []);

  return (
    <>
      <header>
        <img id="logo" src="/assets/gaya.png" alt="Logo Gaya" />
      </header>

      <main>
        <h1>Ho ho ho !</h1>

        <section className="advent-grid">
          {Array.from({ length: 24 }, (_, i) => {
            const day = i + 1;
            const isUnlocked = day <= new Date().getDate() && new Date().getMonth() === 11;
            return (
              <div key={day} data-day={day} className={isUnlocked ? "" : "locked"}>
                {isUnlocked && day <= 3 ? (
                  <a href={`/advent/day${day}`}>{day}</a>
                ) : (
                  day
                )}
              </div>
            );
          })}
        </section>
      </main>

      <div
        id="popup"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgb(255, 0, 0)",
          padding: "50px",
          border: "5px solid #ffffff",
          display: "none",
          zIndex: 1000,
          fontSize: "20px",
          color: "#ffffff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Pourquoi t'as cliqué ???? Le consentement ??????? 😾&nbsp;
        <button id="closePopup">OK</button>
      </div>

      <footer>
        <img id="nerd-cat" src="/assets/nerd-cat.png" alt="Chat nerd avec lunettes" />
        <img id="cat-christmas" src="/assets/cat-christmas.png" alt="Chat de Noël" />
      </footer>
    </>
  );
}
