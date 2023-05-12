const router = require('express').Router();
const { User } = require('../../../models');

// GET /api/account
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({
      username: user.username,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});


// POST /api/account/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Return the user's information and session details
    return res.status(200).json({
      message: 'Login successful',
      username: user.username,
      balance: user.balance,
      sessionId: req.sessionID,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// POST /api/account/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, balance } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Create a new user
    const newUser = await User.create({
      username,
      password,
      balance: parseFloat(balance),
    });

    // Return the new user's information
    return res.status(201).json({
      message: 'User created successfully',
      username: newUser.username,
      balance: newUser.balance,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE /api/account/delete
router.delete('/delete', async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user account
    await user.destroy();

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// GET /api/account/balance
router.get('/balance', async (req, res) => {
  try {
    const { username } = req.query;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;