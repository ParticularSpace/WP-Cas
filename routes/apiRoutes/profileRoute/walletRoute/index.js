// Importing the required dependencies
const router = require('express').Router(); // Using the Router module from Express
const myWallet = require('./myWallet'); // Importing the 'myWallet' module

// Setting up the router for '/user_wallet' endpoint
router.use('/user_wallet', myWallet);

module.exports = router; // Exporting the router for use in other files
