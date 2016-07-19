;(function() {
    var fetchAccount=function (data) {
        if(!data['syncUserData']){
            return false;
        }
        APP.CONF.account=data['syncUserData'];
        return true;
    };
    var reg=function (email,password,gender) {
        email=email||document.getElementById('email').value;
        password=password||document.getElementById('password').value;
        gender=gender||1;
        if(email==''){APP.message('Укажите Email');return false;}
        if(password==''){APP.message('Укажите пароль');return false;}
        APP.message('');
        document.getElementById('send').innerHTML='<img src="img/loader.svg"/>';
        APP.io({'reg': {'login':email,'password':password,'gender':gender}}, function (response) {
            if(!response['reg']){if(response['message'])APP.message(response['message']);document.getElementById('send').innerHTML='Продолжить';return false;}
            APP.CONF.account=response['reg'];
            APP.page('setup',true);
        });
    };
    var auth=function (email,password) {
        email=email||document.getElementById('email').value;
        password=password||document.getElementById('password').value;
        if(email==''){APP.message('Укажите Email');return false;}
        if(password==''){APP.message('Укажите пароль');return false;}
        APP.message('');
        document.getElementById('send').innerHTML='<img src="img/loader.svg"/>';
        APP.io({'auth': {'login':email,'password':password}}, function (response) {
            if(!response['auth']){APP.message('Вы указали не верный Логин/Пароль');document.getElementById('send').innerHTML='Продолжить';return false;}
            APP.CONF.account=response['auth'];
            APP.page('main',true);
        });
    };
    var logout=function () {
        APP.io({'logout':true},function (response) {
            if(response['logout']){
                APP.CONF.account={};
                APP.page('start',true);
            }
        });
    };
    var saveSkills=function () {
        document.getElementById('send').innerHTML='<img src="img/loader.svg"/>';
        APP.io({'saveSkills':{'data':APP.CONF.account.mySkills},'syncUserData':true},function (response) {
            if(!response['saveSkills']){APP.message(response['message']||'Произошла ошибка при сохранении, попробуйте повторить');document.getElementById('send').innerHTML='Продолжить';return false;}
            if(response['syncUserData']){
                APP.CONF.account=response['syncUserData'];
            }
            APP.page('main',true);
        });
    };
    function initUserLib() {
        window.APP.fetchAccount=fetchAccount;
        window.APP.reg=reg;
        window.APP.auth=auth;
        window.APP.logout=logout;
        window.APP.saveSkills=saveSkills;
    }
    APP.HOOK.reg('PreInit',false,initUserLib,'user.js');
})();