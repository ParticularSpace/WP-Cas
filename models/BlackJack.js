// not in production yet for future development

const { Model, DataTypes } = require('sequelize') 
const sequelize = require('../config/connection');

class BlackjackGame extends Model {} // Defines the BlackjackGame model

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
        model: 'user', 
        key: 'id' 
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
    sequelize, 
    timestamps: true, 
    freezeTableName: true,
    underscored: true,
    modelName: 'blackjack_game', 
  }
);

module.exports = BlackjackGame; // Export the BlackjackGame model
