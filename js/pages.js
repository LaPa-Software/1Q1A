var APPPAGE={
    'init':{
        'title':'Loading...',
        'hideHistory':true,
        'body':'<div id="logo"><img src="img/logo.png"/></div><div class="bottom-edge" id="preloader">Подключение...</div>',
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
                            loader.set(0.6);
                            APP.io({'syncUserData': true}, function (response) {
                                loader.set(0.8);
                                if (response) {
                                    if(APP.fetchAccount(response)){
                                        APP.getLocation(false,function (location) {
                                            //if(location) {
                                                APP.io({'userGeoPos': location}, function () {
                                                    loader.end();
                                                    APP.page('main');
                                                });
                                            /*}else{
                                                loader.end();
                                                APP.page('main');
                                            }*/
                                        });
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
        'body':'<button id="account" onclick="APP.logout();">Выход</button><div class="modeChanger"><input type="checkbox" id="answerMode"/></div><div id="skills"></div><div id="questions_btn" onclick="APP.page(\'questions\');" class="bottom-edge second" style="display: none">Ответить на вопросы (<span id="questions_count">0</span>)</div><div id="ask" onclick="APP.page(\'ask\');" class="bottom-edge">Попросить совет</div>',
        'init':function () {
            modeActivator = new Switchery(document.getElementById('answerMode'));
            modeActivator.bindClick();
            document.getElementById('answerMode').checked=true;
            APP.CONF.account.skills=APP.CONF.account.skills||{};
            listSkills='';
            for(i in Object.keys(APP.CONF.account.skills)){
                listSkills+='<div class="skill" onclick="this.className=\'skill expand\';"><span class="title">'+APP.CONF.account.skills[Object.keys(APP.CONF.account.skills)[i]]['title']+'</span><div class="skill-data"><hr>В этом месяце вы накопили:<div class="coins"><img height="25" src="img/coins.svg"/> '+APP.CONF.account.skills[Object.keys(APP.CONF.account.skills)[i]]['coins']+' Баллов</div></div></div>';
            }
            listSkills=listSkills!=''?listSkills:'<button onclick="APP.page(\'setup\');">Указать интересы</button>';
            document.getElementById('skills').innerHTML=listSkills;
            if(APP.CONF.account.invites.length!=0){
                document.getElementById('questions_btn').style.display='block';
                document.getElementById('questions_count').innerHTML=APP.CONF.account.invites.length;
            }
        }
    },
    'start':{
        'hideHistory':true,
        'title':'Добро пожаловать!',
        'body':'<div id="logo"><img src="img/logo.png"/></div><div class="buttons-block bottom-edge-block"><button id="auth" onclick="APP.page(\'auth\');">Авторизация</button><br><button id="reg" onclick="APP.page(\'reg\');">Регистрация</button></div>'
    },
    'auth':{
        'title':'Авторизация',
        'body':'<div class="block-layer"><div class="block-title-outside"><label for="email">Логин:</label></div><div class="block"><input type="email" id="email" placeholder="E-mail"></div><div class="block-title-outside"><label for="email">Пароль:</label></div><div class="block"><input type="password" id="password" placeholder="*****" onkeypress="if(event&&event.keyCode==13)APP.auth();"></div><div id="message"></div><button id="send" onclick="APP.auth()">Продолжить</button></div>',
        'init':function () {
            document.getElementById('email').focus();
        }
    },
    'reg':{
        'title':'Регистрация',
        'body':'<div class="block-layer"><div class="block-title-outside"><label for="email">Логин:</label></div><div class="block"><input type="email" id="email" placeholder="E-mail"></div><div class="block-title-outside"><label for="email">Пароль:</label></div><div class="block"><input type="password" id="password" placeholder="*****" onkeypress="if(event&&event.keyCode==13)APP.reg();"></div><div id="message"></div><button id="send" onclick="APP.reg()">Продолжить</button></div>',
        'init':function () {
            document.getElementById('email').focus();
        }
    },
    'ask':{
        'title':'Задать вопрос',
        'body':'<div class="block-layer">О чем вы хотите спросить?<div class="block" style="text-align: left"><textarea id="question" placeholder="Введите вопрос" maxlength="1000" rows="5" cols="25"></textarea><br><label for="category">Категория:</label> <select id="category"></select><br><br><label for="local">Поблизости</label> <input type="checkbox" id="local" onchange="if(this.checked){document.getElementById(\'local_indicator\').innerHTML=APP.CONF.loader;APP.getLocation(true,function(result){if(document.getElementById(\'local_indicator\'))document.getElementById(\'local_indicator\').innerHTML=\'\';if(result==false){localActivator.bindClick();this.checked=false;APP.message(\'Необходимо разрешение для доступа к Гео-позиции\');}});}"/><span id="local_indicator" class="indicator"></span></div><div id="message"></div><button id="send" onclick="APP.sendQuestion(document.getElementById(\'question\').value,document.getElementById(\'category\').value,document.getElementById(\'local\').checked);">Отправить</button></div>',
        'init':function () {
            localActivator = new Switchery(document.getElementById('local'),{ size: 'small' });
            APP.require('js/question.js',function () {
                APP.listSkills(function () {
                    for(i in APP.CONF.listCategory) {
                        document.getElementById('category').innerHTML += '<option value="'+i+'">'+APP.CONF.listCategory[i]+'</option>';
                    }
                })
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
    },
    'setup':{
        'title':'Выбор категорий',
        'body':'<div class="block-layer">Укажите 3 категории, которые вам интересны:<div class="block" id="listSkills"><img src="img/loader.svg"/></div><button id="send" onclick="APP.saveSkills();">Продолжить</button></div>',
        'init':function () {
            APP.CONF.account.mySkills={};
            APP.CONF.account.mySkillsCount=0;
            APP.require('js/question.js',function () {
                APP.listSkills(function () {
                    document.getElementById('listSkills').innerHTML='';
                    document.getElementById('listSkills').className='block left';
                    for(i in APP.CONF.listCategory) {
                        document.getElementById('listSkills').innerHTML += '<input type="checkbox" id="'+i+'" class="js-switch" onchange="if(this.checked){if(APP.CONF.account.mySkillsCount>2){this.checked=false;return false;};APP.CONF.account.mySkills[\''+i+'\']=true;APP.CONF.account.mySkillsCount++;}else{delete APP.CONF.account.mySkills[\''+i+'\'];APP.CONF.account.mySkillsCount--;}"/> <label for="'+i+'">'+APP.CONF.listCategory[i]+'</label><br>';
                    }
                    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
                    elems.forEach(function(html) {
                        var switchery = new Switchery(html,{size:'small'});
                    });
                })
            });
        }
    },
    'questions':{
        'title':'Доступные вопросы',
        'body':'<div class="block-layer" id="questions"><img src="img/loader.svg"/></div>',
        'init':function () {
            APP.require('js/question.js',function () {
                document.getElementById('questions').innerHTML='Выберите вопрос:';
                for (i in APP.CONF.account.invites) {
                    document.getElementById('questions').innerHTML += '<div class="block" id="' + APP.CONF.account.invites[i].id + '" onclick="APP.openQuestion(i);">' + APP.CONF.account.invites[i].text + '<hr>Категория: ' + APP.CONF.account.invites[i].skill + (APP.CONF.account.invites[i].local == 1 ? '<br>Найдено поблизости' : '') + '</div>';
                }
            });
        }
    },
    'answer':{
        'title':'Ответ на вопрос',
        'body':'<button id="closeQuestion" onclick="APP.cancelAnswer();">Отказаться</button><div id="messages"></div>',
        'init':function () {
            document.getElementById('messages').innerHTML = '<div class="message">Вопрос:<br><span class="question-title">' + APP.CONF.account.invites[APP.CONF.openQuestion].text + '</span></div><div class="status-message">Вы присоединились к диалогу</div><div class="message" id="answer_block">Введите ваш ответ:<br><span class="question-title"><textarea id="answer" maxlength="1000" rows="5" cols="25"></textarea></span></div><button id="send" onclick="APP.sendAnswer();">Отправить</button>';
        }
    }
};