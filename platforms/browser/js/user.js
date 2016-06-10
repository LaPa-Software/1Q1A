;(function() {
    var fetchAccount=function (data) {

    };
    function initUserLib() {
        window.APP.fetchAccount=fetchAccount;
    }
    addEventListener('PreInit',initUserLib);
})();