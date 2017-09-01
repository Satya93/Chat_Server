var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var user_plc
var pw_plc

//_____________________________________________________________________________

var mng = require("mongoose");
var db = mng.connection;
mng.connect('mongodb://localhost/fse_chat')

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected!")
});

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

//_____________________________________________________________________________

var user = mng.model('users',user_schema);
var msg = mng.model('msgs',msg_schema);

//Create new user
//ar new_user = new user({user_name:'Satya',user_password:'9okm8ijn76'});
//Save new user
//new_user.save(function(err){
//	if(err){
		//console.log("ERROR : Could not save.")
		//return
	//}
//}) 

//Create new user without a dedicated variable

//var finduser = mng.model('users',user_schema);
//finduser.find({user_name:'Satya'},'user_password',function(err,users){
	//if(err) console.log("Error while searchinng Database");
	//console.log(users)
//})

//Controllers and Handlers_____________________________________________________________________________

register = function(req,res){
	user_plc=req.body.name;
	pw_plc=req.body.password;
	user.create({user_name:user_plc,user_password:pw_plc},function(err,new_user){
	if(err){
		console.log("ERROR : Something with the DB.")
		return
	}
	res.send("User "+user_plc+" has been registered."),
	console.log("User Registered")
})
}

login = function(req,res){
	//res.send("Login not implemented yet.")
	var un = req.body.name;
	res.render('chatroom',{name:un})
}

send_msg = function(req,res){
	var un = req.body.name;
	var mesg = req.body.msg;
	msg.create({user_name:un,msg_content:mesg},function(err,new_user){
	if(err){
		console.log("ERROR : Something with the DB.")
		return 
	}
	//res.send("Send Message not implemented yet.")
	res.render('chatroom',{name:un,msg:mesg})
})}

new_msg = function(req,res){
	res.send("New Message not implemented yet.")
}

// Routing Mechanisms_____________________________________________________________________________

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//_____________________________________________________________________________

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//_____________________________________________________________________________
var routedex = require('./routes/routedex.js')

app.use('/routes',routedex)
app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/send_msg', send_msg);

//_____________________________________________________________________________

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//_____________________________________________________________________________


module.exports = app;
module.exports = mng;
