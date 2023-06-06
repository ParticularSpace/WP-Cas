const User = require('./User'); 
const Wallet = require('./Wallet'); 
const BlackJack = require('./BlackJack'); 
const Friend = require('./Friend');  // Import the Friend model

// Defines the associations between User and Wallet models
User.hasOne(Wallet, {
  foreignKey: 'user_id', 
  onDelete: 'CASCADE', 
});

Wallet.belongsTo(User, {
  foreignKey: 'user_id', 
});

// Defines the associations between User and BlackjackGame models
User.hasMany(BlackJack, {
  foreignKey: 'user_id', 
  onDelete: 'CASCADE', 
});

BlackJack.belongsTo(User, {
  foreignKey: 'user_id', 
});

// Define associations between User and Friend models
User.hasMany(Friend, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Friend.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Friend, {
  foreignKey: 'friend_id',
  onDelete: 'CASCADE',
});

Friend.belongsTo(User, {
  foreignKey: 'friend_id',
});

module.exports = {
  User, Wallet, BlackJack, Friend
};


