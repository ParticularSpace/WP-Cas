const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes');
const apiRoutes = require('./apiRoutes');

// every '/' without /api will be handled by htmlRoutes
router.use('/', htmlRoutes);

// everything with '/api' will be handled by apiRoutes
router.use('/api', apiRoutes);

module.exports = router;
