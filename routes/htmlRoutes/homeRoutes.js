const express = require('express');
const router = express.Router();
const withAuth = require('../../utils/auth');
const { User } = require('../../models');

router.get('/', async (req, res) => {
  res.render('dashboard');
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register');
});


module.exports = router;
