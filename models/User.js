const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection.js');

class User extends Model {
}


User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
       allowNull: false,
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'user',
  }
);

module.exports = User;