const router = require('express').Router();
const gameRoutes = require('./gameRoutes');
const userRoutes = require('./userRoutes');


router.use('/games', gameRoutes);
router.use('/users', userRoutes);

module.exports = router;