var mng = require("mongoose");
var schema = mng.schema();

var user_schema = new schema({
	user_name = String,
	user_password = String,
	user_date = {type:Date, default:Date().toISOString()}
})

var msg_schema = new schema({
	user_name = String,
	msg_content = String,
	msg_date = {type:Date, default:Date().toISOString()}
})