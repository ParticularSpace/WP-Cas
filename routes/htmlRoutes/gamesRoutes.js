const router = require('express').Router(); 
const { Wallet } = require('../../models'); 
const withAuth = require('../../utils/auth'); 

router.get('/games', withAuth, (req, res) => {
  res.render('games'); // Render the 'games' view if the user is authenticated
});

router.get('/games', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      include: {
        model: Wallet,
        attributes: ['balance']
      }
    });

    const walletBalance = userData.wallet.balance; // Get the wallet balance from the user's data

    res.render('fundz', { walletBalance }); // Render the 'fundz' view and pass the wallet balance as data
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving wallet balance' }); // Return a 500 status code and error message if an error occurs
  }
});

module.exports = router; 