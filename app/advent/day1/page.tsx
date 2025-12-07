"use client";
import { useEffect, useState } from "react";
import BackHome from "../../components/DayNavigation";
import "../../styles/styles-jours.css";

export default function Day1() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const unlockDay = 1;

    if (month === 11 && date >= unlockDay) {
      setUnlocked(true);
    } else {
      alert(`Jour ${unlockDay} non disponible !`);
      setUnlocked(false);
    }
  }, []);

  if (!unlocked) {
    return (
      <>
        <header className="header">
          <h1>Accès verrouillé</h1>
        </header>
        <main className="card">
          <p>Tssss arrête de tricher petit malin... #nerd😎</p>
        </main>
      </>
    );
  }

  return (
    <>
      <BackHome />
      <header className="header">
        <h1>Jour 1 🎄</h1>
      </header>

      <main className="card fade-in">
        <p>
          C&apos;est le premier jour (même si t&apos;as déjà vu un début sur mon
          PC oups)
          <br />
          Voici la petite vidéo douteuse du jour :
        </p>

        <div className="video-wrapper">
          <video controls className="video">
            <source src="/videos/jour1.mp4" type="video/mp4" />
          </video>
        </div>
      </main>
    </>
  );
}
