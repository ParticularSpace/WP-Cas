const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
  'wp_db',
  'root',
  'password',
  {
    host: '127.0.0.1',
    dialect: 'mysql',
  }
);


module.exports = sequelize;