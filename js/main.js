;(function() {
    'use strict';
    //if(window.APP)return;
    var CONF;
    var PAGE;
    var mode;
    window.APP={};
    APP.LIB={};
    var HOOK={};
    var activeHooks={};
    var HISTORY=[];
    function regHook(trigger,page,func,id){
        id=id||Object.keys(HOOK).length;
        page=page||false;
        HOOK[id]={'trigger':trigger,'page':page,'func':func};
        if(activeHooks[trigger])callHook(trigger,false,false,id);
    }
    function callHook(trigger,page,termless,id,param) {
        if(termless)activeHooks[trigger]=true;
        if(id){
            HOOK[id].func(param||null);
            return;
        }
        var keyHook=Object.keys(HOOK);
        for (var i in keyHook){
            if(page){
                if(HOOK[keyHook[i]].page==false||(page!=HOOK[keyHook[i]].page)){
                    continue;
                }
            }
            HOOK[keyHook[i]].func(param||null);
        }
    }
    APP.HOOK={
        'reg':regHook,
        'call':callHook,
        'list':function () {
            return Object.keys(HOOK);
        }
    };
    var setMode = APP.mode = function (mode) {
        callHook('modeChanged',APP.thisPage,false,false,mode);
    };
    function getPage(id) {

    }
    function renderPage(id) {
        if(APP.thisPage&&APP.PAGE[APP.thisPage].unload)try{APP.PAGE[APP.thisPage].unload();}catch(e){console.log('Error while unload page: '+APP.thisPage);throw e}

        document.body.innerHTML='<div>'+APP.PAGE[id].body+'</div>';
        if(APP.CONF.backButton&&!APP.PAGE[id].hideHistory)document.body.innerHTML+='<button id="backButton" onclick="APP.back()">Назад</button>';
        window.title=APP.PAGE[id].title||CONF.title;
        if(APP.PAGE[id].init)try{APP.PAGE[id].init();}catch(e){console.log('Error while initialising page: '+id);throw e}
        APP.pageState='ready';
        if(!APP.PAGE[id].hideHistory)HISTORY[HISTORY.length]=id;
        APP.thisPage=id;
        APP.targetPage=false;
    }
    var page = APP.page = function (id,resetHistory) {
        if(APP.targetPage)return;
        APP.targetPage=id;
        if(!APP.PAGE[id]) {
            getPage(id);
            return;
        }
        if(resetHistory)HISTORY=[];
        renderPage(id);
    };
    var execLib = APP.execLib = function (id) {
        eval(APP.LIB[id]);
    };
    var require = APP.require = function (path,onComplete) {
        if(APP.LIB[path]){if(onComplete)onComplete();return true;}
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path+'?rnd='+new Date().getTime(), true);
        xhr.responseType = 'text';
        xhr.onload = function(e) {
            if (this.status == 200) {
                APP.LIB[path]=this.response;
                APP.execLib(path);
                if(onComplete)onComplete();
            }
        };
        xhr.send();
    };
    var message = APP.message = function (text,popup) {
        if(!document.getElementById('message'))popup=true;
        if(popup){alert(text)}else{document.getElementById('message').innerHTML=text;}
    };
    var getLocation = APP.getLocation = function (forceLoad) {
        if(!navigator.geolocation)return false;
        if (!forceLoad&&CONF.location) {
            return CONF.location;
        } else {
            document.getElementById('local_indicator').innerHTML='<img src="img/loader.svg"/>';
            navigator.geolocation.getCurrentPosition(function (position) {
                CONF.location={'lat': position.coords.latitude, 'long': position.coords.longitude}
                document.getElementById('local_indicator').innerHTML='';
            });
            return false;
        }
    };
    var init = function () {
        APP.CONF=CONF=window.APPCONF||(localStorage.getItem('CONF')?JSON.parse(localStorage.getItem('CONF')):{});
        APP.PAGE=PAGE=window.APPPAGE||{};
        APP.HISTORY=HISTORY;
        callHook('PreInit',false,true);
        if(!APP.thisPage)APP.page(APP.CONF.initPage);
    };
     var back = APP.back = function() {
         HISTORY.splice(-1, 1);
         if(HISTORY.length>0) {
             page(HISTORY[HISTORY.length-1]);
         }else{
             if(APP.CONF.account.id) {
                 page('main');
             }else{
                 page('start');
             }
         }
    };
    document.addEventListener("backbutton", back, true);
    addEventListener('load',init);
})();