const router = require('express').Router(); 
const sequelize = require('../../config/connection'); 
const { User, Wallet } = require('../../models');
const bcrypt = require('bcrypt'); 
const CryptoJS = require('crypto-js'); 
require('dotenv').config();

// Register route
router.post('/register', async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const saltRounds = await bcrypt.genSalt(); // Generate a salt for password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // Hash the password
    const userData = await User.create({
      username: req.body.username,
      password: hashedPassword,
    }, { transaction: t }); // Create a new user with the hashed password

    // Create wallet with a placeholder encrypted_id
    const walletData = await Wallet.create({
      balance: 1.00,
      user_id: userData.id,
      encrypted_id: 'placeholder',
    }, { transaction: t });

    // Update the wallet with the real encrypted_id
    walletData.encrypted_id = CryptoJS.AES.encrypt(walletData.id.toString(), process.env.CRYPTOJS_SECRET).toString();
    await walletData.save({ transaction: t });

    await t.commit(); // Commit the transaction

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    await t.rollback(); // Rollback the transaction
    res.status(400).json({ message: 'An error occurred while registering' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await User.findOne({
      where: { username },
      include: [{ model: Wallet }],
    });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect username, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.user = {
      id: userData.id,
      username: userData.username,
    };

    req.session.logged_in = true;

    res.json({ user: userData, message: 'ok' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json(err);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router; 
