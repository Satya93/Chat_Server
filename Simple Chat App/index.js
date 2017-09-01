var express = require('express');
var http = require('http');
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var username;

app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.json());// Retrieve data from front end
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',function(req,res){
	//1. res.send('<h1>Hello World</h1>');
	res.render('index.html');
});

app.get('/registeruser',function(req,res){
	var regname = req.query.user;
	var regpass = req.query.password
	console.log('Username is : ',regname);
	console.log('Password is : ',regpass);
	res.render('login.html');
});

app.get('/login',function(req,res){
	res.render('login.html');
});

app.get('/register',function(req,res){
	res.render('register.html');
});

app.get('/logincheck',function(req,res){
	console.log('Login Checking');
	res.render('chat.html',{username:username});
});

app.get('/message',function(req,res){
	username = req.query.user
	console.log(username);
	res.render('chat.html',{username:username});
});

//2. Insert Socket.io code
io.on('connection',function(socket){
	console.log('a user connected');
	//3. Insert socket.io disconnect code
	socket.on('disconnect',function(){
		console.log('a user disconnected')
	})
	//4. Print out message generated from socket event 
	socket.on('chat message',function(data){
		//5. Emit the message to all users
		msg = data.message;
		username = data.user;
		io.emit('chat message',{msg,username})
		console.log('Chat Message Received')
		console.log(username+' : '+msg);
	})
})

server.listen(3000,function(){
	console.log('Listening on *:3000');
});