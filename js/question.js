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
                document.getElementById('messages').innerHTML='<div class="message">Вы задали вопрос:<br><span class="question-title">'+APP.CONF.account.question.text+'</span></div>';
                if(APP.CONF.account.question.answers){
                    document.getElementById('messages').innerHTML+='<div class="status-message">Ваш собеседник присоединился к диалогу</div>';
                    for(i in APP.CONF.account.question.answers){
                        document.getElementById('messages').innerHTML+='<div class="message">Ответ собеседника:<br><span class="question-title">'+APP.CONF.account.question.answers[i].text+'</span></div>';
                    }
                }else{
                    document.getElementById('messages').innerHTML+='<div class="status-message">Поиск собеседника...</div>';
                }
            }
        });
    };
    function initQuestionLib() {
        window.APP.sendQuestion=sendQuestion;
        window.APP.updateQuestion=updateQuestion;
        window.APP.listCategory={};
        APP.io({'listCategory':'all'},function (data) {
            if(data['listCategory']){
                window.APP.CONF.listCategory=data['listCategory'];
                if(document.getElementById('category')){
                    for(i in APP.CONF.listCategory) {
                        document.getElementById('category').innerHTML += '<option value="'+i+'">'+APP.CONF.listCategory[i]+'</option>';
                    }
                }
            }
        })
    }
    APP.HOOK.reg('PreInit',false,initQuestionLib,'question.js');
})();