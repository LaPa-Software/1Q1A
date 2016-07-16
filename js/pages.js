var APPPAGE={
    'init':{
        'title':'Loading...',
        'hideHistory':true,
        'body':'<div id="logo"><img src="img/logo.png"/><br>1 Вопрос <span class="title-colour-second">-</span><span class="title-colour"> 1 Ответ</span><br><span id="release">beta</span></div><div class="bottom-edge" id="preloader">Подключение...</div>',
        'init':function () {
            var loader = new Mprogress({
                template: 1
            });
            APP.HOOK.reg('modeChanged','init',function (mode) {
                if(mode=='OFFLINE'){document.getElementById('preloader').innerHTML='<span class="error">Не удалось установить соединение</span><br><button onclick="window.open(\'https://lapa.ndhost.ru/1Q1A/WEB\', \'_system\');">Загрузить Web версию</button>'}
            },'loadInform');
            loader.start();
            loader.set(0.1);
            APP.require('js/io.js',function () {
                loader.set(0.3);
                APP.io({'initConnect':'true'},function (response) {
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
                });
            });
        }
    },
    'main':{
        'title':'LaPa Советы',
        'body':'<button id="account" onclick="APP.logout();">Выход</button><div class="modeChanger"><input type="checkbox" id="answerMode"/></div><div id="skills"></div><div id="ask" onclick="APP.page(\'ask\');" class="bottom-edge">Попросить совет</div>',
        'init':function () {
            modeActivator = new Switchery(document.getElementById('answerMode'));
            modeActivator.bindClick();
            document.getElementById('answerMode').checked=true;
            APP.CONF.account.skills=APP.CONF.account.skills||{};
            listSkills='';
            for(i in Object.keys(APP.CONF.account.skills)){
                listSkills+='<div class="skill" onclick="this.className=\'skill expand\';"><span class="title">'+APP.CONF.account.skills[Object.keys(APP.CONF.account.skills)[i]]['title']+'</span><div class="skill-data"><hr>В этом месяце вы накопили:<div class="coins"><img height="25" src="img/coins.svg"/> '+APP.CONF.account.skills[Object.keys(APP.CONF.account.skills)[i]]['coins']+' Баллов</div></div></div>';
            }
            //listSkills=listSkills==''?listSkills=
            document.getElementById('skills').innerHTML=listSkills;
        }
    },
    'start':{
        'hideHistory':true,
        'title':'Добро пожаловать!',
        'body':'<div id="logo"><img src="img/logo.png"/><br>1 Вопрос <span class="title-colour-second">-</span><span class="title-colour"> 1 Ответ</span><br><span id="release">beta</span></div><div class="buttons-block bottom-edge-block"><button id="auth" onclick="APP.page(\'auth\');">Авторизация</button><br><button id="reg" onclick="APP.page(\'reg\');">Регистрация</button></div>'
    },
    'auth':{
        'title':'Авторизация',
        'body':'<div class="block-layer"><div class="block-title-outside"><label for="email">Логин:</label></div><div class="block"><input type="email" id="email" placeholder="E-mail"></div><div class="block-title-outside"><label for="email">Пароль:</label></div><div class="block"><input type="password" id="password" placeholder="*****"></div><div id="message"></div><button id="send" onclick="APP.auth(document.getElementById(\'email\').value,document.getElementById(\'password\').value)">Продолжить</button></div>'
    },
    'reg':{
        'title':'Регистрация',
        'body':'<div class="block-layer"><div class="block-title-outside"><label for="email">Логин:</label></div><div class="block"><input type="email" id="email" placeholder="E-mail"></div><div class="block-title-outside"><label for="email">Пароль:</label></div><div class="block"><input type="password" id="password" placeholder="*****"></div><div id="message"></div><button id="send" onclick="APP.reg(document.getElementById(\'email\').value,document.getElementById(\'password\').value,1)">Продолжить</button></div>',
        'init':function () {

        }
    },
    'ask':{
        'title':'Задать вопрос',
        'body':'<div class="block-layer">О чем вы хотите спросить?<div class="block" style="text-align: left"><textarea id="question" placeholder="Введите вопрос" maxlength="1000" rows="5" cols="25"></textarea><br><label for="category">Категория:</label> <select id="category"></select><br><br><label for="local">Поблизости</label> <input type="checkbox" id="local" onchange="if(this.checked)APP.getLocation(true);"/><span id="local_indicator" class="indicator"></span></div><div id="message"></div><button id="send" onclick="APP.sendQuestion(document.getElementById(\'question\').value,document.getElementById(\'category\').value,document.getElementById(\'local\').checked);">Отправить</button></div>',
        'init':function () {
            localActivator = new Switchery(document.getElementById('local'),{ size: 'small' });
            APP.require('js/question.js',function () {
                if(APP.CONF.listCategory){
                    for(i in APP.CONF.listCategory) {
                        document.getElementById('category').innerHTML += '<option value="'+i+'">'+APP.CONF.listCategory[i]+'</option>';
                    }
                }
            });
            if(!navigator.geolocation){
                localActivator.disable();
            }
        }
    },
    'question':{
        'title':'Вопрос',
        'body':'<button id="closeQuestion">Закрыть вопрос</button><div id="messages"><img src="img/loader.svg"/></div>',
        'init':function () {
            APP.CONF.QAU=setInterval(APP.updateQuestion,1000);
        },
        'unload':function () {
            if(APP.CONF.QAU){
                clearInterval(APP.CONF.QAU);
                delete APP.CONF.QAU;
            }
        }
    }
};