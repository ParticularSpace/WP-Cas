const { Model, DataTypes } = require('sequelize'); 
const sequelize = require('../config/connection'); 
const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing

class User extends Model {
  async checkPassword(loginPw) {
    return await bcrypt.compare(loginPw, this.password); // Compare the login password with the hashed password
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
      unique: true, // Ensures that each username is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], 
      },
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Connects the model to the Sequelize instance
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    modelName: 'user', 
  }
);

module.exports = User; 
