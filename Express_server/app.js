var express = require('express');
var app = express();
var port = 8000;
var engines = require('consolidate');

app.engine('html', engines.mustache);
app.set('view engine', 'html');

//3. Manage routes, locations of views and engines here.

//4. Middleware comes here. It is a layer of functions invoked by express.js before processing the request.
// Order of middleware matters
app.use(log);
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

app.get('/',function(req,res){
	res.render('./index.html');
})

app.get('/:id',function(req,res){
	res.send('The parameter passed was '+req.params.id);
})