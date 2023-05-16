const User = require('./User'); 
const Wallet = require('./Wallet'); 
const BlackjackGame = require('./BlackJack'); 

// Define the associations between User and Wallet models
User.hasOne(Wallet, {
  foreignKey: 'user_id', // Specifies the foreign key in the Wallet model
  onDelete: 'CASCADE', // Specifies the deletion behavior when a User is deleted
});

Wallet.belongsTo(User, {
  foreignKey: 'user_id', // Specifies the foreign key in the Wallet model
});

// Define the associations between User and BlackjackGame models
User.hasMany(BlackjackGame, {
  foreignKey: 'user_id', // Specifies the foreign key in the BlackjackGame model
  onDelete: 'CASCADE', // Specifies the deletion behavior when a User is deleted
});

BlackjackGame.belongsTo(User, {
  foreignKey: 'user_id', // Specifies the foreign key in the BlackjackGame model
});

module.exports = {
  User, Wallet 
};
