const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('./db');
// const utils = require('./utils');

module.exports = (passport, PUB_KEY) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
  };
  const jwtStrategy = new JwtStrategy(options, (jwt_payload, cb) => {
    // Since we are here, the JWT is valid!
    db.findById(jwt_payload.sub)
      .then((user) => {
        // if (!user || !utils.validatePassword(password, user.hash, user.salt)) {
        //   return cb(null, false);
        // }
        return cb(null, user);
      })
      .catch((err) => {
        cb(err);
      });
  });
  passport.use(jwtStrategy);
};
