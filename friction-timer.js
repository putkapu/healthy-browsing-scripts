// ==UserScript==
// @name         Friction Timer (10 min)
// @namespace    http://tampermonkey.net/
// @version      2026-02-11
// @description  Adds a 10 minute pause before accessing sites.
// @author       Ruan
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://grok.x.ai/*
// @match        *://gemini.google.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const WAIT_MINUTES = 10;
    const WAIT_MS = WAIT_MINUTES * 60 * 1000;
    const STORAGE_KEY = "aiFrictionAllowedUntil";

    const now = Date.now();
    const allowedUntil = parseInt(localStorage.getItem(STORAGE_KEY) || "0");

    if (now < allowedUntil) {
        return; // already allowed
    }

    window.stop();

    document.documentElement.innerHTML = `
        <head>
            <title>Pause</title>
            <style>
                body {
                    margin: 0;
                    font-family: system-ui, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: #111;
                    color: #fff;
                    text-align: center;
                }
                .box {
                    max-width: 500px;
                }
                .timer {
                    font-size: 28px;
                    margin: 20px 0;
                    opacity: 0.9;
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #444;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    display: none;
                }
                .lotus {
                   font-size: 42px;
                   margin-bottom: 20px;
                   opacity: 0.85;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <div class="lotus">❀</div>
                <h1>Pause.</h1>
                <p>Do you really need this right now?</p>
                <div class="timer" id="timer"></div>
                <button id="continueBtn">Really go on</button>
            </div>
        </body>
    `;

    const timerEl = document.getElementById("timer");
    const button = document.getElementById("continueBtn");

    const endTime = now + WAIT_MS;

    const interval = setInterval(() => {
        const remaining = endTime - Date.now();

        if (remaining <= 0) {
            clearInterval(interval);
            timerEl.textContent = "You can proceed.";
            button.style.display = "inline-block";
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerEl.textContent =
            minutes.toString().padStart(2, '0') + ":" +
            seconds.toString().padStart(2, '0');
    }, 1000);

    button.onclick = () => {
        localStorage.setItem(STORAGE_KEY, Date.now() + 60 * 60 * 1000);
        // allow access for 1 hour after deliberate decision
        location.reload();
    };

})();
