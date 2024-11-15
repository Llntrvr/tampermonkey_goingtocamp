// ==UserScript==
// @name         Going to Camp Auto Click
// @namespace    https://washington.goingtocamp.com
// @version      20241115340
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

    const timezone = 'PST';

    $( document ).ready(function() {
        visibilityCheck();
        loadUI();
        clock();
        selectCampSite();
    });

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
        $('button#addToStay').click();
        console.log('Trying to reserve campsite #'+getCamSiteId());
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

    function clock()
    {
        setInterval(function() {
            let date = new Date(new Date().toLocaleString('en', {timeZone: 'America/Los_Angeles'}));
            //date = addSeconds(date, 1);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const match = hours+minutes+seconds;

            console.log('Current Time: '+hours + ":" + minutes + ":" + seconds);

            $('span#clock').html(
                '<strong>'+hours + ":" + minutes + ":" + seconds+'</strong> <i>'+timezone+'</i>'
            );

            if(match == '070000')
            {
                clickEvent();
            }
        }, 1000);
    }

    function addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    function loadUI(){
        $('body').prepend('<div id="topbanner" style="padding:10px;border-bottom:5px solid #ff0000;"><div id="pleaseselect" style="font-size:30px;font-weight:bold;text-align:center;"></div><div id="notice"><ol><li>Make sure you are logged into your <a href="/login" target="_blank">account</a>.</li><li id="visiblecheck">Make sure this tab / window is visible at all times or the timmer will not work.</li><li>Make sure to disable any windows/mac computer sleep mode / lock screen.</li><li>Make sure to be on the computer by 7:05 AM <i>'+timezone+'</i> to complete the <a href="/cart" target="_blank">reservation</a>.</li></ol> <ul><li> System Time: <span id="clock">00:00:00 AM</span>.</li> <li>Will Fire At: <strong>7:00:00 AM</strong> <i>'+timezone+'</i>.</li></ul></div> </div>');
    }

})();
