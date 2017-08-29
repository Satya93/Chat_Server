var mysql = require('mysql')
var db = mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'9okm8ijn76',
	database:'chat_serve'
})

db.connect(function(err) {
	if(err){
		console.error("Error! : "+err.stack);
		return;
	}
	console.log('Connected!');
  // connected! (unless `err` is set)
	var query = db.query('SELECT * FROM users', function(err,result,fields) {
  // Neat!
  	console.log(result[1]);
})
console.log(query.sql);
})

