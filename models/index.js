const User = require('./User'); 
const Wallet = require('./Wallet'); 
const BlackjackGame = require('./BlackJack'); 

// Defines the associations between User and Wallet models
User.hasOne(Wallet, {
  foreignKey: 'user_id', // Specifies the foreign key in the Wallet model
  onDelete: 'CASCADE', // Specifies the deletion behavior when a User is deleted
});

Wallet.belongsTo(User, {
  foreignKey: 'user_id', 
});

// Defines the associations between User and BlackjackGame models
User.hasMany(BlackjackGame, {
  foreignKey: 'user_id', 
  onDelete: 'CASCADE', 
});

// for future development
BlackjackGame.belongsTo(User, {
  foreignKey: 'user_id', 
});

module.exports = {
  User, Wallet 
};
