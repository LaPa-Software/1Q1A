var APPPAGE={
    'init':{
        'title':'Loading...',
        'body':'<div id="logo"><img src="icon.png"/><br>1 Вопрос <span class="title-colour-second">-</span><span class="title-colour"> 1 Ответ</span></div><div class="bottom-edge" id="preloader">Подключение...</div>',
        'init':function () {
            var loader = new Mprogress({
                template: 1
            });
            APP.HOOK.reg('modeChanged','init',function (mode) {
                if(mode=='OFFLINE'){document.getElementById('preloader').innerHTML='<span class="error">Не удалось установить соединение</span>'}
            },'loadInform');
            loader.start();
            loader.set(0.1);
            APP.require('js/io.js',function () {
                loader.set(0.3);
                /*APP.io({'initConnect':'true'},function (response) {
                    loader.set(0.4);
                    if(response) {
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
                        loader.end();
                        APP.mode('OFFLINE');
                    }
                });*/
            });
        }
    },
    'main':{
        'title':'LaPa Советы',
        'body':'Главный экран'
    },
    'start':{
        'title':'Добро пожаловать!',
        'body':'Описание сервиса и ссылки на регистрацию'
    }
};