const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const CryptoJS = require("crypto-js");

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
      defaultValue: 1.00,
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
          wallet.encrypted_id = CryptoJS.AES.encrypt(wallet.id.toString(), process.env.CRYPTOJS_SECRET).toString();
          await wallet.save();
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
