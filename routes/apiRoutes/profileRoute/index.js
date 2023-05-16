const router = require('express').Router(); 
const walletRoutes = require('./walletRoute'); 
const myProfile = require('./myProfile'); 

router.use('/wallet', walletRoutes); // Mount the walletRoutes module under the '/wallet' path
router.use('/user_profile', myProfile); // Mount the myProfile module under the '/user_profile' path

module.exports = router; 
