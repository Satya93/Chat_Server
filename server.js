var http = require('http');

//To execute when user requests something to server
function onConnect(req,res){
	//Log the request made by the user
	console.log("User has just made a request to server : "+ req.url);
	//Formulate a response to the request
	//Request processing OK, send a text response
	res.writeHead(200,{"Context-Type":"text/plain"});
	//Actual text content of response
	res.write("Your request was received, and it's cool.");
	//Send response
	res.end()
}

//Specify function to run (OnConnect) when user connects/requests something to server
http.createServer(onConnect).listen(8000);
//Can be used for debugging, equivalent to printf
console.log("Server is running");

//TEST RESULTS
//Web Server working on localhost:8000
//Responds with "Your request was received, and it's cool." when user requests data.