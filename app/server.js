var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var express = require('express');
var http = require('http');
var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var DB_URL = 'mongodb://localhost/citd';

server.listen(3000);
console.log('server listening at port 3000');

// EXPRESS CONFIGURATION

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
  secret: 'secret',
  // store: new MongoStore({ url: DB_URL }),
  resave: false,
  saveUninitialized: false
}));

function loggedIn(req, res, next) {
  if (!req.session.user)
    return res.redirect('/');
  next();
}

function isAdmin(req, res, next) {
  if (req.session.user.username !== 'admin')
    return res.redirect('/code');
  next();
}

function notLoggedIn(req, res, next) {
  if (req.session.user)
    return res.redirect('/code');
  next();
}

app.get('/', notLoggedIn, function (req, res) {
  res.render('login.html');
});

app.post('/', function (req, res) {
  if (req.body.username == 'admin' && req.body.password == 'admin') {
    req.session.user = {
      id: '123456',
      username: 'admin'
    };
    res.redirect('/admin');
  } else if (req.body.username == 'user1' && req.body.password == 'user1') {
    req.session.user = {
      id: '654321',
      username: 'user1'
    };
    res.redirect('/code');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
})

app.get('/code', loggedIn, function (req, res) {
  res.render('code.html', { user: req.session.user });
});

app.get('/admin', loggedIn, isAdmin, function (req, res) {
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

