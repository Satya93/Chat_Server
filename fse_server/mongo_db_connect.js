var mng = require("mongoose")
var db = mng.connection;
mng.connect('mongodb://localhost/fse_chat')

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected!")
});