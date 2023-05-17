// Importing the required dependencies
const router = require('express').Router(); // Using the Router module from Express
const gameRoutes = require('../htmlRoutes/gamesRoutes'); // Importing the 'gamesRoutes' module from the '../htmlRoutes' directory
const userRoutes = require('./userRoutes'); // Importing the 'userRoutes' module
const userProfile = require('./profileRoute'); // Importing the 'profileRoute' module

// Setting up routes for '/games' endpoint
router.use('/games', gameRoutes);

// Setting up routes for '/users' endpoint
router.use('/users', userRoutes);

// Setting up routes for '/profile' endpoint
router.use('/profile', userProfile);

module.exports = router; // Exporting the router for use in other files
