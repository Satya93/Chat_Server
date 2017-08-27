function sendreq(){
	var x = document.getElementById("user").value;
    var text = x;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() { 
        if (req.readyState == 4 && req.status == 200)
            callback(req.responseText);
    }
    req.open('GET', "localhost:8000/what.html", true);
    req.send(null);
    alert(text);
}