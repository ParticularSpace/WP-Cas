require('dotenv').config(); 

const { Sequelize } = require('sequelize'); 

// Create a new Sequelize instance with database configuration for Heroku deployment

// const sequelize = process.env.DATABASE_URL
//     ? new Sequelize(process.env.DATABASE_URL, {
//         dialect: 'postgres',
//         protocol: 'postgres',
//         dialectOptions: {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false
//             }
//         }
//     })
//     : new Sequelize(database, username, password, config);


// Create a new Sequelize instance with database configuration for local deployment

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    dialect: process.env.DB_DIALECT, 
  }
);

module.exports = sequelize;
