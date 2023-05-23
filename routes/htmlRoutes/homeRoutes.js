const express = require('express');
const router = express.Router();
const withAuth = require('../../utils/auth');
const { User } = require('../../models');

router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user.id);
    const user = userData.get({ plain: true });
    res.render('dashboard', {
      ...user,
      logged_in: req.session.logged_in,
      showNav: true,
      showCoin: true,
    });
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


module.exports = router;
