const sequelize = require('../config/connection');
const seedUsers = require('./user-seeds.js');
const seedWallet = require('./wallet-seeds.js');



const seedAll = async () => {
  await sequelize.sync({ force: true });
 
  await seedUsers();

  await seedWallet();

  process.exit(0);
};

seedAll();
