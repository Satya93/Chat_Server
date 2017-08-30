var mng = require("mongoose");

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

module.exports = mng.model('users',user_schema);