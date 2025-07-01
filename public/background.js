let timer = null;
let startTime = null; 

const blockedSites = [
  "instagram.com",
  "youtube.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "facebook.com"
];



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') { 
    startTime = Date.now();

    if (timer) clearInterval(timer);
    timer = setInterval(() => {}, 1000); // manter service worker "vivo"

    sendResponse({ status: 'started' });
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
  if ((changeInfo.url || tab.url) && startTime) {
    const openedUrl = changeInfo.url ?? tab.url;

    console.log("New page opened/changed", openedUrl);

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
