var http = require('http');
var fs = require('fs');

// 1. Create a 404 response if user tries to access a page that isn't there.
function send404res(res){
	//Specify error message and code when page isn't found.
	res.writeHead(404,{"Context-Type":"text/plain"});
	res.write("Page not found, yo.")
	res.end();
}

//Handle a user request and send them a file they want
function onReq(req,res){
	//Define loops to see if methods and urls are supported by server
	//If user requests homepage
	if(req.method == 'GET' && req.url == '/'){
		//Select response type as text html
		res.writeHead(200,{"Context-Type":"text/html"});
		//Create readable text stream for filesystem
		//Output the HTML file as response
		fs.createReadStream("./index.html").pipe(res)
	}
	else{
		//User is trying to access a webpage that isn't there.
		send404res(res)
	}
}

//Specify function to run (OnConnect) when user connects/requests something to server
http.createServer(onReq).listen(8000);
//Can be used for debugging, equivalent to printf
console.log("Server is running");

//TEST RESULTS
//Web Server working on localhost:8000
//Checks if user is accessing the home page
//- If yes, delivers index.html
//- If no, responds with an error message