# Going to Camp Auto Click

A Tampermonkey userscript that automatically attempts to reserve campsites on Washington State Parks' "Going to Camp" website at a precise target time.

## Overview

This script helps automate the campsite reservation process by automatically clicking the "Add to Stay" button at a configured time (default: 7:00 AM PST). It includes visual status indicators, automatic retry logic, and success detection.

## Features

- ⏰ **Precise Timing**: Clicks within a configurable time window (default: 1 second before to 3 seconds after target time)
- 🎯 **Smart Clicking**: Monitors button availability and automatically retries up to 50 times
- 📊 **Live Status Display**: Shows current time, click attempts, and reservation status in a persistent banner
- 🔔 **Success Detection**: Automatically detects successful reservations and plays an alert sound
- 🔄 **React-Aware**: Handles dynamic page updates without losing functionality
- 👁️ **Visibility Monitoring**: Warns if the tab is not visible (which would affect timer accuracy)

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on the Tampermonkey icon → "Create a new script"
3. Copy the contents of `script.js` and paste it into the editor
4. Save the script (Ctrl+S or Cmd+S)

### Auto-Update

The script includes auto-update URLs that point to this repository. Once installed, Tampermonkey will automatically check for updates.

## Usage

1. **Log in** to your Going to Camp account at [washington.goingtocamp.com](https://washington.goingtocamp.com)
2. Navigate to the **reservation page** for your desired campsite
3. **Select the campsite** you want to reserve (the script will confirm your selection)
4. **Keep the browser tab visible** - the script requires the tab to be active for accurate timing
5. Wait for the script to automatically click at the configured time
6. **Complete the reservation** in your cart by 7:05 AM PST

### Important Notes

- ⚠️ Keep the browser tab **visible** at all times - hidden tabs may have throttled timers
- ⚠️ Disable computer **sleep mode** and **screen lock**
- ⚠️ Be present at your computer by 7:05 AM to complete the checkout process
- ⚠️ The script only **adds to cart** - you must manually complete the reservation

## Configuration

You can modify the configuration at the top of `script.js`:

```javascript
const CONFIG = {
    timezone: 'PST',                    // Display timezone
    timezoneId: 'America/Los_Angeles',  // IANA timezone identifier
    targetHour: 7,                      // Hour (24-hour format)
    targetMinute: 0,                    // Minute
    targetSecond: 0,                    // Second
    preFireSeconds: 1,                  // Start clicking X seconds early
    postFireSeconds: 3,                 // Continue clicking X seconds late
    maxClicks: 50,                      // Maximum click attempts
    checkInterval: 50,                  // Timer check interval (ms)
};
```

## Status Banner

The script displays a banner at the top of the page showing:

- **Campsite Selection Status**: Green border = selected, Red border = not selected
- **System Time**: Current time with milliseconds
- **Target Time**: When the script will start clicking
- **Click Attempts**: Number of clicks attempted / maximum allowed
- **Status**: Current state (WAITING, ATTEMPTING, POSSIBLY SUCCESSFUL)

## How It Works

1. **Initialization**: Waits for React to render the page content
2. **Monitoring**: Checks every 50ms if the current time is within the click window
3. **Clicking**: When in the window, clicks the "Add to Stay" button if it's enabled
4. **Success Detection**: Watches for cart navigation or success modals
5. **Alert**: Plays a sound and updates status when success is detected

## Troubleshooting

**Script not working?**
- Ensure Tampermonkey is enabled
- Check that the page URL matches: `https://washington.goingtocamp.com/create-booking/*`
- Verify the banner appears at the top of the page

**Timer not accurate?**
- Keep the browser tab visible and active
- Close other tabs/applications to reduce system load
- Check your system clock is accurate

**Button not clicking?**
- Ensure a campsite is selected (banner should be green)
- Check browser console (F12) for error messages

## Files

- `script.js` - Main Tampermonkey userscript
- `README.md` - This file

## Author

Trevor Dilley

## License

This is a personal utility script. Use at your own risk and in accordance with the Going to Camp website's terms of service.
