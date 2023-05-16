const { Model, DataTypes } = require('sequelize'); 
const sequelize = require('../config/connection'); 

class BlackjackGame extends Model {} // Define the BlackjackGame model

BlackjackGame.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user', // References the 'user' model
        key: 'id' // References the primary key of the 'user' model
      }
    },
    bet: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_won_lost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    time_played: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Sets the default value to the current date and time
    },
    remaining_deck: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize, // Connects the model to the Sequelize instance
    timestamps: true, // Enables timestamps for createdAt and updatedAt columns
    freezeTableName: true, // Prevents Sequelize from pluralizing the table name
    underscored: true, // Uses underscored naming convention for attributes
    modelName: 'blackjack_game', // Sets the model name
  }
);

module.exports = BlackjackGame; // Export the BlackjackGame model
