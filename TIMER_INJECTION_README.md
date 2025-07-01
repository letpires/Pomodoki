# Pomodoki Timer Injection Feature

This Chrome extension now includes a timer injection feature that displays a Pomodoki timer overlay on all web pages during an active Pomodoro session.

## Features

### Timer Overlay
- **Visual Timer**: A draggable timer overlay appears in the top-right corner of all web pages
- **Real-time Updates**: Shows remaining time in MM:SS format
- **Draggable**: Users can move the timer anywhere on the page
- **Closeable**: Users can close the timer with the × button
- **Visual Alerts**: Timer pulses in the last 30 seconds to alert users
- **Cross-tab Sync**: Timer appears on all open tabs and new tabs opened during the session

### Integration with Pomodoki
- **Automatic Start**: Timer injection starts when a Pomodoro session begins
- **Automatic Stop**: Timer disappears when session completes, fails, or is cancelled
- **Session Persistence**: Timer state is saved and restored across browser sessions
- **Blocked Sites**: Timer stops if user visits blocked sites (Instagram, YouTube, etc.)

## How It Works

### 1. Session Start
When a user starts a Pomodoro session in the Pomodoki extension:
- Background script saves session data to Chrome storage
- Content script is injected into all active tabs
- Timer overlay appears on all web pages

### 2. Timer Display
The timer overlay includes:
- Pomodoki branding
- Countdown timer in MM:SS format
- Close button (×)
- Draggable functionality
- Visual feedback for last 30 seconds

### 3. Session Management
- Timer syncs across all tabs
- New tabs opened during session automatically get the timer
- Session data persists if browser is closed and reopened
- Timer stops when session ends or user visits blocked sites

## Files Added/Modified

### New Files
- `public/content.js` - Content script for timer injection
- `public/timer-overlay.css` - Styles for the timer overlay
- `public/test-timer.html` - Test page for timer functionality
- `TIMER_INJECTION_README.md` - This documentation

### Modified Files
- `public/manifest.json` - Added content script and permissions
- `public/background.js` - Enhanced session management
- `pages/index.js` - Updated timer start/stop handling

## Testing

### Using the Test Page
1. Load the extension in Chrome
2. Navigate to `chrome-extension://[extension-id]/test-timer.html`
3. Use the test buttons to start/stop timers
4. Open new tabs to see timer injection in action

### Manual Testing
1. Start a Pomodoro session in the extension
2. Navigate to any website
3. Verify timer overlay appears
4. Try dragging the timer around
5. Open new tabs and verify timer appears
6. Complete or cancel session and verify timer disappears

## Technical Details

### Content Script Injection
- Runs on all URLs (`<all_urls>`)
- Injects at `document_end` for optimal timing
- Includes CSS styles for consistent appearance

### Communication
- Background script ↔ Content script via `chrome.runtime.sendMessage`
- Session data stored in `chrome.storage.local`
- Cross-tab synchronization via tab queries

### Styling
- Uses `!important` declarations to override site styles
- Includes Google Fonts for consistent typography
- Responsive design with hover effects
- High z-index to ensure visibility

## Browser Compatibility

- Chrome 88+ (Manifest V3)
- Requires `storage`, `tabs`, and `activeTab` permissions
- Content script runs on all web pages except Chrome internal pages

## Future Enhancements

Potential improvements for the timer injection feature:
- Customizable timer position and size
- Different timer styles/themes
- Sound notifications
- Integration with system notifications
- Timer statistics and analytics
- Keyboard shortcuts for timer control 