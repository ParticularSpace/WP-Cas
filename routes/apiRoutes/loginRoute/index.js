const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Placeholder user data
const userData = {
  username: 'test',
  password: 'test',
  balance: 1000
};

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON data
app.use(express.json());

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  // Check if the username and password match the stored user data
  if (username === userData.username && password === userData.password) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
  console.log(userData);
});

// Route to get user information
app.get('/user', (req, res) => {
  res.json({ username: userData.username });
});

// Route to change password
app.put('/user/password', (req, res) => {
  const { password } = req.body;
  userData.password = password;
  res.json({ message: 'Password changed successfully' });
});

// Route to delete account
app.delete('/user', (req, res) => {
  // Perform necessary actions to delete the user account
  res.json({ message: 'Account deleted successfully' });
});

// Route to get user balance
app.get('/user/balance', (req, res) => {
  res.json({ balance: userData.balance });
});

module.exports = app;