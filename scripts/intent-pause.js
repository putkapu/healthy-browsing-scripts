// ==UserScript==
// @name         Intent Pause
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://grok.x.ai/*
// @match        *://gemini.google.com/*
// @run-at       document-end
// ==/UserScript==

(function () {

    const SESSION_KEY = "ai_active_session";
    let overlayVisible = false;

    function getSession() {
        return sessionStorage.getItem(SESSION_KEY);
    }

    function setSession(intent) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            intent,
            startedAt: Date.now()
        }));
    }

    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    function createOverlay(existingIntent) {
        if (overlayVisible) return;
        overlayVisible = true;

        const overlay = document.createElement("div");
        overlay.id = "intent-overlay";

        overlay.innerHTML = `
            <div class="intent-box">
                <h1>Pause.</h1>
                ${
                    existingIntent
                        ? `
                        <p>Session active.</p>
                        <div class="intent-display"><strong>Intent:</strong><br>${existingIntent}</div>
                        <button id="intent-continue">Continue</button>
                        <button id="intent-end">End Session</button>
                        `
                        : `
                        <p>Do you really need this right now?</p>
                        <textarea id="intent-input" placeholder="What concrete output will exist after this?"></textarea>
                        <button id="intent-start">Begin consciously</button>
                        `
                }
            </div>
        `;

        const style = document.createElement("style");
        style.textContent = `
            #intent-overlay {
                position: fixed;
                inset: 0;
                background: #111;
                color: #fff;
                z-index: 2147483647;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: system-ui, sans-serif;
            }
            #intent-overlay .intent-box {
                max-width: 520px;
                padding: 24px;
                text-align: center;
            }
            #intent-overlay textarea {
                width: 100%;
                height: 90px;
                margin-top: 20px;
                background: #1a1a1a;
                border: 1px solid #333;
                color: #fff;
                padding: 10px;
                resize: none;
            }
            #intent-overlay button {
                margin-top: 16px;
                padding: 10px 20px;
                background: #444;
                color: #fff;
                border: none;
                cursor: pointer;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        function closeOverlay() {
            overlay.remove();
            overlayVisible = false;
        }

        if (existingIntent) {

            document.getElementById("intent-continue").onclick = closeOverlay;

            document.getElementById("intent-end").onclick = () => {
                clearSession();
                closeOverlay();
            };

        } else {

            document.getElementById("intent-start").onclick = () => {
                const intent = document.getElementById("intent-input").value.trim();

                if (intent.length < 12) {
                    alert("Be specific.");
                    return;
                }

                setSession(intent);
                closeOverlay();
            };
        }
    }

    function checkAndBlock() {
        const session = getSession();
        if (!session) {
            createOverlay(null);
        } else {
            const parsed = JSON.parse(session);
            createOverlay(parsed.intent);
        }
    }

    // Run immediately
    if (document.readyState === "complete" || document.readyState === "interactive") {
        checkAndBlock();
    } else {
        document.addEventListener("DOMContentLoaded", checkAndBlock);
    }

    // Handle SPA navigation
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndBlock();
        }
    }, 500);

})();

