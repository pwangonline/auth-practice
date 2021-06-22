const utils = require('./utils');

const records = [
  {
    id: 1111,
    username: 'jack',
    password: 'secret',
    displayName: 'Jack',
    emails: [{ value: 'jack@example.com' }],
  },
  {
    id: 2222,
    username: 'jill',
    password: 'birthday',
    displayName: 'Jill',
    emails: [{ value: 'jill@example.com' }],
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
