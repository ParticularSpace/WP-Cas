const router = require('express').Router();
const myWallet = require('./myWallet')

router.use('/user_wallet', myWallet);

module.exports = router;