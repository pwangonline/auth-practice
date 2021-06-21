const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const utils = require('./utils');
const db = require('./db');

const localStrategy = new Strategy((username, password, cb) => {
  db.findByUsername(username)
    .then((user) => {
      if (!user || !utils.validatePassword(password, user.hash, user.salt)) {
        return cb(null, false);
      }
      console.log({ user });
      return cb(null, user);
    })
    .catch((err) => {
      console.log({ err });
      cb(err);
    });
});

passport.serializeUser((user, cb) => {
  console.log('serializeUser: ', user.id);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log('deserializeUser: ', id);
  db.findById(id)
    .then((user) => {
      cb(null, user);
    })
    .catch((err) => {
      console.log({ err });
      cb(err);
    });
});

passport.use(localStrategy);
