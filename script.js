// ==UserScript==
// @name         Going to Camp Auto Click
// @namespace    https://washington.goingtocamp.com
// @version      2024111309127
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
        selectCampSite();
        clock();
    });


    function clickEvent()
    {
        $('button#addToStay').click();
        console.log('Click');
    }

    function getCamSiteId()
    {
        var rawvalue = '0';
        if( $('button#addToStay').length )
        {
            rawvalue = $('h2#resourceName').text();
        }
        return rawvalue.replace(/\D/g, "");
    }

    function selectCampSite()
    {
        const campsiteid = getCamSiteId();

        if( $('button#addToStay').length )
        {
            $('div#pleaseselect').html(
                '<strong style="color:#89CFF0;">Campsite #'+campsiteid+' has been selected!</strong>'
            );
        } else {
            $('div#pleaseselect').html(
                '<strong style="color:#ff0000;">Please make sure to pre select the correct campsite now!</strong>'
            );
        }
    }


    function clock()
    {
        setInterval(function() {
            const date = new Date(new Date().toLocaleString('en', {timeZone: 'America/Los_Angeles'}));
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const match = match = hours+minutes+seconds;

            console.log('Current Time: '+hours + ":" + minutes + ":" + seconds);

            if(match >= '065900' && match <= '070059')
            {
                clickEvent();
            }

            $('span#clock').html(
                '<strong>'+hours + ":" + minutes + ":" + seconds+'</strong> <i>Pacific Standard Time</i>'
            );

            selectCampSite();
        }, 1000);
    }



    function loadUI(){
        $('body').prepend('<div style="padding:10px;border-bottom:5px solid #ff0000;"><div id="pleaseselect" style="font-size:30px;font-weight:bold;text-align:center;"></div><div id="notice">Make sure to be on the computer by 7:10 AM <i>Pacific Standard Time</i> to complete the reservation! <br> Current Time: <span id="clock">00:00:00 AM</span> <br> Will Fire: <strong>6:59:00 AM</strong> - <strong>7:00:59 AM</strong> <i>Pacific Standard Time</i></div> </div>');
    }

})();
