var APPPAGE={
    'init':{
        'title':'Loading...',
        'hideHistory':true,
        'body':'<div id="logo"><img src="icon.png"/><br>1 Вопрос <span class="title-colour-second">-</span><span class="title-colour"> 1 Ответ</span></div><div class="bottom-edge" id="preloader">Подключение...</div>',
        'init':function () {
            var loader = new Mprogress({
                template: 1
            });
            APP.HOOK.reg('modeChanged','init',function (mode) {
                if(mode=='OFFLINE'){document.getElementById('preloader').innerHTML='<span class="error">Не удалось установить соединение</span><br><button onclick="location.replace(\'https://lapa.ndhost.ru/1Q1A/WEB\');">Загрузить Web версию</button>'}
            },'loadInform');
            loader.start();
            loader.set(0.1);
            //alert('loading IO.js ...');
            APP.require('js/io.js',function () {
                loader.set(0.3);
                //alert('IO.js loaded');
                APP.io({'initConnect':'true'},function (response) {
                    loader.set(0.4);
                    if(response) {
                        //alert('initConnect finished');
                        APP.require('js/user.js',function () {
                            loader.set(0.7);
                            APP.io({'syncUserData': APP.CONF.account.token || false}, function (response) {
                                loader.set(0.9);
                                if (response) {
                                    if(APP.fetchAccount(response)){
                                        loader.end();
                                        APP.page('main');
                                    }else{
                                        loader.end();
                                        APP.page('start');
                                    }
                                }
                            });
                        });
                    }else{
                        //alert('error while initConnect');
                        loader.end();
                        APP.mode('OFFLINE');
                    }
                });
            });
        }
    },
    'main':{
        'title':'LaPa Советы',
        'body':'Главный экран'
    },
    'start':{
        'hideHistory':true,
        'title':'Добро пожаловать!',
        'body':'<div id="logo"><img src="icon.png"/><br>1 Вопрос <span class="title-colour-second">-</span><span class="title-colour"> 1 Ответ</span></div><div class="buttons-block bottom-edge-block"><button id="auth" onclick="APP.page(\'auth\');">Авторизация</button><br><button id="reg" onclick="APP.page(\'reg\');">Регистрация</button></div>'
    },
    'auth':{
        'title':'Авторизация',
        'body':'Авторизация'
    },
    'reg':{
        'title':'Регистрация',
        'body':'Регистрация'
    }
};