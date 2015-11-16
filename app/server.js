var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var express = require('express');
var http = require('http');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var DB_URL = 'mongodb://localhost/citd';
var MongoClient = require('mongodb').MongoClient;

server.listen(3000);
console.log('server listening at port 3000');

// Connect to database
MongoClient.connect(DB_URL, function (err, db) {
  if (err) return console.error(err);

  // EXPRESS CONFIGURATION
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'static')));

  app.use(session({
    secret: 'secret',
    store: new MongoStore({ url: DB_URL }),
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
    db.collection('codes')
      .findOne({ username: req.body.username }, function (err, user) {
        if (err) return res.json(err);

        if (user.password === req.body.password) {
          req.session.user = {
            id: user.id,
            username: user.username,
            code: user.code
          };

          if (user.username === 'admin')
            return res.redirect('/admin');
          else return res.redirect('/code');
        } else {
          return res.send('Login failed!');
        }
      });
  });

  app.get('/logout', function (req, res) {
    delete req.session.user;
    res.redirect('/');
  })

  app.get('/code', loggedIn, function (req, res) {
    db.collection('codes')
      .findOne({ username: req.session.user.username }, function (err, user) {
        if (err) return res.json(err);
        res.render('code.html', { user: user });
      });
  });

  app.get('/admin', loggedIn, isAdmin, function (req, res) {
    db.collection('codes')
      .find({ username: { $ne: 'admin' } })
      .sort({ id: 1 })
      .toArray(function (err, users) {
        if (err) return res.json(err);

        users = users.map(function (user) {
          user.code = user.code.replace(/\n/g, '');
          return user;
        });
        console.log(users);
        res.render('admin.html', { users: users });
      });
  });

  // SOCKET CONFIGURATION
  io.on('connection', function (socket) {
    socket.on('code save', function (data) {
      db.collection('codes')
        .updateOne({ id: data.userId }, { $set: { code: data.code } }, function (err, results) {
          if (err) {
            socket.emit('save response', { success: false });
            return console.err(err);
          }

          socket.emit('save response', { success: true });
          io.emit('code update', data);
        });
    });

    socket.on('competition end', function () {
      io.emit('competition end');
    });
  });

});
