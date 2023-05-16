const { Model, DataTypes } = require('sequelize'); 
const sequelize = require('../config/connection'); 
const bcrypt = require('bcrypt'); 

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
      unique: true, // Ensures that the username is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // Validates that the password must be at least 8 characters long
      },
    },
  },
  {
    sequelize, // Connects the model to the Sequelize instance
    timestamps: false, // Disables timestamps for createdAt and updatedAt columns
    freezeTableName: true, // Prevents Sequelize from pluralizing the table name
    underscored: true, // Uses underscored naming convention for attributes
    modelName: 'user', // Sets the model name
  }
);

module.exports = User; 
