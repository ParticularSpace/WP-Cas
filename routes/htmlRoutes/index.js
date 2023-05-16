const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const gamesRoutes = require('./gamesRoutes');
const accountRoutes = require('./accountRoutes');

router.use('/', homeRoutes); // Mount the routes defined in homeRoutes at the root path ('/')
router.use('/', gamesRoutes); // Mount the routes defined in gamesRoutes at the root path ('/')
router.use('/', accountRoutes); // Mount the routes defined in accountRoutes at the root path ('/')

module.exports = router;
