var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var mysql = require('mysql')
var dateTime = require('node-datetime');
var sqlevents = require('mysql-events')

var app = express();
var port = 8000;
var message = "No New Messages";
var user = "Default"
var user_queue
var messages_queue
var user_queue_arr = {}
var messages_queue_arr = {}
var uplist = {}
var uplist_str
var numcnt

var dsn = {
	host:'127.0.0.1',
	user:'root',
	password:'9okm8ijn76',
	database:'chat_serve'
}

var db = mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'9okm8ijn76',
	database:'chat_serve'
})
var watcher = sqlevents(dsn)
db.connect(function(err) {
	if(err){
		console.error("Error! : "+err.stack);
		return;
	}
	})

app.engine('html', engines.mustache);
app.set('view engine', 'html');

//3. Manage routes, locations of views and engines here.

//4. Middleware comes here. It is a layer of functions invoked by express.js before processing the request.
// Order of middleware matters
app.use(log);
app.use(bodyParser.json());// Retrieve data from front end
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post('/newmsg',function(req,res){
	user = req.body.user
	console.log(user)
	message = req.body.msg;
	console.log("Done 1")
	if(req.body.msg!=null & req.body.msg!=undefined){
		var query = db.query('INSERT INTO msgs SET ?',{msg_user:user,msg_cnt:req.body.msg}, function(err,result,fields) {
	  		if(err){
			console.error("Error! : "+err.stack);
			return;}
		})
	}
	var getmsg = db.query('SELECT COUNT(*) FROM msgs', function(err,result,fields) {
		if(err){
		console.error("Error! : "+err.stack);
		return;
	}
	numcnt = result[0]['COUNT(*)'];
})
	console.log("Done 2");
	var getmsg = db.query('SELECT ?? FROM ??',[['msg_user','msg_cnt'],'msgs'], function(err,result,fields) {
		if(err){
		console.error("Error! : "+err.stack);
		return;
	}
	//var tempvar =JSON.stringify(result);
	messages_queue = result//tempvar //JSON.parse(tempvar);
	var i =0;
	while(i<numcnt){
		messages_queue_arr[i] = messages_queue[i].msg_cnt;
		user_queue_arr[i] = messages_queue[i].msg_user;
	i++
}
	//console.log(typeof messages_queue_arr);
	//console.log(messages_queue_arr);
	//console.log(user_queue_arr);
	var  i = 1;
	while(i<numcnt-1){
		uplist[i]='{"'+ user_queue_arr[i]+'"'+":"+'"'+messages_queue_arr[i]+'"}'+",";
	i++
}
	uplist[numcnt-1]='{"'+ user_queue_arr[numcnt-1]+'"'+":"+'"'+messages_queue_arr[numcnt-1]+'"}';
	//console.log(uplist);
})

	var getusrs = db.query('SELECT ?? FROM ??',['msg_user','msgs'], function(err,result,fields) {
		if(err){
		console.error("Error! : "+err.stack);
		return;
	}
	user_queue=result
	uplist_str = uplist[1]
	//console.log(uplist_str)
	var i =2;
	//console.log(messages_queue[0].msg_cnt);
	uplist_str='['
	while(i<numcnt){
		uplist_str = uplist_str +uplist[i];
	//console.log(user_queue[i].msg_user+' : '+messages_queue[i].msg_cnt);
	i++
}
uplist_str=uplist_str+']'
uplist_str=String(uplist_str)
bng = String(uplist_str)
//console.log(bng)
bng = JSON.parse(bng)
bng = JSON.stringify(bng)
	//uplist_str=uplist_str+'"'
//console.log(typeof bng)
//console.log(bng)
res.render('./welcome.html',{name:user,mesg:message,msg_queue_js:bng,qlen:numcnt});
app.post('/newmsg',function(req,res){
	res.render('./welcome.html',{name:user,mesg:message,msg_queue_js:bng,qlen:numcnt});
})
})
})

var dbwatcher =watcher.add(
  'chat_serve.msgs.msg_user.value',
  function (oldRow, newRow, event) {
     //row inserted 
    if (oldRow === null) {
      console.log("Changed")
    }
    },
    'Satya'
    )