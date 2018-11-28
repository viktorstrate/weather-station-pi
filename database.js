var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});


module.exports = (cb) => {
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MYSQL Server!");
    cb(con)
  });
}