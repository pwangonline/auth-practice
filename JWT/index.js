const fs = require('fs');
const express = require('express');
const passport = require('passport');

const db = require('./db');
const utils = require('./utils');

const PRIV_KEY = fs.readFileSync(__dirname + '/keys/a.pem', 'utf8');
const PUB_KEY = fs.readFileSync(__dirname + '/keys/a_pub.pem', 'utf8');

require('./passportConfig')(passport, PUB_KEY);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

app.get('/login-success', (req, res, next) => {
  console.log({ session: req.session });
  res.send('You successfully logged in.');
});

app.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

app.post('/login', (req, res, next) => {
  db.findByUsername(req.body.username)
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: 'could not find user' });
      }
      const tokenObject = utils.issueJWT(user, PRIV_KEY);
      res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err.toString() });
    });
});

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
    });
  }
);

app.listen(3000);
console.log('server running at http://localhost:3000');
