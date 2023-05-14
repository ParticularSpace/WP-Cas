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

router.get('/dashboard', (req, res) => {
  res.render('dashboard')
  });

module.exports = router;
