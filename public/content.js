// Pomodoki Timer Content Script
let timerOverlay = null;
let timerInterval = null;
let sessionData = null;
let currentAvatar = null;
let animationId = null;

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

  // Create avatar image element
  const avatarImg = document.createElement('img');
  avatarImg.id = 'pomodoki-avatar';
  avatarImg.style.cssText = `
    width: 32px;
    height: 32px;
    object-fit: cover;
    image-rendering: pixelated;
    margin-bottom: 4px;
    border-radius: 4px;
  `;

  const closeButton = document.createElement('div');
  closeButton.innerHTML = '×';
  closeButton.className = 'close-button';

  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked - stopping timer');
    // Notify background script to stop the timer completely
    chrome.runtime.sendMessage({ action: 'stopTimer' });
    removeTimerOverlay();
  });

  timerOverlay.appendChild(avatarImg);
  timerOverlay.appendChild(timerText);
  timerOverlay.appendChild(closeButton);
  document.body.appendChild(timerOverlay);

  // Make overlay draggable
  // makeDraggable(timerOverlay);
}

// Make the overlay draggable
function makeDraggable(element) {
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let elementStartX = 0;
  let elementStartY = 0;
  
  // Use requestAnimationFrame for smooth dragging
  animationId = null;

  const dragStart = (e) => {
    if (e.target.tagName === 'DIV' && e.target.innerHTML === '×') return;
    
    if (e.target === element || e.target.closest('#pomodoki-timer-overlay')) {
      isDragging = true;
      
      // Store the initial mouse position
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      
      // Store the current element position
      const transform = element.style.transform;
      const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        elementStartX = parseFloat(match[1]);
        elementStartY = parseFloat(match[2]);
      } else {
        elementStartX = 0;
        elementStartY = 0;
      }
      
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    }
  };

  const drag = (e) => {
    if (isDragging) {
      e.preventDefault();
      
      // Calculate new position based on mouse movement
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      const newX = elementStartX + deltaX;
      const newY = elementStartY + deltaY;

      // Use requestAnimationFrame for smooth updates
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      animationId = requestAnimationFrame(() => {
        element.style.transform = `translate(${newX}px, ${newY}px)`;
      });
    }
  };

  const dragEnd = () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
      element.style.userSelect = 'auto';
      
      // Update the element's starting position for the next drag
      const transform = element.style.transform;
      const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        elementStartX = parseFloat(match[1]);
        elementStartY = parseFloat(match[2]);
      }
      
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
  };

  // Add event listeners
  element.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
  
  // Set initial cursor style
  element.style.cursor = 'grab';
  
  // Store cleanup function on the element
  element._cleanupDrag = () => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
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
  // Clear session data locally
  sessionData = null;
  currentAvatar = null;
}

// Completely remove the timer overlay
function removeTimerOverlay() {
  console.log('Removing timer overlay');
  if (timerOverlay) {
    // Clean up drag event listeners
    if (timerOverlay._cleanupDrag) {
      timerOverlay._cleanupDrag();
    }
    timerOverlay.remove();
    timerOverlay = null;
    console.log('Timer overlay removed from DOM');
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    console.log('Timer interval cleared');
  }
  sessionData = null;
  currentAvatar = null;
  console.log('Session data cleared');
}

// Update timer display
function updateTimer() {
  if (!sessionData || !timerOverlay) return;

  const now = Date.now();
  const elapsed = Math.floor((now - sessionData.startTime) / 1000);
  const remaining = sessionData.duration - elapsed;

  if (remaining <= 0) {
    removeTimerOverlay();
    return;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const timerText = document.getElementById('pomodoki-timer-text');
  if (timerText) {
    timerText.innerHTML = ` 
      <div style="font-size: 16px; font-weight: bold;">${timeString}</div>
    `;
  }

  // Update avatar if available
  const avatarImg = document.getElementById('pomodoki-avatar');
  if (avatarImg && currentAvatar && !avatarImg.src) {
    const avatarImages = {
      tomash: chrome.runtime.getURL('/images/tomash_session.png'),
      bubbiberry: chrome.runtime.getURL('/images/bubbi_session.png'), 
      batatack: chrome.runtime.getURL('/images/batatack_session.png')
    };
    
    if (avatarImages[currentAvatar]) {
      avatarImg.src = avatarImages[currentAvatar];
      avatarImg.alt = currentAvatar;
    }
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
    
    currentAvatar = request.avatar;
    
    showTimerOverlay();
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Update immediately
    
    sendResponse({ status: 'timer started' });
  }
  
  if (request.action === 'stopTimer') {
    removeTimerOverlay();
    sendResponse({ status: 'timer stopped' });
  }
  
  if (request.action === 'getTimerStatus') {
    sendResponse({ 
      hasTimer: !!timerOverlay && timerOverlay.style.display !== 'none',
      sessionData: sessionData,
      avatar: currentAvatar
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
      
      currentAvatar = session.avatar;
      
      showTimerOverlay();
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    }
  }
}); 