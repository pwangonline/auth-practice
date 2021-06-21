const express = require('express');
const session = require('express-session');
const ensure = require('connect-ensure-login');
const FileStore = require('session-file-store')(session);
const passport = require('passport');

require('./passportConfig');
const db = require('./db');

const fileStoreOptions = {
  path: './sessions',
  ttl: 3600,
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(fileStoreOptions),
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res, next) => {
    // res.json(req.user);
    res.redirect('/profile');
  }
);

app.get('/register', (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

app.post('/register', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send('no username or password');
  }
  db.addNewUser({
    username: req.body.username,
    password: req.body.password,
  })
    .then((user) => {
      console.log({ user });
    })
    .catch((err) => {
      console.log({ err });
    })
    .finally(() => {
      res.redirect('/login');
    });
});

app.get('/profile', (req, res, next) => {
  //   if (ensure.ensureLoggedIn()) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.json(req.user);
  } else {
    res.send('<h1>You are not authenticated</h1>');
  }
});

app.get('/tracking', (req, res, next) => {
  console.log(req.session);
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 1;
  }
  res.send('<p>View count is: ' + req.session.viewCount + '</p>');
});

app.get('/logout', (req, res, next) => {
  req.logout();
  console.log('user: ', req.user);
  console.log('session: ', req.session);
  res.redirect('/login');
});

app.listen(3000);
console.log('server running at http://localhost:3000');
