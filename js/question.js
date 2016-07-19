;(function() {
    var sendQuestion=function (text,skill,location,expire) {
        if(text==''){APP.message('Введите вопрос');return false;}
        document.getElementById('send').innerHTML='<img src="img/loader.svg"/>';
        if(location)location=APP.getLocation();
        APP.io({'createQuestion':{'text':text,'skill':skill,'location':location||null,'expire':expire||15}},function (response) {
            if(!response['createQuestion']){
                APP.message(response['message']||'Не удалось создать вопрос');
                document.getElementById('send').innerHTML='Отправить';
                return false;
            }
            APP.CONF.account.question=response['createQuestion'];
            APP.HISTORY.splice(-1, 1);
            APP.page('question');
        });
    };
    var updateQuestion=function () {
        APP.io({'updateQuestion':APP.CONF.account.question.id},function (response) {
            if(APP.CONF.account.question!=response['updateQuestion']){
                APP.CONF.account.question=response['updateQuestion'];
                if(document.getElementById('messages')) {
                    document.getElementById('messages').innerHTML = '<div class="message">Вы задали вопрос:<br><span class="question-title">' + APP.CONF.account.question.text + '</span></div>';
                    if (APP.CONF.account.question.answers) {
                        document.getElementById('messages').innerHTML += '<div class="status-message">Ваш собеседник присоединился к диалогу</div>';
                        for (i in APP.CONF.account.question.answers) {
                            document.getElementById('messages').innerHTML += '<div class="message">Ответ собеседника:<br><span class="question-title">' + APP.CONF.account.question.answers[i].text + '</span></div>';
                        }
                    } else {
                        document.getElementById('messages').innerHTML += '<div class="status-message">Поиск собеседника...</div>';
                    }
                }
            }
        });
    };
    var listSkills=function (func) {
        if(APP.CONF.listCategory){
            if(func){func(APP.CONF.listCategory);}else{return APP.CONF.listCategory;}
        }else{
            APP.CONF.listCategory = {};
            APP.io({'listCategory': 'all'}, function (data) {
                if (data['listCategory']) {
                    APP.CONF.listCategory = data['listCategory'];
                    if (func)func(data['listCategory']);
                }
            });
        }
    };
    var openQuestion=function (id) {
        APP.CONF.openQuestion=id;
        APP.HISTORY.splice(-1, 1);
        APP.page('answer');
    };
    var sendAnswer=function (text) {
        text=text||document.getElementById('answer').value;
        if(text==''){APP.message('Введите ответ');return false;}
        document.getElementById('send').innerHTML='<img src="img/loader.svg"/>';
        APP.io({'cleanInvite':APP.CONF.account.invites[APP.CONF.openQuestion].id,'sendAnswer':{'text':text,'question':APP.CONF.account.invites[APP.CONF.openQuestion].question}},function (response) {
            if(!response['sendAnswer']){APP.message('Произошла ошибка');document.getElementById('send').innerHTML='Отправить';return false;}
            document.getElementById('answer_block').innerHTML='Ваш ответ:<br><span class="question-title">'+text+'</span>';
            document.getElementById('send').outerHTML='';
            document.getElementById('closeQuestion').outerHTML='';
            APP.CONF.account.invites.splice(APP.CONF.openQuestion,1);
            delete APP.CONF.openQuestion;
        });
    };
    var cancelAnswer=function () {
        APP.io({'cleanInvite':APP.CONF.account.invites[APP.CONF.openQuestion].id},function () {
            APP.CONF.account.invites.splice(APP.CONF.openQuestion,1);
            delete APP.CONF.openQuestion;
            APP.page('main');
        })
    };
    function initQuestionLib() {
        window.APP.sendQuestion=sendQuestion;
        window.APP.updateQuestion=updateQuestion;
        window.APP.listSkills=listSkills;
        window.APP.openQuestion=openQuestion;
        window.APP.sendAnswer=sendAnswer;
        window.APP.cancelAnswer=cancelAnswer;
    }
    APP.HOOK.reg('PreInit',false,initQuestionLib,'question.js');
})();