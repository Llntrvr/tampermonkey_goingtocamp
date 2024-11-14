// ==UserScript==
// @name         Going to Camp Auto Click
// @namespace    https://washington.goingtocamp.com
// @version      202411140954
// @description  Try to auto reserve campsites
// @author       Trevor Dilley
// @match        https://washington.goingtocamp.com/create-booking/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://raw.githubusercontent.com/Llntrvr/tampermonkey_goingtocamp/refs/heads/master/HackTimer.silent.min.js
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
        if( $('button#addToStay').length )
        {
            $('div#pleaseselect').html(
                '<strong style="color:#1a5632;">Campsite #'+getCamSiteId()+' has been selected!</strong>'
            );
            $('div#topbanner').css('border-bottom', '5px solid #1a5632');
        } else {
            $('div#pleaseselect').html(
                '<strong style="color:#ff0000;">Please make sure to select the correct campsite below now!</strong>'
            );
            $('div#topbanner').css('border-bottom', '5px solid #ff0000');
        }
    }


    function clock()
    {
        setInterval(function() {
            const date = new Date(new Date().toLocaleString('en', {timeZone: 'America/Los_Angeles'}));
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const match = hours+minutes+seconds;

            console.log('Current Time: '+hours + ":" + minutes + ":" + seconds);

            if(match >= '065959' && match <= '070001')
            {
                clickEvent();
            }

            $('span#clock').html(
                '<strong>'+hours + ":" + minutes + ":" + seconds+'</strong> <i>PST</i>'
            );

            selectCampSite();
        }, 1000);
    }



    function loadUI(){
        $('body').prepend('<div id="topbanner" style="padding:10px;border-bottom:5px solid #ff0000;"><div id="pleaseselect" style="font-size:30px;font-weight:bold;text-align:center;"></div><div id="notice"><ol><li>Make sure to disable any windows/mac computer sleep mode / lock screen.</li><li>Make sure to disable <strong>Calculate window occlusion on Windows</strong> in <i>chrome://flags/#calculate-native-win-occlusion</i></li><li>Make sure to be on the computer by 7:10 AM <i>PST</i> to complete the <a href="/cart" target="_blank">reservation</a>!</li></ol> <ul><li> System Time: <span id="clock">00:00:00 AM</span></li> <li>Will Fire: <strong>6:59:59 AM</strong> - <strong>7:00:01 AM</strong> <i>PST</i></li></ul></div> </div>');
    }

})();
