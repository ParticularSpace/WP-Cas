const { Model, DataTypes } = require('sequelize'); 
const sequelize = require('../config/connection'); 
const CryptoJS = require("crypto-js"); // Import the CryptoJS library for encryption

class Wallet extends Model {}

// set wallet attributes
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
      allowNull: true, 
    },
    balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 5000,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user', 
        key: 'id' 
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
    sequelize, 
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    modelName: 'wallet', 
  }
);

module.exports = Wallet; 