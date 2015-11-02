var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');

var app = express();

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

app.listen(3000);
console.log('server listening at port 3000');
