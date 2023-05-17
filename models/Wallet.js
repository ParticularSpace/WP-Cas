const { Model, DataTypes } = require('sequelize'); // Import necessary Sequelize components
const sequelize = require('../config/connection'); // Import the Sequelize connection
const CryptoJS = require("crypto-js"); // Import the CryptoJS library for encryption

class Wallet extends Model {}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    encrypted_id: {
      type: DataTypes.STRING,
      allowNull: true, // Temporarily allow null
    },
    balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 1.00, // Sets a default value for the balance field
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user', // References the 'user' model
        key: 'id' // References the primary key of the 'user' model
      }
    },
  },
  {
    hooks: {
      afterSave: async (wallet, options) => {
        if (!wallet.encrypted_id) {
          wallet.encrypted_id = CryptoJS.AES.encrypt(wallet.id.toString(), process.env.CRYPTOJS_SECRET).toString(); // Encrypts the wallet ID using CryptoJS and a secret key
          await wallet.save(); // Saves the wallet with the encrypted ID
        }
      },
    },
    sequelize, // Connects the model to the Sequelize instance
    timestamps: false, // Disables timestamps for createdAt and updatedAt columns
    freezeTableName: true, // Prevents Sequelize from pluralizing the table name
    underscored: true, // Uses underscored naming convention for attributes
    modelName: 'wallet', // Sets the model name
  }
);

module.exports = Wallet; // Export the Wallet model