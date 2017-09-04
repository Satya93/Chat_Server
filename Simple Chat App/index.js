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
var flog = 0;
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
    user_id: Number, //Schema.Types.ObjectId,
    user_name: String,
    user_password: String,
    user_date: {
        type: Date,
        default: new Date()
    }
})

var msg_schema = new Schema({
    msg_id: Schema.Types.ObjectId,
    user_name: String,
    msg_content: String,
    msg_date: {
        type: Date,
        default: new Date().toISOString()
    }
})

var user = mng.model('users', user_schema);
var msg = mng.model('msgs', msg_schema);

//

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("Connected!")
    console.log(" ");
});

app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.json()); // Retrieve data from front end
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function(req, res) {
    //1. res.send('<h1>Hello World</h1>');
    res.render('index.html',{message:"Welcome to the FSE Chat App!"});
});

app.get('/registeruser', function(req, res) {
    var regname = req.query.user;
    var regpass = req.query.password;
    user.findOne({
            'user_name': regname
        }, function(err, usert) {
        	console.log(usert)
            if (usert) {
            		flog = 1;
                    console.log("Username already taken");
                    console.log(" ");
                    res.render('register.html', {
                        'message':'Username already taken, please choose another'
                    });
                    return;

            		}

            	else{
			    user.create({
			        user_name: regname,
			        user_password: regpass
			    }, function(err, new_user) {
			        if (err) {
			            console.log("ERROR : Something with the DB.")
			            console.log(" ");
			            return
			        }
    			})

			    console.log("Registering User ");
			    console.log('Username is : ', regname);
			    console.log('Password is : ', regpass);
			    console.log(" ");
			    res.render('login.html',{message:"Please login with your new ID and Password."});
}
        })
 })

app.get('/login', function(req, res) {
	console.log("User chose to Login ");
	console.log(" ");
    res.render('login.html', {
        'message': 'Welcome to the FSE Chat App!'
    });
});

app.get('/register', function(req, res) {
	console.log("User chose to register ");
	console.log(" ");
    res.render('register.html',{message:"Welcome to the FSE Chat App!"});
});

app.get('/logincheck', function(req, res) {

	console.log("Checking Login.... ");
    username = req.query.user;
    password = req.query.password;

    if (username != 0) {
        user.findOne({
            'user_name': username
        }, function(err, user) {
            if (user) {
                if (user.user_password == password) {
                    console.log("Correct password and username");
                    console.log(" ");
                    res.render('chat.html', {
                        username: username,
                        flag: '1'
                    });
                } else {
                	console.log("Username found, associated Password is wrong");
                	console.log(" ");
                    res.render('login.html', {
                        'message': "Wrong username or password."
                    });
                }
            } else {
                console.log("Username and Password not found");
                console.log(" ");
                res.render('register.html', {
                        'message': "Please register!"
                    });
            }

        })
    }


})


app.get('/message', function(req, res) {
    username = req.query.user
    console.log("Connected to the message page");
    res.render('chat.html', {
        username: username,
        flag: '0'
    });
});

//2. Insert Socket.io code
io.on('connection', function(socket) {
    //3. Insert socket.io disconnect code
    socket.on('disconnect', function() {
       
    })

    socket.on('new login', function(data) {
    	console.log('New User entered Chat Room');
    	console.log(" ");
        msg.find({}, function(err, msg) {
            var msgmap = {};
            var i = 0
            msg.forEach(function(msg) {
                msgmap[i] = msg;
                i++
            });
            msjson = JSON.stringify(msgmap);
            msjson = JSON.parse(msjson);
            io.emit('new login', msjson)
        })
    })

    //4. Print out message generated from socket event 
    socket.on('chat message', function(data) {
    	console.log("New Message received")
        var un = data.user;
        var mesg = data.message;
        msg.create({
            user_name: un,
            msg_content: mesg
        }, function(err, new_user) {
            if (err) {
                console.log("ERROR : Something with the DB.")
                return
            }
            msg.find({}, function(err, msg) {
                var msgmap = {};
                var i = 0;
                msg.forEach(function(msg) {
                    msgmap[i] = msg;
                    i++
                });
                msjson = JSON.stringify(msgmap);
                msjson = JSON.parse(msjson);
                io.emit('chat message', msjson)
            })
            //5. Emit the message to all users
            console.log(username + ' : ' + mesg);
            console.log(" ");
        })
    })

    console.log(' User Connected! ')
})

server.listen(8000, '0.0.0.0', function() {
	console.log(' ')
    console.log('Listening on Port :8000');
    console.log('NOTE : User with  name : RealUser and p/w : realpassword has already been registered for demo purposes.');
    console.log(' ')
});