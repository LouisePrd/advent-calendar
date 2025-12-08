"use client";

import { useEffect, useState } from "react";
import BackHome from "../../components/DayNavigation";
import "../../styles/styles-jours.css";

export default function Day9() {
  const [fact, setFact] = useState("Chargement...");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  async function fetchFact() {
    try {
      setLoading(true);
      const res = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );
      const data = await res.json();
      setFact(data.text);
    } catch {
      setFact("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
          const today = new Date();
      const month = today.getMonth();
      const date = today.getDate();
      const unlockDay = 9;

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
    fetchFact();
  }, []);

  return (
    <div>
      <BackHome />
      <div className="day-container">
        <header className="header">
          <h1>Jour 9 🎄</h1>
        </header>

        <p id="description">
          Quelques faits randoms pour briller en société et compléter ta
          collection 🤓
        </p>

        <div className="fact">
          <strong>{fact}</strong>
        </div>

        <button onClick={fetchFact} className="again-button" disabled={loading}>
          {loading ? "Chargement..." : "Encore !!"}
        </button>
      </div>

      {showPopup && (
        <div className="nerd-popup">
          <div className="nerd-popup-content">
            <div className="video-container">
              <iframe
                width="300"
                height="430"
                src="https://www.youtube.com/embed/Twq8XaBgmO0"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <button onClick={() => setShowPopup(false)} className="close-btn">
              Fermer
            </button>
          </div>
        </div>
      )}

      <footer className="footer9">
        <img
          src="/assets/nerd-cat.png"
          alt="Nerd Cat"
          onClick={() => setShowPopup(true)}
          className="nerd-cat"
        />
      </footer>
    </div>
  );
}
