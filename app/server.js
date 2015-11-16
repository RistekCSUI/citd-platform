var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var express = require('express');
var http = require('http');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

server.listen(3000);
console.log('server listening at port 3000');

// EXPRESS CONFIGURATION
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.render('login.html');
});

app.get('/code', function (req, res) {
  res.render('code.html');
});

app.get('/admin', function (req, res) {
  res.render('admin.html');
});

// SOCKET CONFIGURATION
io.on('connection', function (socket) {
  socket.on('code save', function (data) {
    socket.emit('save response', { success: true });
    io.emit('code update', data);
  });

  socket.on('competition end', function () {
    io.emit('competition end');
  });
});

