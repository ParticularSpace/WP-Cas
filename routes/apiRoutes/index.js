const router = require('express').Router();
const gameRoutes = require('../htmlRoutes/gamesRoutes');
const userRoutes = require('./userRoutes');
const userProfile = require('./profileRoute');


router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/profile', userProfile);

module.exports = router;