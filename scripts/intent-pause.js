// ==UserScript==
// @name         Intent Pause
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://grok.x.ai/*
// @match        *://gemini.google.com/*
// @run-at       document-start
// ==/UserScript==

(function () {

    const SESSION_KEY = "ai_active_session";

    function getSession() {
        return localStorage.getItem(SESSION_KEY);
    }

    function setSession(intent) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            intent,
            startedAt: Date.now()
        }));
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    function renderPause(existingIntent) {

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
                    max-width: 520px;
                    padding: 20px;
                }
                .lotus {
                    font-size: 42px;
                    margin-bottom: 20px;
                    opacity: 0.85;
                }
                h1 {
                    font-weight: 500;
                    margin-bottom: 10px;
                }
                p {
                    opacity: 0.8;
                }
                textarea {
                    width: 100%;
                    height: 90px;
                    margin-top: 20px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 10px;
                    font-size: 14px;
                    resize: none;
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #444;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                }
                .intentDisplay {
                    margin-top: 20px;
                    font-size: 14px;
                    opacity: 0.75;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <div class="lotus">❀</div>
                <h1>Pause.</h1>
                ${
                    existingIntent
                        ? `
                        <p>Session active.</p>
                        <div class="intentDisplay"><strong>Intent:</strong><br>${existingIntent}</div>
                        <button id="continueBtn">Continue</button>
                        <button id="endBtn">End Session</button>
                        `
                        : `
                        <p>Do you really need this right now?</p>
                        <textarea id="intentInput" placeholder="What concrete output will exist after this?"></textarea>
                        <button id="startBtn">Begin consciously</button>
                        `
                }
            </div>
        </body>
        `;

        if (existingIntent) {
            document.getElementById("continueBtn").onclick = () => location.reload();
            document.getElementById("endBtn").onclick = () => {
                clearSession();
                location.reload();
            };
        } else {
            document.getElementById("startBtn").onclick = () => {
                const intent = document.getElementById("intentInput").value.trim();
                if (intent.length < 12) {
                    alert("Be specific.");
                    return;
                }
                setSession(intent);
                location.reload();
            };
        }
    }

    const session = getSession();

    if (session) {
        const parsed = JSON.parse(session);
        renderPause(parsed.intent);
    } else {
        renderPause(null);
    }

})();
