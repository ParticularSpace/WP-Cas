const router = require('express').Router();
const accountRoutes = require('./accountRoutes');

// Route for the home page
router.get('/', (req, res) => {
  res.render('index');
});

// Route for the login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Route for the register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Route for the blackjack page
router.get('/games', (req, res) => {
  res.render('games');
});

// Route for the account page
router.use('/account', accountRoutes);

module.exports = router;
