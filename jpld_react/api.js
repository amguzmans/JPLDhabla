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



import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1000',
    headers: {
        'Content-Type': "application/json"
    }
});

api.interceptors.response.use(
    res => res,
    err => { 
        if(err.response.status === 401){
            console.log("Error 401 -!!");
        }
        return Promise.reject(err);
    }
)

export default api;