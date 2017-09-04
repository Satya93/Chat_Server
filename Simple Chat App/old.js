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
var msjson;
var flg = 1;
var ib;
var msgmap;
var username;
var password;
// Login to MongoDB

var mng = require("mongoose")
var db = mng.connection;
mng.connect('mongodb://localhost/fse_chat')

// Schema for MongoDB and hook

var Schema = mng.Schema; 

var user_schema = new Schema({
	user_id : Number,//Schema.Types.ObjectId,
	user_name : String,
	user_password : String,
	user_date : {type:Date, default:new Date().toISOString()}
})

var msg_schema = new Schema({
	msg_id : Schema.Types.ObjectId,
	user_name : String,
	msg_content : String,
	msg_date : {type:Date, default:new Date().toISOString()}
})

var user = mng.model('users',user_schema);
var msg = mng.model('msgs',msg_schema);

//

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected!")
});

app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.json());// Retrieve data from front end
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/test',function(req,res){
	user.remove({})
	user.find({'user_name':'Mugdha'}, function(err, msg) {
    var msgmap = {};
    var i = 0
    msg.forEach(function(msg) {
      msgmap[i] = msg;
      i++
    });
    console.log(msgmap)
    var msjson = JSON.stringify(msgmap);
    msjson = JSON.parse(msjson);
    res.send(msgmap);
});
})

app.get('/',function(req,res){
	//1. res.send('<h1>Hello World</h1>');
	res.render('index.html');
});

app.get('/registeruser',function(req,res){
	var regname = req.query.user;
	var regpass = req.query.password;
	user.create({user_name:regname,user_password:regpass},function(err,new_user){
			if(err){
				console.log("ERROR : Something with the DB.")
				return 
			}
		})
	console.log('Username is : ',regname);
	console.log('Password is : ',regpass);
	res.render('login.html');
});

app.get('/login',function(req,res){
	res.render('login.html',{'message':'FSE Chat App'});
});

app.get('/register',function(req,res){
	res.render('register.html');
});

app.get('/logincheck',function(req,res){

	console.log("initial D")
	username = req.query.user;
	password = req.query.password;
	console.log(username)
	console.log(password)
	if(username!=0){
		user.find({'user_name':username}, function(err, msg) {
	    var msgmap = {};
	    ib = 0
	    msg.forEach(function(msg) {
	      msgmap[ib] = msg;
	      ib++})
	    var msjson = JSON.stringify(msgmap);
	    msjson = JSON.parse(msjson);
	    console.log(password);
	    if(msgmap[0].user_password==password){
	    	res.render('chat.html',{username:username,flag:'1'});
	    }
	    else if(ib!=0)
	    {
	    	res.render('login.html',{'message':"Wrong username or password. Maybe you haven't registered."});
	    }
	    })
	}

    else{
    	res.send("brupppp");
    }
    
	
	console.log(ib)
    //Load messages
})
   

app.get('/message',function(req,res){
	username = req.query.user
	console.log(username);
	res.render('chat.html',{username:username,flag:'0'});
});

//2. Insert Socket.io code
io.on('connection',function(socket){
	console.log('a user connected');
	//3. Insert socket.io disconnect code
	socket.on('disconnect',function(){
		console.log('a user disconnected')
	})

	socket.on('new login',function(data){
		msg.find({}, function(err, msg) {
    		var msgmap = {};
    		var i = 0
    		console.log("New User inside")
    		msg.forEach(function(msg) {
      			msgmap[i] = msg;
      			i++
    		});
    		msjson = JSON.stringify(msgmap);
    		msjson = JSON.parse(msjson);
    		console.log('Done JSON')
    		console.log("JSON is : ",msjson[1].user_name)
			io.emit('new login',msjson)
		})
	})

	//4. Print out message generated from socket event 
	socket.on('chat message',function(data){
		var un = data.user;
		var mesg = data.message;
		msg.create({user_name:un,msg_content:mesg},function(err,new_user){
			if(err){
				console.log("ERROR : Something with the DB.")
				return 
			}
		msg.find({}, function(err, msg) {
    		var msgmap = {};
    		var i = 0
    		console.log("New 1")
    		msg.forEach(function(msg) {
      			msgmap[i] = msg;
      			i++
    		});
    		msjson = JSON.stringify(msgmap);
    		msjson = JSON.parse(msjson);
    		console.log('Done JSON')
    		console.log("JSON is : ",msjson[1].user_name)
			io.emit('chat message',msjson)
		})
		console.log('Login Checking');
		//5. Emit the message to all users
		console.log('Chat Message Received')
		console.log(username+' : '+msg);
	})
	})

	socket.on('login',function(){
		var un = data.user;
		var mesg = data.message;
		msg.create({user_name:un,msg_content:mesg},function(err,new_user){
			if(err){
				console.log("ERROR : Something with the DB.")
				return 
			}
		msg.find({}, function(err, msg) {
    		var msgmap = {};
    		var i = 0
    		console.log("New 1")
    		msg.forEach(function(msg) {
      			msgmap[i] = msg;
      			i++
    		});
    		msjson = JSON.stringify(msgmap);
    		msjson = JSON.parse(msjson);
    		console.log('Done JSON')
    		console.log("JSON is : ",msjson[1].user_name)
			io.emit('login',msjson)
		})
	})
})
})
server.listen(8000,'0.0.0.0',function(){
	console.log('Listening on *:3000');
});