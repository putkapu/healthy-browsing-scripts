// ==UserScript==
// @name         Block Sites (G1, YouTube, News + Others)
// @namespace    http://tampermonkey.net/
// @version      2026-02-10
// @description  Blocks distracting sites early and reliably.
// @author       Ruan
// @match        *://*.g1.globo.com/*
// @match        *://g1.globo.com/*
// @match        *://*.uol.com.br/*
// @match        *://*.folha.uol.com.br/*
// @match        *://*.estadao.com.br/*
// @match        *://*.cnn.com/*
// @match        *://*.bbc.com/*
// @match        *://*.terra.com.br/*
// @match        *://*.oglobo.globo.com/*
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @match        *://*.youtu.be/*
// @match        *://youtu.be/*
// @match        *://*.4chan.org/*
// @match        *://4chan.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // If you want to allow specific paths, add them here
    const allowedPaths = [
        // Example:
        // '/watch',
        // '/studio'
    ];

    const currentUrl = window.location.href;

    const isAllowed = allowedPaths.some(path =>
        currentUrl.includes(path)
    );

    if (isAllowed) return;

    // Stop page loading immediately
    window.stop();

    // Replace entire document
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
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #444;
                    color: #fff;
                    border: none;
                    cursor: pointer;
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
            <p>
                 Will this move you forward?
            </p>
                <button onclick="window.history.back()">Return</button>
            </div>
        </body>
    `;

})();
