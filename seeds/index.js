const sequelize = require('../config/connection');
const seedUser = require('./user-seeds');
const seedWallet = require('./wallet-seeds');



const seedAll = async () => {
  await sequelize.sync({ force: true });
 
  await seedUser();

  await seedWallet();

  process.exit(0);
};

seedAll();
