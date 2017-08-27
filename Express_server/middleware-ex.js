var express = require('express');
var app = express();
var port = 8000;
//3. Manage routes, locations of views and engines here.

//4. Middleware comes here. It is a layer of functions invoked by express.js before processing the request.
// Order of middleware matters


//1. Start server at Port 8000
//Call a function as callback, which means that it will only run after the server has been started.
app.listen(port,function(err,res){
	if(err){
		console.log("Server Error");
	}
	else{
		//2. Log when the server has started
		console.log("Server Started Successfully")
	}
});