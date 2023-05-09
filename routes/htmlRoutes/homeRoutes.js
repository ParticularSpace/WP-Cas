const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    // If the user is logged in, pass their data to the template
    if (req.session.logged_in) {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
      });

      const user = userData.get({ plain: true });

      res.render('index', {
        ...user,
        logged_in: req.session.logged_in,
      });
    } else {
      // If the user is not logged in, render the index template without user data
      res.render('index');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  // Otherwise, render the login template
  res.render('login');
});

router.get('/register', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  // Otherwise, render the register template
  res.render('register');
});

module.exports = router;
