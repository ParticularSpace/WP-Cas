const { Wallet } = require('../models');


const walletData = [
    {
        balance: 100.00,
        user_id: 1,
    }, 
    {
        balance: 200.00,
        user_id: 2,
    }, 
    {
        balance: 300.00,
        user_id: 3,
    },
];

const seedWallet = () => Wallet.bulkCreate(walletData);

module.exports = seedWallet;