const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const gamesRoutes = require('./gamesRoutes');
const accountRoutes = require('./accountRoutes');

router.use('/', homeRoutes);
router.use('/', gamesRoutes);
router.use('/', accountRoutes);

module.exports = router;
