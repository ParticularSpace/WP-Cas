
const router = require('express').Router();
const { Wallet, User, BlackJack } = require('../../models');
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
      walletBal: wallet.balance,
      username: user.username,
      showCoin: true
      
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving wallet balance' });
  }
});

// Game history Route using the BlackJack model with the User model to track the user's game history and info about each game 
router.get('/game-history', withAuth, async (req, res) => {
  try {
    const gameData = await BlackJack.findAll({
      where: { user_id: req.session.user.id },
      include: [{ model: User }],
    });

    const gameHistory = gameData.map((game) => game.get({ plain: true })); // Serialize the game data

    console.log('SUCESS in /game-history games:', gameHistory);

    res.render('account', {
      logged_in: req.session.logged_in,
      gameHistory: gameHistory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving game history' });
  }
});


module.exports = router;
