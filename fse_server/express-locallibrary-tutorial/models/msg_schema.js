var mng = require("mongoose");

var Schema = mng.Schema;

var msg_schema = new Schema({
	msg_id : Schema.Types.ObjectId,
	user_name : String,
	msg_content : String,
	msg_date : {type:Date, default:new Date().toISOString()}
})

module.exports = mng.model('msgs',msg_schema);