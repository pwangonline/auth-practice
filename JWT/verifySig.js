const jwt = require('jsonwebtoken');
const fs = require('fs');

const PRIV_KEY = fs.readFileSync(__dirname + '/keys/a.pem', 'utf8');
const PUB_KEY = fs.readFileSync(__dirname + '/keys/a_pub.pem', 'utf8');

const payloadObj = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
  iat: 1516239022,
};

const signedJWT = jwt.sign(payloadObj, PRIV_KEY, { algorithm: 'RS256' });

console.log(signedJWT);

jwt.verify(signedJWT, PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {
  if (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Whoops, your token has expired!');
    }
    if (err.name === 'JsonWebTokenError') {
      console.log('That JWT is malformed!');
    }
    return;
  }
  console.log('Your JWT was successfully validated!');
  // Both should be the same
  console.log({ payload });
  console.log({ payloadObj });
});
