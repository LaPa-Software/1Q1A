var xhr = new XMLHttpRequest();
xhr.open('GET',"http://lapa.ndhost.ru/1Q1A/api.php", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
        if(xhr.status == 200||xhr.status == 0) {
            alert('Response: '+xhr.responseText);
        }else{
            alert('Error: '+xhr.responseText);
        }
    }else{
        alert('request state '+xhr.readyState);
    }
};
xhr.send();