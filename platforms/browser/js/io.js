;(function() {
    var io=function (data,onFinish,target,plainData) {
        target = target || APP.CONF.server.apiUrl;
        data = data || {};
        data = '?query=' + JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', target + data, true);
        alert('request to '+target + data);
        xhr.responseType = 'text';
        xhr.onload = function (e) {
            alert('request finished with status '+this.status);
            var response = this.response;
            if (this.status == 200) {
                if (!plainData) {
                    try {
                        response = JSON.parse(this.response);
                    } catch (e) {
                        response = false;
                    }
                }
            } else {
                response = false;
            }
            if (onFinish)onFinish(response);
        };
        xhr.send();
        alert('request send');
    };
    function initIoLib() {
        window.APP.io=io;
    }
    APP.HOOK.reg('PreInit',false,initIoLib,'io.js');
})();