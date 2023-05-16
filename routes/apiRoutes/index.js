const router = require('express').Router(); 
const gameRoutes = require('../htmlRoutes/gamesRoutes'); 
const userRoutes = require('./userRoutes'); 
const userProfile = require('./profileRoute'); 

router.use('/games', gameRoutes); // Mount the gameRoutes module under the '/games' path
router.use('/users', userRoutes); // Mount the userRoutes module under the '/users' path
router.use('/profile', userProfile); // Mount the userProfile module under the '/profile' path

module.exports = router;
