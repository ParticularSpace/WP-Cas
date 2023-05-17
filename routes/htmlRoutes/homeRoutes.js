const express = require('express');
const router = express.Router();
const withAuth = require('../../utils/auth');

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register');
});

// Dashboard
// router.get('/dashboard', withAuth, (req, res) => {
//   res.render('dashboard');
// });
router.get('/dashboard', withAuth, async (req, res) => {
  // const user = req.body;
  const {logged_in, user} = req.session;
  if (!logged_in) {
    res.render('login')
  }
  console.log('accountROutes', req.session)
  console.log('user', user)
  res.render('dashboard', {user});
});




module.exports = router;
