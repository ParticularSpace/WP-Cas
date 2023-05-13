const router = require('express').Router();
const gameRoutes = require('../htmlRoutes/gamesRoutes');
const userRoutes = require('./userRoutes');
const walletRoutes = require('./walletRoute');


router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);

module.exports = router;