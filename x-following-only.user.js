// ==UserScript==
// @name         X (Twitter) - Following only + hide tabs + recent
// @namespace    ruan/x-following-only
// @version      1.1
// @description  Forces Following + Recent and hides For You + Following tabs UI on X.com
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const DEBUG = false;

  function log(...args) {
    if (DEBUG) console.log("[X Following Only]", ...args);
  }

  function isHome() {
    return location.pathname === "/home";
  }

  // Force chronological/recent Following: /home?f=live
  function forceRecent() {
    if (!isHome()) return;

    const url = new URL(location.href);
    if (url.searchParams.get("f") !== "live") {
      url.searchParams.set("f", "live");
      log("Redirecting to recent Following:", url.toString());
      location.replace(url.toString());
    }
  }

  function getTablist() {
    return document.querySelector('[role="tablist"]');
  }

  function getTabs() {
    const tablist = getTablist();
    if (!tablist) return [];
    return Array.from(tablist.querySelectorAll('[role="tab"]'));
  }

  function findTabByText(text) {
    const tabs = getTabs();
    const t = text.toLowerCase();
    return tabs.find(tab => (tab.innerText || "").trim().toLowerCase() === t);
  }

  function hideTab(text) {
    const tab = findTabByText(text);
    if (tab && tab.style.display !== "none") {
      tab.style.display = "none";
      tab.style.pointerEvents = "none";
      log("Hid tab:", text);
    }
  }

  function clickFollowing() {
    if (!isHome()) return false;

    const following = findTabByText("Following");
    if (!following) return false;

    const selected = following.getAttribute("aria-selected") === "true";
    if (!selected) {
      following.click();
      log("Clicked Following tab");
      return true;
    }
    return false;
  }

  function hideWholeTabBar() {
    const tablist = getTablist();
    if (tablist && tablist.style.display !== "none") {
      tablist.style.display = "none";
      tablist.style.height = "0";
      tablist.style.pointerEvents = "none";
      log("Hid entire tab bar");
    }
  }

  function enforce() {
    if (!isHome()) return;

    // 1) Always keep Recent Following
    forceRecent();

    // 2) Keep forcing Following selected (sometimes X flips back)
    clickFollowing();

    // 3) Hide both tabs (your requested behavior)
    hideTab("For you");
    hideTab("Following");

    // Optional: hide the entire bar so spacing/click area is gone
    hideWholeTabBar();
  }

  // Initial run
  enforce();

  // Re-run periodically because X re-renders aggressively
  const interval = setInterval(enforce, 800);

  // Also observe DOM mutations for faster reaction
  const obs = new MutationObserver(enforce);

  obs.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("beforeunload", () => {
    clearInterval(interval);
    obs.disconnect();
  });
})();

