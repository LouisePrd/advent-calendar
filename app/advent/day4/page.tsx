"use client";

import { useEffect } from "react";
import "../../styles/styles-jours.css";

export default function Day4() {
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const unlockDay = 4;

    if (month !== 11 || date < unlockDay) {
      alert(`Jour ${unlockDay} non disponible !`);
      document.body.innerHTML = `
        <header class="header">
          <h1>Accès verrouillé</h1>
        </header>
        <main class="card">
          <p>Tssss arrête de tricher petit malin... #nerd😎</p>
        </main>`;
    }
  }, []);

  const photos = [
    { src: "/goofy/og.webp", alt: "Og" },
    { src: "/goofy/crowd.webp", alt: "Crowd" },
    { src: "/goofy/dog.jpg", alt: "Dog" },
    { src: "/goofy/starterpack.webp", alt: "Starterpack" },
    { src: "/goofy/silly-dog.gif", alt: "Silly Dog" },
    { src: "/goofy/skydog.webp", alt: "Sky Dog" },
    { src: "/goofy/group.png", alt: "Group" },
    { src: "/goofy/anotherdog.jpg", alt: "Another Dog" },
    { src: "/goofy/gamedog.png", alt: "Game Dog" },
  ];

  return (
    <div>
      <header className="header">
        <h1>Jour 4 🎄</h1>
      </header>

      <p>Aujourd'hui, rares footages de nos ancêtres #nostalgie</p>

      <div id="grid-photos">
        {photos.map((photo, i) => (
          <div key={i} className="photo">
            <img src={photo.src} alt={photo.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}
