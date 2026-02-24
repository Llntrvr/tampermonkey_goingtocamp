// ==UserScript==
// @name         Going to Camp Auto Click
// @namespace    https://washington.goingtocamp.com
// @version      20260224.1
// @description  Try to auto reserve campsites
// @author       Trevor Dilley
// @match        https://washington.goingtocamp.com/create-booking/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @updateURL    https://raw.githubusercontent.com/llntrvr/tampermonkey_goingtocamp/refs/heads/master/script.js
// @downloadURL  https://raw.githubusercontent.com/llntrvr/tampermonkey_goingtocamp/refs/heads/master/script.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        timezone: 'PST',
        timezoneId: 'America/Los_Angeles',
        targetHour: 7,
        targetMinute: 0,
        targetSecond: 0,
        // How many seconds before target to start clicking (to account for latency)
        preFireSeconds: 1,
        // How many seconds after target to keep clicking
        postFireSeconds: 3,
        // Maximum click attempts
        maxClicks: 50,
        // Interval for clock/click checking (ms) - lower = more precise
        checkInterval: 50,
    };

    let clickCount = 0;
    let reservationAttempted = false;
    let reservationSuccess = false;
    let uiInitialized = false;

    $( document ).ready(function() {
        waitForReactAndInit();
    });

    function waitForReactAndInit()
    {
        // Wait for React to render initial content before injecting UI
        const checkReady = setInterval(() => {
            // Look for signs that React has rendered (adjust selector if needed)
            const reactRoot = document.querySelector('#root') || document.querySelector('[data-reactroot]') || document.querySelector('.App');
            const hasContent = reactRoot && reactRoot.children.length > 0;
            
            // Also check if body has substantial content
            const bodyReady = document.body && document.body.children.length > 1;
            
            if (hasContent || bodyReady) {
                clearInterval(checkReady);
                console.log('React appears ready, initializing script...');
                initializeScript();
            }
        }, 100);

        // Fallback: initialize after 3 seconds regardless
        setTimeout(() => {
            if (!uiInitialized) {
                console.log('Fallback initialization after timeout');
                initializeScript();
            }
        }, 3000);
    }

    function initializeScript()
    {
        if (uiInitialized) return;
        uiInitialized = true;

        visibilityCheck();
        ensureUI();
        clock();
        selectCampSite();
        watchForSuccess();
        watchForUIRemoval();
    }

    function watchForUIRemoval()
    {
        // Periodically check if our UI was removed by React re-render
        setInterval(() => {
            if ($('#topbanner').length === 0) {
                console.log('UI was removed, re-injecting...');
                injectUI();
            }
        }, 500);

        // Also use MutationObserver for faster detection
        const observer = new MutationObserver((mutations) => {
            if ($('#topbanner').length === 0) {
                console.log('UI removed detected via observer, re-injecting...');
                injectUI();
            }
        });
        observer.observe(document.body, { childList: true, subtree: false });
    }

    function ensureUI()
    {
        if ($('#topbanner').length === 0) {
            injectUI();
        }
    }

    function visibilityCheck()
    {
        document.addEventListener('visibilitychange', () => {
            if ( document.visibilityState === 'visible' ) {
                console.log('Visible');
                $('li#visiblecheck').css('color', '#000000').css('font-weight', 'normal');
            } else {
                console.log('Invisible');
                $('li#visiblecheck').css('color', '#ff0000').css('font-weight', 'bold');
            }
        });
    }

    function clickEvent()
    {
        if (clickCount >= CONFIG.maxClicks) {
            return false;
        }

        const button = $('button#addToStay');
        if (button.length && !button.prop('disabled')) {
            button.click();
            clickCount++;
            reservationAttempted = true;
            console.log(`Click attempt #${clickCount} for campsite #${getCamSiteId()}`);
            updateClickStatus();
            return true;
        }
        return false;
    }

    function updateClickStatus()
    {
        ensureUI();
        $('span#clickcount').html(`<strong>${clickCount}</strong>`);
        if (reservationAttempted) {
            $('span#status').html('<strong style="color:#ff8c00;">ATTEMPTING...</strong>');
        }
    }

    function getCamSiteId()
    {
        let rawvalue = '0';
        if( $('button#addToStay').length )
        {
            rawvalue = $('h2#resourceName').text();
        }
        return rawvalue.replace(/\D/g, "");
    }

    function selectCampSite()
    {
        setInterval(function() {
            ensureUI();
            if( $('button#addToStay').length )
            {
                $('div#pleaseselect').html(
                    '<strong style="color:#1a5632;">Campsite #'+getCamSiteId()+' has been selected!</strong>'
                );
                $('div#topbanner').css('border-bottom', '20px solid #1a5632');
            } else {
                $('div#pleaseselect').html(
                    '<strong style="color:#ff0000;">Please select the correct campsite below!</strong>'
                );
                $('div#topbanner').css('border-bottom', '20px solid #ff0000');
            }
        }, 100);
    }

    function getTargetTime()
    {
        const targetHHMMSS = 
            CONFIG.targetHour.toString().padStart(2, '0') +
            CONFIG.targetMinute.toString().padStart(2, '0') +
            CONFIG.targetSecond.toString().padStart(2, '0');
        return targetHHMMSS;
    }

    function isInClickWindow(hours, minutes, seconds)
    {
        const now = hours * 3600 + minutes * 60 + seconds;
        const target = CONFIG.targetHour * 3600 + CONFIG.targetMinute * 60 + CONFIG.targetSecond;
        const windowStart = target - CONFIG.preFireSeconds;
        const windowEnd = target + CONFIG.postFireSeconds;

        return now >= windowStart && now <= windowEnd;
    }

    function clock()
    {
        setInterval(function() {
            let date = new Date(new Date().toLocaleString('en', {timeZone: CONFIG.timezoneId}));
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const milliseconds = date.getMilliseconds();

            const hoursStr = hours.toString().padStart(2, '0');
            const minutesStr = minutes.toString().padStart(2, '0');
            const secondsStr = seconds.toString().padStart(2, '0');
            const millisecondsStr = milliseconds.toString().padStart(3, '0');

            $('span#clock').html(
                '<strong>'+hoursStr + ":" + minutesStr + ":" + secondsStr+'.'+millisecondsStr+'</strong> <i>'+CONFIG.timezone+'</i>'
            );

            // Check if we're in the click window
            if (isInClickWindow(hours, minutes, seconds) && !reservationSuccess) {
                clickEvent();
            }
        }, CONFIG.checkInterval);
    }

    function watchForSuccess()
    {
        // Watch for page changes that indicate success
        const observer = new MutationObserver((mutations) => {
            // Check for common success indicators
            if ($('.modal-content:contains("added")').length ||
                $('.modal-content:contains("cart")').length ||
                $('.alert-success').length ||
                $('button#addToStay').length === 0 && reservationAttempted) {
                
                if (!reservationSuccess) {
                    reservationSuccess = true;
                    console.log('Reservation may have succeeded!');
                    ensureUI();
                    $('span#status').html('<strong style="color:#1a5632;">POSSIBLY SUCCESSFUL - CHECK CART!</strong>');
                    $('div#topbanner').css('background-color', '#90EE90');
                    // Play a sound to alert the user
                    playSuccessSound();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Also check for URL changes to cart
        setInterval(() => {
            if (window.location.href.includes('/cart') && reservationAttempted && !reservationSuccess) {
                reservationSuccess = true;
                console.log('Redirected to cart - reservation likely succeeded!');
            }
        }, 500);
    }

    function playSuccessSound()
    {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Could not play success sound:', e);
        }
    }

    function formatTargetTime()
    {
        const hour = CONFIG.targetHour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${CONFIG.targetMinute.toString().padStart(2, '0')}:${CONFIG.targetSecond.toString().padStart(2, '0')} ${ampm}`;
    }

    function injectUI(){
        const targetTime = formatTargetTime();
        const windowInfo = `(${CONFIG.preFireSeconds}s early to ${CONFIG.postFireSeconds}s late)`;
        
        $('body').prepend(`
            <div id="topbanner" style="padding:10px;border-bottom:5px solid #ff0000;position:sticky;top:0;z-index:9999;background-color:#ffffff;">
                <div id="pleaseselect" style="font-size:30px;font-weight:bold;text-align:center;"></div>
                <div id="notice">
                    <ol>
                        <li>Make sure you are logged into your <a href="/login" target="_blank">account</a>.</li>
                        <li id="visiblecheck">Make sure this tab / window is visible at all times or the timer will not work.</li>
                        <li>Make sure to disable any windows/mac computer sleep mode / lock screen.</li>
                        <li>Make sure to be on the computer by 7:05 AM <i>${CONFIG.timezone}</i> to complete the <a href="/cart" target="_blank">reservation</a>.</li>
                    </ol>
                    <ul>
                        <li>System Time: <span id="clock">00:00:00.000</span></li>
                        <li>Will Fire At: <strong>${targetTime}</strong> <i>${CONFIG.timezone}</i> ${windowInfo}</li>
                        <li>Click Attempts: <span id="clickcount">0</span> / ${CONFIG.maxClicks}</li>
                        <li>Status: <span id="status"><strong>WAITING</strong></span></li>
                    </ul>
                </div>
            </div>
        `);
    }

})();
