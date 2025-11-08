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


require('dotenv').config(); // Load environment variables from .env file

//import gTTS from 'gtts';
//import fs from 'fs';

const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // Allow all origins (for development)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Server Environment variables
const PORT = 5000;


app.route('/logIn')
    .post((req, res) =>{
        console.log("LOGGED IN!!!!!!!");
    });

app.route("/tts").post(async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text" });

    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join("./audios", filename);

    const speech = new gTTS(text, "es");
    speech.save(filepath, (err) => {
      if (err) {
        console.error("Error generating TTS:", err);
        return res.status(500).json({ error: "TTS generation failed" });
      }
      console.log(`✅ Audio saved as ${filename}`);
      res.json({ path: filepath });
    });
  } catch (error) {
    console.error("Error in /tts route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


async function generateSpeech(outputFolder = "./audios") {
  if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

  const phrases = {
    0: [
      ["MO-no", "Le-ON", "E-le-FAN-te"],
      ["El MO-no SAL-ta.", "El Le-ON RU-he.", "El E-le-FAN-te ka-MI-na."],
      [
        "El MO-no SAL-ta de RA-ma en RA-ma mien-tras GRI-ta FWER-te.",
        "El Le-ON RU-he en ME-dio de la SEL-va kwan-do be u-na PRE-sa.",
        "El E-le-FAN-te ka-MI-na len-ta-men-te por el RI-o kon su TROM-pa al-SA-da.",
      ],
    ],
    1: [
      ["LA-pis", "Mo-CHI-la", "Pe-LO-ta"],
      ["Ten-go un LA-pis a-ma-RI-yo.", "La Mo-CHI-la es GRAN-de.", "La Pe-LO-ta ru-E-da."],
      [
        "El NI-nyo u-sa un LA-pis a-ma-RI-yo pa-ra es-kri-BIR su NOM-bre.",
        "Mi Mo-CHI-la es-TA ye-NA de LI-bros i ko-LO-res.",
        "La Pe-LO-ta ru-E-da RA-pi-do por el KAM-po i ka-e en la por-te-RI-a.",
      ],
    ],
    2: [
      ["MAN-sa-na", "Pan", "Pes"],
      ["Kie-ro u-na MAN-sa-na.", "El pan es-TA ka-LYEN-te.", "El pes NA-da."],
      [
        "La NI-nya ko-me u-na MAN-sa-na ro-ha por-ke TYE-ne AM-bre.",
        "El pan re-SYEN or-NE-a-do WE-le de-li-SYO-so i es-TA swa-ve.",
        "El pes NA-da RA-pi-do en el MAR mien-tras es-KI-ba las O-las.",
      ],
    ],
    3: [
      ["Ma-MA", "KA-ma", "Pa-PA"],
      ["Ma-MA ko-SI-na.", "La KA-ma es-TA ten-DI-da.", "Mi Pa-PA DWER-me."],
      [
        "Mi Ma-MA ko-SI-na ar-ROS mien-tras yo la a-YU-do.",
        "La KA-ma TYE-ne u-na ko-BI-ha ro-ha i MU-chos ko-HI-nes.",
        "Mi Pa-PA DWER-me tran-KI-lo en su KWAR-to.",
      ],
    ],
    4: [
      ["MA-nos", "Se-pi-yo", "Pyes"],
      ["LA-va-te las MA-nos.", "U-so el Se-pi-yo de DYEN-tes.", "Mis Pyes KO-ren."],
      [
        "De-be-mos la-VAR-nos las MA-nos AN-tes de ko-MER pa-ra no en-fer-MAR-nos.",
        "Ka-da ma-NYA-na u-so mi Se-pi-yo de DYEN-tes kon pas-ta de men-ta.",
        "Mis Pyes KO-ren RA-pi-do kwan-do HU-e-go en el PAR-ke.",
      ],
    ],
    5: [
      ["A-BYON", "Bi-si-KLE-ta", "BAR-ko"],
      ["El A-BYON BWE-la.", "La Bi-si-KLE-ta es a-SUL.", "El BAR-ko na-be-GA."],
      [
        "El A-BYON des-PE-ga des-de la PIS-ta i su-be EN-tre las NU-bes.",
        "El NI-nyo MON-ta su Bi-si-KLE-ta en el PAR-ke ka-da TAR-de.",
        "El BAR-ko na-be-GA len-to por el MAR as-ta ye-GAR a PWER-to.",
      ],
    ],
    6: [
      ["Pe-LO-ta", "Ko-lum-pyo", "Res-ba-la-DI-ya"],
      ["LAN-sa la Pe-LO-ta.", "Me SU-bo al Ko-lum-pyo.", "Ba-ha por la Res-ba-la-DI-ya."],
      [
        "Ju-ga-mos kon la Pe-LO-ta i ko-re-mos to-dos HUN-tos.",
        "El NI-nyo su-be al Ko-lum-pyo i se ba-lan-SE-a muy AL-to.",
        "La NI-nya ba-ha por la Res-ba-la-DI-ya i RI-e kon a-le-GRI-a.",
      ],
    ],
  };


  for (const levelKey of Object.keys(phrases)) {
    const sublevels = phrases[levelKey];

    for (let subIndex = 0; subIndex < sublevels.length; subIndex++) {
      const group = sublevels[subIndex];

      for (let wordIndex = 0; wordIndex < group.length; wordIndex++) {
        const phrase = group[wordIndex];
        const syllables = phrase.split("-");

        for (let i = 0; i < syllables.length; i++) {
          const text = syllables[i];
          const filename = `lvl${levelKey}_sub${subIndex}_w${wordIndex}_s${i}.mp3`;
          const filepath = path.join(outputFolder, filename);

          try {
            const speech = new gTTS(text, "es");
            await new Promise((resolve, reject) => {
              speech.save(filepath, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
            console.log(`✅ Saved: ${filepath}`);
          } catch (error) {
            console.error("❌ Error generating:", text, error);
          }
        }
      }
    }
  }
}



app.listen(PORT, () => {
    //generateSpeech();
    console.log(`<|Berkeley listening port ${PORT}|>`); // Log server start and port information
});