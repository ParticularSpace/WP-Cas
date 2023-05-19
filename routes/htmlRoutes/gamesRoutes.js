const router = require('express').Router();
const { Wallet, User } = require('../../models'); // Include User model
const withAuth = require('../../utils/auth');

router.get('/games', withAuth, async (req, res) => {
  try {
    // Find the wallet data
    const walletData = await Wallet.findOne({
      where: { user_id: req.session.user.id },
    });
    
    const wallet = walletData.get({ plain: true });

    // Find the user data
    const userData = await User.findByPk(req.session.user.id);
    const user = userData.get({ plain: true });

    // Render 'games' with user details and wallet balance
    res.render('games', {
      logged_in: req.session.logged_in, 
      profilePicture: user.profile_picture, 
      walletBalance: wallet.balance,
      username: user.username,
      
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving wallet balance' });
  }
});

module.exports = router;
