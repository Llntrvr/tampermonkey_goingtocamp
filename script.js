// ==UserScript==
// @name         Going to Camp Auto Click
// @namespace    http://goingtocamp.com
// @version      2024-11-15
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

    $( document ).ready(function() {
        loadUI();
        clock();
    });


    function clickEvent()
    {
        $('button#addToStay').click();
    }

    function clock()
    {
        setInterval(function() {
            const date = new Date(new Date().toLocaleString('en', {timeZone: 'America/Los_Angeles'}));
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            if(hours == '06' && minutes <= '59')
            {
              clickEvent();
            }

            if(hours == '07' && minutes >= '02')
            {
              clickEvent();
            }

            $('#clock').html(
                'Current Time: <strong>'+hours + ":" + minutes + ":" + seconds+'</strong> <i>Pacific Standard Time</i>'
            );
        }, 500);
    }

    function loadUI(){
        $('body').prepend('<div style="padding:10px;border-bottom:5px solid #ff0000;"><strong>Please make sure to pre select the correct camsite now.</strong><p>Make sure to be on the computer by 7:10 AM <i>Pacific Standard Time</i> to complete the reservation!</p><div id="clock"></div> <div>Will Fire: <strong>6:59:00 AM</strong> - <strong>7:02:59 AM</strong> <i>Pacific Standard Time</i></div> </div>');
    }

})();
