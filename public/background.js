let timer = null;
let startTime = null;
let duration = 1500; // default in seconds (25 min)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    duration = request.duration;
    startTime = Date.now();

    // Apenas mantemos o background ativo, pode ser vazio
    if (timer) clearInterval(timer);
    timer = setInterval(() => {}, 1000);

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
});
