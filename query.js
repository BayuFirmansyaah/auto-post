const mysql = require('mysql')
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "autopost"

});
function getItem(req){
    db.query("SELECT * FROM item WHERE id_user=?", [req.params.id_user], function (err, row) {
       if (err) console.log(err);
       return row;
   })
}

module.exports = {getItem};