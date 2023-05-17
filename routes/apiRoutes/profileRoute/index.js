// Importing the required dependencies
const router = require('express').Router(); // Using the Router module from Express
const walletRoutes = require('./walletRoute'); // Importing the 'walletRoute' module
const myProfile = require('./myProfile'); // Importing the 'myProfile' module

// Setting up routes for '/wallet' endpoint
router.use('/wallet', walletRoutes);

// Setting up routes for '/user_profile' endpoint
router.use('/user_profile', myProfile);

module.exports = router; // Exporting the router for use in other files
