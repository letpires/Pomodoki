let timer = null;
let startTime = null;
let duration = 1500; // default in seconds (25 min)

const blockedSites = [
  "instagram.com",
  "youtube.com",
  "tiktok.com",
  "twitter.com",
  "linkedin.com",
  "facebook.com"
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    duration = request.duration;
    startTime = Date.now();

    if (timer) clearInterval(timer);
    timer = setInterval(() => {}, 1000); // manter service worker "vivo"

    sendResponse({ status: 'started' });
    return true;
  }

  if (request.action === 'getRemaining') {
    if (!startTime) return sendResponse({ remaining: duration });

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(duration - elapsed, 0);
    sendResponse({ remaining });
    return true;
  }

  if (request.action === 'stopTimer') {
    if (timer) clearInterval(timer);
    timer = null;
    startTime = null;
    sendResponse({ status: 'stopped' });
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && startTime) {
    const openedUrl = changeInfo.url;

    for (const site of blockedSites) {
      if (openedUrl.includes(site)) {
        chrome.storage.local.set({ pomodokiStatus: "failure" });


        if (timer) clearInterval(timer);
        timer = null;
        startTime = null;
        break;
      }
    }
  }
});
