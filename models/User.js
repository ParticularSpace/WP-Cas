const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
  async checkPassword(loginPw) {
    return await bcrypt.compare(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], 
      },
    },
  },
  {
    hooks: {
      afterCreate: async (user, options) => {
        const wallet = await sequelize.models.Wallet.create({ user_id: user.id });
      },
    },
    sequelize,
    timestamps: false, 
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
