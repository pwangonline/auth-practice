const utils = require('./utils');

const records = [
  {
    id: 1111,
    username: 'jack',
    password: 'secret',
    displayName: 'Jack',
    emails: [{ value: 'jack@example.com' }],
    salt: '4c5e1749d6783f63b4f4b1a888dcaa053d232cb52db7b5562dbde3490626183c',
    hash: '56a39bbb0e9b32d129a665fd68628fc4d307b2271012d7b5c1c56bafbe763f43fc6d1987a0251093503ce492efd92da83f43ee1ded56b1f8f44e50f6d4622644',
  },
  {
    id: 2222,
    username: 'jill',
    password: 'birthday',
    displayName: 'Jill',
    emails: [{ value: 'jill@example.com' }],
    salt: 'c6a11640f04215738e3dc4df76c87e9dc10ada2b840d4ed2d45e45d0dc854a67',
    hash: 'fc17f83934511f8a43313e255ca539cb8793b7d5380aa5fb3a975c9f611c4198b4fe36ab6aecb605ade954c967266a963a131b2b54b3229d68dad59918ac4620',
  },
];

const addNewUser = (data) => {
  console.log(`findByUsername: ${JSON.stringify(data)}`);
  return new Promise((res, rej) => {
    const { hash, salt } = utils.genPassword(data.password);
    const id = Date.now();
    records.push({
      id,
      username: data.username,
      salt,
      hash,
    });
    res(findById(id));
  });
};

const findByUsername = (username) => {
  console.log(`findByUsername: ${JSON.stringify(username)}`);
  return new Promise((res, rej) => {
    for (let i = 0; i < records.length; i++) {
      const user = records[i];
      if (user.username === username) {
        res(user);
      }
    }
    res(null);
  });
};

const findById = (id) => {
  console.log(`findById: ${id}`);
  return new Promise((res, rej) => {
    for (let i = 0; i < records.length; i++) {
      const user = records[i];
      if (user.id === id) {
        res(user);
      }
    }
    res(null);
  });
};

module.exports = {
  findByUsername,
  findById,
  addNewUser,
};
