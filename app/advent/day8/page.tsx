"use client";

import { useEffect, useRef } from "react";
import BackHome from "../../components/DayNavigation";
import {
  FilesetResolver,
  GestureRecognizer,
  GestureRecognizerOptions,
} from "@mediapipe/tasks-vision";
import "../../styles/styles-jours.css";

interface Landmark {
  x: number;
  y: number;
  [key: string]: any;
}

export default function Day8() {
  const gestureImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const initGesture = async () => {
      const today = new Date();
      const month = today.getMonth();
      const date = today.getDate();
      const unlockDay = 8;

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

      const video = document.getElementById(
        "input-video"
      ) as HTMLVideoElement | null;
      const canvas = document.getElementById(
        "output-canvas"
      ) as HTMLCanvasElement | null;
      const infoBox = document.getElementById("info-box");

      if (!video || !canvas || !infoBox) {
        console.error("Video, canvas ou infoBox non trouvés");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        video.srcObject = stream;
        await video.play();
      } catch (e) {
        console.error("Impossible d'accéder à la caméra:", e);
        infoBox.innerHTML = "<p>Impossible d'accéder à la caméra.</p>";
        return;
      }

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
      );

      const gestureRecognizerOptions: GestureRecognizerOptions = {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
        },
        runningMode: "VIDEO",
        numHands: 1,
      };

      const gestureRecognizer = await GestureRecognizer.createFromOptions(
        vision,
        gestureRecognizerOptions
      );

      const gestureMap: Record<string, string> = {
        Thumb_Up: "/assets/mediapipe/thumbup.jpg",
        Victory: "/assets/mediapipe/peace.jpg",
        Closed_Fist: "/assets/mediapipe/poing.jpg",
        Thumb_Down: "/assets/mediapipe/thumbdown.jpg",
        Pointing_Up: "/assets/mediapipe/nerd.jpg",
        Open_Palm: "/assets/mediapipe/palm.jpg",
      };

      const loop = async () => {
        if (!video.videoWidth || !video.videoHeight) {
          requestAnimationFrame(loop);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        let result: any = null;
        try {
          result = await (gestureRecognizer as any).recognizeForVideo(
            video,
            performance.now()
          );
        } catch {}

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let handDetected = false;

        // Landmarks
        if (result?.landmarks?.[0]?.length) {
          handDetected = true;
          const landmarks = result.landmarks[0] as Landmark[];

          ctx.fillStyle = "red";
          landmarks.forEach((lm) => {
            if (lm?.x != null && lm?.y != null) {
              ctx.beginPath();
              ctx.arc(
                lm.x * canvas.width,
                lm.y * canvas.height,
                5,
                0,
                2 * Math.PI
              );
              ctx.fill();
            }
          });

          // Rectangle autour de la main
          const xs = landmarks.map((lm) => lm.x * canvas.width);
          const ys = landmarks.map((lm) => lm.y * canvas.height);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);

          ctx.strokeStyle = "lime";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            minX - 10,
            minY - 10,
            maxX - minX + 20,
            maxY - minY + 20
          );
        }

        // Geste détecté
        if (result?.gestures?.[0]?.[0]) {
          handDetected = true;
          const gesture = result.gestures[0][0].categoryName;
          infoBox.innerHTML = `<p>${gesture}</p>`;

          const imgPath = gestureMap[gesture];

          if (gestureImgRef.current) {
            if (imgPath) {
              gestureImgRef.current.src = imgPath;
              gestureImgRef.current!.style.opacity = "1";
            }
          }
        } else if (!handDetected) {
          infoBox.innerHTML = "<p>Aucune main détectée</p>";
          if (gestureImgRef.current)
            gestureImgRef.current.src = "/assets/mediapipe/unknown.jpg";
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    };

    initGesture();
  }, []);

  return (
    <div>
      <BackHome />
      <div className="day-container">
        <header className="header">
          <h1>Jour 8 🎄</h1>
        </header>
        <p id="description">Teste les gestes devant la caméra :)</p>

        <div className="content-container">
          <div
            id="video-container"
            className="video-wrapper"
            style={{ position: "relative" }}
          >
            <video
              id="input-video"
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "auto" }}
            ></video>
            <canvas
              id="output-canvas"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            ></canvas>
          </div>

          <div
            id="gesture-image"
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 1000,
            }}
          >
            <img
              ref={gestureImgRef}
              alt="Image du geste"
              style={{
                maxWidth: "150px",
                height: "auto",
                display: "block",
                transition: "opacity 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          id="info-box"
          className="info-box"
          style={{ textAlign: "center", marginTop: 10 }}
        >
          <p>Les gestes détectés apparaîtront ici.</p>
        </div>
      </div>
    </div>
  );
}
