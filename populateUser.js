var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;

var DB_URL = 'mongodb://localhost/citd';

var users = [
  { username: 'admin' },
  { username: 'user1' },
  { username: 'user2' },
  { username: 'user3' },
  { username: 'user4' },
  { username: 'user5' },
  { username: 'user6' },
  { username: 'user7' },
  { username: 'user8' },
  { username: 'user9' },
  { username: 'user10' },
  { username: 'user11' },
];

users = users.map(function (user) {
  user.id = crypto.randomBytes(20).toString('hex').substring(0, 10);
  user.password = crypto.randomBytes(20).toString('hex').substring(0, 6);
  user.code = '';
  return user;
});

MongoClient.connect(DB_URL, function (err, db) {
  if (err) return console.error(err);

  db.collection('codes').deleteMany({}, function (err, results) {
    db.collection('codes').insert(users, function () {
      console.log('Populate done!');
      db.close();
    });
  });

});
