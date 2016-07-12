;(function() {
    var fetchAccount=function (data) {

    };
    function initUserLib() {
        window.APP.fetchAccount=fetchAccount;
    }
    APP.HOOK.reg('PreInit',false,initUserLib,'user.js');
})();