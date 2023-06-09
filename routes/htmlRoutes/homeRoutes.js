const express = require('express');
const router = express.Router();
const withAuth = require('../../utils/auth');
const { User, Friend, BlackJack } = require('../../models');

router.get('/', async (req, res) => {
  try {
    res.render('home', { showNav: true, showCoin: false });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login', { showNav: true, showCoin: false });
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/friends', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user.id, {
      attributes: { exclude: ['password'] },
    });
    const user = userData.get({ plain: true });

    const friendData = await Friend.findAll({
      where: {
        user_id: req.session.user.id,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const friends = friendData.map((friend) =>
      friend.get({ plain: true })
    );

    const blackjackData = await BlackJack.findAll({
      where: {
        user_id: req.session.user.id,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(blackjackData, 'blackjack data', 'THIS IS MY MEGA /FRIENDS ROUTE DATA');

    const recentGames = blackjackData.map((blackjack) =>
      blackjack.get({ plain: true })
    );

  console.log(recentGames, 'recent games', friends, 'friends',  user, 'user', 'THIS IS MY MEGA /FRIENDS ROUTE DATA');
  
    res.render('friends', {
      ...user,
      friends,
      recentGames,
      showNav: true,
      showCoin: true,
      logged_in: true,
    });
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
