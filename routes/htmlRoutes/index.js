const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const gamesRoutes = require('./gamesRoutes');

router.use('/', homeRoutes);
router.use('/', gamesRoutes);

module.exports = router;
