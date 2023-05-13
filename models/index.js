const User = require('./User');
const Wallet = require('./Wallet');
const BlackjackGame = require('./BlackJack');

User.hasOne(Wallet, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Wallet.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(BlackjackGame, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

BlackjackGame.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = {
  User,
  Wallet,
  BlackjackGame,
};
