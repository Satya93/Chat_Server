var express = require('express');
var app = express();
var port = 8000;
//3. Manage routes, locations of views and engines here.

// App.Use middleware methods are used for every request that is made to the server
//app.use(body-parser());
//app.use(cookieParser());
//app.use() can be used instead of chains for better formatting
app.use(log);
app.use(hello);

// Pass middleware functions to route
// Order of middleware matters
app.get('/')

//4. Middleware comes here. It is a layer of functions invoked by express.js before processing the request.
function log(req,res,next){
	console.log(new Date(),req.method,req.url);
	// Moves to next function
	next();
}

function hello(req,res,next){
	res.write("Hello World!");
	res.end();
	next();
}

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