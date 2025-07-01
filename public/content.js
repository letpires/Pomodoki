// Pomodoki Timer Content Script
let timerOverlay = null;
let timerInterval = null;
let sessionData = null;

// Inject CSS styles
function injectStyles() {
  if (document.getElementById('pomodoki-styles')) return;
  
  const link = document.createElement('link');
  link.id = 'pomodoki-styles';
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('timer-overlay.css');
  document.head.appendChild(link);
}

// Create the timer overlay
function createTimerOverlay() {
  if (timerOverlay) return;

  // Inject styles first
  injectStyles();

  timerOverlay = document.createElement('div');
  timerOverlay.id = 'pomodoki-timer-overlay';

  const timerText = document.createElement('div');
  timerText.id = 'pomodoki-timer-text';
  timerText.style.cssText = `
    font-size: 14px;
    color: #5c4435;
    text-align: center;
    line-height: 1.2;
  `;

  const closeButton = document.createElement('div');
  closeButton.innerHTML = '×';
  closeButton.className = 'close-button';

  closeButton.addEventListener('click', () => {
    hideTimerOverlay();
  });

  timerOverlay.appendChild(timerText);
  timerOverlay.appendChild(closeButton);
  document.body.appendChild(timerOverlay);

  // Make overlay draggable
  makeDraggable(timerOverlay);
}

// Make the overlay draggable
function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  element.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.tagName === 'DIV' && e.target.innerHTML === '×') return;
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === element) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, element);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }
}

// Show the timer overlay
function showTimerOverlay() {
  if (!timerOverlay) {
    createTimerOverlay();
  }
  timerOverlay.style.display = 'flex';
}

// Hide the timer overlay
function hideTimerOverlay() {
  if (timerOverlay) {
    timerOverlay.style.display = 'none';
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Update timer display
function updateTimer() {
  if (!sessionData || !timerOverlay) return;

  const now = Date.now();
  const elapsed = Math.floor((now - sessionData.startTime) / 1000);
  const remaining = sessionData.duration - elapsed;

  if (remaining <= 0) {
    hideTimerOverlay();
    return;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const timerText = document.getElementById('pomodoki-timer-text');
  if (timerText) {
    timerText.innerHTML = `
      <div style="font-size: 10px; margin-bottom: 4px;">POMODOKI</div>
      <div style="font-size: 16px; font-weight: bold;">${timeString}</div>
    `;
  }

  // Add visual feedback for last 30 seconds
  if (remaining <= 30 && remaining > 0) {
    timerOverlay.classList.add('completing');
  } else {
    timerOverlay.classList.remove('completing');
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    sessionData = {
      startTime: Date.now(),
      duration: request.duration * 60 // Convert minutes to seconds
    };
    
    showTimerOverlay();
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Update immediately
    
    sendResponse({ status: 'timer started' });
  }
  
  if (request.action === 'stopTimer') {
    hideTimerOverlay();
    sessionData = null;
    sendResponse({ status: 'timer stopped' });
  }
  
  if (request.action === 'getTimerStatus') {
    sendResponse({ 
      hasTimer: !!timerOverlay && timerOverlay.style.display !== 'none',
      sessionData: sessionData
    });
  }
});

// Check if there's an active session when the page loads
chrome.storage.local.get(['pomodokiSession'], (result) => {
  if (result.pomodokiSession) {
    const session = result.pomodokiSession;
    const now = Date.now();
    const elapsed = Math.floor((now - session.startTime) / 1000);
    const remaining = session.duration - elapsed;
    
    if (remaining > 0) {
      sessionData = {
        startTime: session.startTime,
        duration: session.duration
      };
      
      showTimerOverlay();
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    }
  }
}); 