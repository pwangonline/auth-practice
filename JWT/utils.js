const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return {
    salt,
    hash,
  };
};

const validatePassword = (password, hash, salt) => {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
};

const issueJWT = (user, privKey) => {
  const id = user.id;
  const expiresIn = '1d';
  const payload = {
    sub: id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, privKey, {
    expiresIn,
    algorithm: 'RS256',
  });
  return {
    token: 'Bearer ' + signedToken,
    expiresIn,
  };
};

module.exports = {
  genPassword,
  validatePassword,
  issueJWT,
};
