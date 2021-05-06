let express = require('express');
let app = express();
let routes = require('./routes');
const bodyParser = require('body-parser');
let upload = require('express-fileupload');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const importExcel = require('convert-excel-to-json');
let fs = require('fs');
let jf = require('jsonfile'); //jsonfile module

io.on('connection', function(socket) {
    socket.emit('log',JSON.parse(fs.readFileSync('./log.json','utf-8')));
    fs.watch("./log.json", function(event, fileName){
        jf.readFile('./log.json', function(err, data) {
            var data = data; 
            socket.emit('log',data);
        })
    })

    socket.emit('logs',JSON.parse(fs.readFileSync('./logs.json','utf-8')));
    fs.watch("./logs.json", function(event, fileName){
        jf.readFile('./logs.json', function(err, data) {
            var data = data; 
            socket.emit('logs',data);
        })
    })

    socket.emit('crawl', JSON.parse(fs.readFileSync('./crawl.json', 'utf-8')));
    fs.watch("./crawl.json", function (event, fileName) {
        jf.readFile('./crawl.json', function (err, data) {
            var data = data;
            socket.emit('crawl', data);
        })
    })
      
});


server.listen(3000);


app.set('trust proxy', 1) // trust first proxy
 
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'100mb'}));

app.use(upload());

routes(app);
app.use(express.static(__dirname + '/'));


   
