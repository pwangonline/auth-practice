const base64 = require('base64url');
const crypto = require('crypto');
const signatureFunction = crypto.createSign('RSA-SHA256');
const verifyFunction = crypto.createVerify('RSA-SHA256');
const fs = require('fs');

const PRIV_KEY = fs.readFileSync(__dirname + '/keys/a.pem', 'utf8');
const PUB_KEY = fs.readFileSync(__dirname + '/keys/a_pub.pem', 'utf8');

const headerObj = {
  alg: 'RS256',
  typ: 'JWT',
};

const payloadObj = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
  iat: 1516239022,
};

// sign

const headerStr = JSON.stringify(headerObj);
const payloadStr = JSON.stringify(payloadObj);

const base64UrlHeader = base64(headerStr);
const base64UrlPayload = base64(payloadStr);

signatureFunction.write(base64UrlHeader + '.' + base64UrlPayload);
signatureFunction.end();

const signatureBase64 = signatureFunction.sign(PRIV_KEY, 'base64');

console.log({ signatureBase64 });

const signatureBase64Url = base64.fromBase64(signatureBase64);

console.log({ signatureBase64Url });

// verify

const JWT = `${base64UrlHeader}.${base64UrlPayload}.${signatureBase64Url}`;

const jwtHeader = JWT.split('.')[0];
const jwtPayload = JWT.split('.')[1];
const jwtSignature = JWT.split('.')[2];

verifyFunction.write(jwtHeader + '.' + jwtPayload);
verifyFunction.end();

const jwtSignatureBase64 = base64.toBase64(jwtSignature);

const signatureIsValid = verifyFunction.verify(
  PUB_KEY,
  jwtSignatureBase64,
  'base64'
);

console.log({ signatureIsValid });
