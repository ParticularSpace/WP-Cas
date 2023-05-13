const router = require('express').Router();
const walletRoutes = require('./walletRoute');
const myProfile = require('./myProfile');

router.use('/wallet', walletRoutes);
router.use('/user_profile', myProfile);

module.exports = router;
