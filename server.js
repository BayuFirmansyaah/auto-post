let express = require('express');
let app = express();
let routes = require('./routes');
const bodyParser = require('body-parser');
let upload = require('express-fileupload');
const importExcel = require('convert-excel-to-json');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port =  3000;
const controller = require('./controller');
let session = require('express-session');
var cookieSession = require('cookie-session')


app.set('trust proxy', 1) // trust first proxy
 
app.use(cookieSession({
  name: 'session',
  keys: 'auto-post',
  maxAge: 720 * 60 * 60 * 1000
}))

app.listen(port, () => {
    console.log(`Server Berhasil dijalankan di port`+port);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload());

routes(app);
app.use(express.static(__dirname + '/'));


   
