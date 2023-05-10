const sequelize = require('../config/connection');
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

const seedUsers = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedUsers();
