let timer = null;
let startTime = null;
let sessionDuration = null;

const blockedSites = [
  "instagram.com",
  "youtube.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "facebook.com",
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTimer") {
    startTime = Date.now();
    sessionDuration = request.duration * 60; // Convert minutes to seconds

    // Save session data to storage
    chrome.storage.local.set({
      pomodokiSession: {
        startTime: startTime,
        duration: sessionDuration,
        avatar: request.avatar,
      },
    });

    if (timer) clearInterval(timer);
    timer = setInterval(() => {}, 1000); // manter service worker "vivo"

    // Inject timer into all active tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (
          tab.url &&
          !tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("chrome-extension://")
        ) {
          chrome.tabs
            .sendMessage(tab.id, {
              action: "startTimer",
              duration: request.duration,
              avatar: request.avatar,
            })
            .catch(() => {
              // Content script might not be loaded yet, ignore errors
            });
        }
      });
    });

    sendResponse({ status: "started" });
    return true;
  }

  if (request.action === "stopTimer") {
    if (timer) clearInterval(timer);
    timer = null;
    startTime = null;
    sessionDuration = null;

    // Clear session data from storage
    chrome.storage.local.remove("pomodokiSession");

    // Stop timer in all active tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (
          tab.url &&
          !tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("chrome-extension://")
        ) {
          chrome.tabs
            .sendMessage(tab.id, {
              action: "stopTimer",
            })
            .catch(() => {
              // Content script might not be loaded yet, ignore errors
            });
        }
      });
    });

    sendResponse({ status: "stopped" });
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ((changeInfo.url || tab.url) && startTime) {
    const openedUrl = changeInfo.url ?? tab.url;

    console.error("New page opened/changed", openedUrl);

    for (const site of blockedSites) {
      if (openedUrl.includes(site)) {
        console.error(
          "Blocked site opened",
          openedUrl,
          "stopping timer",
          site,
          tabId
        ); 
        // Save failure data including tab information
        chrome.storage.local.get(['pomodokiFailureData'], (result) => {
          const failures = result.pomodokiFailureData || [];
          failures.push({
            timestamp: Date.now(),
            blockedSite: site,
            openedUrl: openedUrl,
            tabId: tabId,
            tabData: tab
          });
          
          chrome.storage.local.set({
            pomodokiStatus: "failure", 
            pomodokiFailureData: failures
          });
        });

        if (timer) clearInterval(timer);
        timer = null;
        startTime = null;
        sessionDuration = null;

        // Clear session data from storage
        chrome.storage.local.remove("pomodokiSession");

        // Stop timer in all active tabs
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (
              tab.url &&
              !tab.url.startsWith("chrome://") &&
              !tab.url.startsWith("chrome-extension://")
            ) {
              chrome.tabs
                .sendMessage(tab.id, {
                  action: "stopTimer",
                })
                .catch(() => {
                  // Content script might not be loaded yet, ignore errors
                });
            }
          });
        });
        break;
      }
    }
  }
});

// Inject timer into new tabs when they're created during an active session
chrome.tabs.onCreated.addListener((tab) => {
  if (startTime && sessionDuration) {
    // Wait a bit for the page to load
    setTimeout(() => {
      if (
        tab.url &&
        !tab.url.startsWith("chrome://") &&
        !tab.url.startsWith("chrome-extension://")
      ) {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "startTimer",
            duration: sessionDuration / 60, // Convert back to minutes
          })
          .catch(() => {
            // Content script might not be loaded yet, ignore errors
          });
      }
    }, 1000);
  }
});
