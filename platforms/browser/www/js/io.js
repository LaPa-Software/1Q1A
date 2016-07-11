;(function() {
    var io=function (data,onFinish,target,plainData) {
        target = target || APP.CONF.server.apiUrl;
        data = data || {};
        data = '?query=' + JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', target + data, true);
        //alert('request to '+target + data);
        //xhr.responseType = 'text';
        /*if(xhr.onload) {
         //alert('onLoad Event');
         xhr.onload = function (e) {
         //alert('request finished with status ' + this.status +' and response '+this.response);
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
         }else{*/
        //alert('onReadyStateChange Event');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4){
                //alert('request finished with status ' + xhr.status + ' and response '+xhr.responseText);
                var response = xhr.responseText;
                if(xhr.status == 200||xhr.status == 0) {
                    if (!plainData) {
                        try {
                            response = JSON.parse(xhr.responseText);
                        } catch (e) {
                            response = false;
                        }
                    }
                }else{
                    alert('Fail');
                    response = false;
                }
                if (onFinish)onFinish(response);
            }else{
                alert('request state '+xhr.readyState);
            }
        };
        //}
        xhr.send();
        //alert('request send');
    };
    function initIoLib() {
        window.APP.io=io;
    }
    APP.HOOK.reg('PreInit',false,initIoLib,'io.js');
})();