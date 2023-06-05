// not in production yet for future development

const { Model, DataTypes } = require('sequelize') 
const sequelize = require('../config/connection');

class BlackJack extends Model {} // Defines the BlackjackGame model

BlackJack.init(
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
    bet_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    gameOutcome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_won_lost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remaining_deck: {
      type: DataTypes.TEXT,
      allowNull: true,
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

module.exports = BlackJack; // Export the BlackjackGame model
