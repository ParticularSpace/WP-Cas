const router = require('express').Router();
const { Wallet } = require('../../models');
const withAuth = require('../../utils/auth'); 

router.get('/games', withAuth, (req, res) => {
    res.render('games');
});

router.get('/games', withAuth, async (req, res) => {
   try{
        const userData = await User.findByPk(req.session.user_id, {
            include: {
                model: Wallet,
                attributes: ['balance']
            }
        });

        const walletBalance = userData.wallet.balance;

        res.render('fundz', {walletBalance});

   }
   catch (err) {
    res.status(500).json({ message: 'Error retrieving wallet balance' });
   }
    
});

module.exports = router;
