/*
 * © 2025 [Hannah Carolina Fabian Valensia, Paola Ortega Bravo, Martín García Torres, Carlos Jimenez Zepeda, Santiago Arreola Munguía, Demián Velasco Gómez Llanos, Andrés González Gómez, Rodrigo López Gómez, Nahui Metztli Dado Delgadillo, Ana Mariem Pérez Chacón, Karla Avila Navarro, Ana María Guzman Solís]
 * Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * 
 * Contributors must be credited when using or modifying this file.
 * Commercial use or redistribution without permission is prohibited.
 * 
 * Asset Attributions:
 * - Some SVG icons provided by Vecteezy (https://www.vecteezy.com)
 *   License: Free for personal and commercial use with attribution
 * 
 * Full license text: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
 */

// src/Screens/LevelOverlay/LevelOverlay.jsx
import React, { useRef, useEffect, useState } from "react";
import "./style.css";
import { IconButton } from "../../Buttons/IconButton/IconButton.jsx";
import { ReactComponent as Microphone } from "../../../assets/microphone.svg";
import { ReactComponent as Next } from "../../../assets/next.svg";
import { ReactComponent as Repeat } from "../../../assets/repeat.svg";

import { useAppContext, setScene } from "../../../context/DirectoryProvider.jsx";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useClipboardCustom } from "../../../hooks/copyHook.jsx";
import { SpeechResultPopup } from "../PopUp/SpeechResultPopup.jsx";

// Audio files from public folder
const audioSets = {
  0: ["/sounds/monkey.mp3", "/sounds/lion.mp3", "/sounds/elephant.mp3"],
  1: ["/sounds/pencil.mp3", "/sounds/backpack.mp3", "/sounds/ball.mp3"],
  2: ["/sounds/apple.mp3", "/sounds/bread.mp3", "/sounds/fish.mp3"],
  3: ["/sounds/mom.mp3", "/sounds/bed.mp3", "/sounds/dad.mp3"],
  4: ["/sounds/hands.mp3", "/sounds/toothbrush.mp3", "/sounds/feet.mp3"],
  5: ["/sounds/airplane.mp3", "/sounds/bike.mp3", "/sounds/boat.mp3"],
  6: ["/sounds/ball_play.mp3", "/sounds/swing.mp3", "/sounds/slide.mp3"],
};

export const LevelOverlay = ({ text, onResult }) => {
  const { state, dispatch } = useAppContext();
  const [activeSyllable, setActiveSyllable] = useState(null);
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, copy] = useClipboardCustom();
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [sessionTranscript, setSessionTranscript] = useState("");
  useEffect(() => {
    if (transcript) {
      console.log("speaking...", transcript);
    }
  }, [transcript]);
  const startListening = () => {
    setSessionTranscript("");
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();

    const spoken = transcript.trim();
    console.log("said...  ", spoken);
    setSessionTranscript(spoken);

    const normalize = (str) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const expected = normalize(text);
    const said = normalize(spoken);
    console.log("expected phrase: ", expected);

    const correct = said && expected && said.includes(expected);
    if (onResult) onResult(correct);

    if (correct) console.log(" CORRECTO");
    else console.log(" INCORRECTO");
  };

  // --- 🔁 Repeat base sound  ---
  const handleRepeatClick = () => {
    const currentLevel = state.level;
    const src = audioSets[currentLevel]?.[state.scene];

    const audio = new Audio(src);
    audio.volume = state.settings.volume;
    audio.currentTime = 0;

    audio
      .play()
      .then(() => console.log("Audio playing:", src))
      .catch((err) => console.error("Audio playback failed:", err));
  };

  // --- 🗣️ Repeat syllables with animation ---
  const handleRepeatSound = async () => {
    try {
      const { level, difficulty, scene, settings } = state;
      const syllables = text.split("-").map((s) => s.trim()).filter(Boolean);

      for (let i = 0; i < syllables.length; i++) {
        const filename = `lvl${level}_sub${difficulty - 1}_w${scene}_s${i}.mp3`;
        const filepath = `/audios/${filename}`;
        const audio = new Audio(filepath);
        audio.volume = settings.volume ?? 0.5;

        console.log(`🔊 Playing syllable ${i + 1}/${syllables.length}: ${filepath}`);

        // Trigger animation
        setActiveSyllable(i);

        // Wait for audio to finish
        await new Promise((resolve, reject) => {
          audio.onended = () => {
            setActiveSyllable(null);
            resolve();
          };
          audio.onerror = (err) => {
            console.error(`❌ Error playing ${filepath}:`, err);
            setActiveSyllable(null);
            resolve(); // Skip if error
          };
          audio.play().catch(reject);
        });
      }

      console.log("✅ Finished playing all syllables.");
    } catch (error) {
      console.error("❌ Error in handleRepeatSound:", error);
    }
  };

  // --- ⏭️ Move to next sublevel ---
  const handleNextClick = async () => {
    const nextScene = state.scene < 2 ? state.scene + 1 : 0;

    try {
      await setScene(dispatch, nextScene);
      console.log(`Sublevel changed to: ${state.scene}`);
    } catch (error) {
      console.error("Failed to change sublevel:", error);
    }
  };

  // --- Render syllables separately for animation ---
  const syllables = text.split("-").map((s) => s.trim()).filter(Boolean);

  return (

    <div className="overlay-container">

      <p className="overlay-text">
        {syllables.map((syllable, i) => (
          <span
            key={i}
            className={`syllable ${activeSyllable === i ? "active" : ""}`}
          >
            {syllable}
            {i < syllables.length - 1 && "-"}
          </span>
        ))}
      </p>
      <div className="overlay-buttons">
        <IconButton
          icon={Microphone}
          onClick={() => {
            if (listening) {
              stopListening();
            } else {
              startListening();
            }
          }}
          className={`btn-overlay ${listening ? "listening" : ""}`}
        />
        <IconButton
          icon={Repeat}
          onClick={handleRepeatSound}
          className="btn-overlay"
        />
        <IconButton
          icon={Next}
          onClick={handleNextClick}
          className="btn-overlay"
        />

      </div>


    </div>
  );
};
