const express = require('express');
const router = express.Router();
const withAuth = require('../../utils/auth');

// Login Page
router.get('/login', (req, res) => {
  res.render('login'); // Render the 'login' view
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register'); // Render the 'register' view
});

// Dashboard
router.get('/dashboard', withAuth, (req, res) => {
  res.render('dashboard'); // Render the 'dashboard' view if the user is authenticated
});

module.exports = router;
