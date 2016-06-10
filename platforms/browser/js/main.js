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
        document.body.innerHTML=APP.PAGE[id].body;
        window.title=APP.PAGE[id].title||CONF.title;
        if(APP.PAGE[id].init)try{APP.PAGE[id].init();}catch(e){console.log('Error while initialising page: '+id);throw e}
        APP.pageState='ready';
        APP.targetPage=false;
    }
    var page = APP.page = function (id) {
        if(APP.targetPage)return;
        APP.targetPage=id;
        if(!APP.PAGE[id]) {
            getPage(id);
            return;
        }
        renderPage(id);
        APP.thisPage=id;
    };
    var execLib = APP.execLib = function (id) {
        eval(APP.LIB[id]);
    };
    var require = APP.require = function (path,onComplete) {
        if(APP.LIB[path]){if(onComplete)onComplete();return true;}
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
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
    var init = function () {
        APP.CONF=window.APPCONF||(localStorage.getItem('CONF')?JSON.parse(localStorage.getItem('CONF')):{});
        APP.PAGE=window.APPPAGE||{};
        callHook('PreInit',false,true);
        if(!APP.thisPage)APP.page(APP.CONF.initPage);
    };
    addEventListener('load',init);

})();