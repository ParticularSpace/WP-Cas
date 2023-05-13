const { User } = require('../models');

const userData = [
    {
      username: 'johndoe',
      password: 'password123',
    },
    {
      username: 'janedoe',
      password: 'mypassword',
    },
    {
      username: 'mike123',
      password: 'securepass',
    },
];

const seedUser = () => User.bulkCreate(userData, {individualHooks: true,
    returning: true,
});

module.exports = seedUser;