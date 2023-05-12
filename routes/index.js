const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes');
const apiRoutes = require('./apiRoutes');
const userRoutes = require('./apiRoutes/userRoutes');




// every '/' without /api will be handled by htmlRoutes
// /users
router.use(htmlRoutes);

// everything with '/api' will be handled by apiRoutes
// /api/users
router.use('/api', apiRoutes);
router.use('/api/users', userRoutes);

module.exports = router;