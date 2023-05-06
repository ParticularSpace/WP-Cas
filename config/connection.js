const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
  'mvc_todos',
  'root',
  'password',
  {
    host: '127.0.0.1',
    dialect: 'mysql',
  }
);


module.exports = sequelize;