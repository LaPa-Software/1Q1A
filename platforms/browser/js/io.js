;(function() {
    var io=function (data,onFinish,target,plainData) {
        target=target||APP.CONF.server.apiUrl;
        data=data||{};
        data='?query='+JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', target+data, true);
        xhr.responseType = 'text';
        xhr.onload = function(e) {
            /*var response=this.response;
            if (this.status == 200) {
                if(!plainData){
                    try{
                        response=JSON.parse(this.response);
                    }catch(e){

                    }
                }
            }else{
                response=false;
            }
            if(onFinish)onFinish(response);*/
        };
        xhr.send();
    };
    function initIoLib() {
        window.APP.io=io;
    }
    APP.HOOK.reg('PreInit',false,initIoLib,'io.js');
})();