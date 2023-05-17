// Importing the required dependencies
const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Wallet } = require('../../models');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const withAuth = require('../../utils/auth');
const multer = require('multer');
const path = require('path');

// Setting up the storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The destination directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // The filename for the uploaded file, using the current timestamp concatenated with the original file extension
  }
});


// Setting up the multer middleware with the provided storage configuration
const upload = multer({ storage: storage });


// Register route GOOD
router.post('/register', async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction using the sequelize connection

  try {
    const saltRounds = await bcrypt.genSalt(); // Generate a salt for password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // Hash the password using bcrypt
    const userData = await User.create({
      username: req.body.username,
      password: hashedPassword,
    }, { transaction: t }); // Create a new user record with the provided username and hashed password within the transaction

    // Create wallet with a placeholder encrypted_id
    const walletData = await Wallet.create({
      balance: 1.00,
      user_id: userData.id,
      encrypted_id: 'placeholder',
    }, { transaction: t }); // Create a new wallet record with the provided balance, user ID, and a placeholder encrypted ID within the transaction


    // Update the wallet with the real encrypted_id
    console.log('Before walletData.save');
    console.log('walletData.id:', walletData.id);
    console.log('process.env.CRYPTOJS_SECRET:', process.env.CRYPTOJS_SECRET);

    walletData.encrypted_id = CryptoJS.AES.encrypt(walletData.id.toString(), process.env.CRYPTOJS_SECRET).toString();
    await walletData.save({ transaction: t }); // Encrypt the wallet ID using CryptoJS and the provided secret, then save the updated wallet data within the transaction
    console.log('After walletData.save');

    await t.commit(); // Commit the transaction

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData); // Respond with the created user data
    });
  } catch (err) {
    await t.rollback(); // Rollback the transaction in case of an error
    res.status(400).json({ message: 'An error occurred while registering' });
  }
});

// Login route GOOD
router.post('/login', async (req, res) => {
  console.log('LN: 57 - req.body:', req.body);
  try {
    const { username, password } = req.body;
    console.log('LN: 59 - username:', username);

    const userData = await User.findOne({
      where: { username }, // Find the user with the provided username
      include: [{ model: Wallet }] // Include the Wallet model in the query
    });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect username, please try again' }); // Respond with an error message if the user doesn't exist
      return;
    }

    const validPassword = await userData.checkPassword(password); // Check if the provided password matches the user's stored password

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password, please try again' }); // Respond with an error message if the password is incorrect
      return;
    }

    req.session.user = {
      id: userData.id,
      username: userData.username,
      profilePicture: `http://localhost:3001/${userData.profile_picture}`, // Set the session user data including the user ID, username, and profile picture URL
    };

    req.session.logged_in = true; // Set the session as logged in

    console.log(req.session);

    res.json({ user: userData, message: 'ok' }); // Respond with the user data and a success message

  } catch (err) {
    console.error(err.message);
    res.status(400).json(err); // Respond with an error message if an error occurs during the login process
  }
});



// Logout route CHECK THIS
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end(); // Destroy the session and respond with a 204 status code
    });
  } else {
    res.status(404).end(); // If the user is not logged in, respond with a 404 status code
  }
});

// Change Password route GOOD
router.put('/update/password', withAuth, async (req, res) => {

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ where: { id: req.session.user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // If the user is not found, respond with an error message
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password); // Check if the provided current password matches the user's stored password

    console.log('LN: 128 - validPassword:', validPassword)

    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' }); // If the current password is incorrect, respond with an error message
    }

    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds); // Hash the new password

    await user.update({ password: hashedPassword }); // Update the user's password

    res.json({ message: 'Password updated successfully' }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the password' }); // If an error occurs during the password update, respond with an error message
  }
});


// Change username route GOOD
router.put('/update/username', withAuth, async (req, res) => {
  try {
    const { password, newUsername } = req.body;
    const user = await User.findOne({ where: { id: req.session.user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // If the user is not found, respond with an error message
    }

    const validPassword = await bcrypt.compare(password, user.password); // Check if the provided password matches the user's stored password

    if (!validPassword) {
      return res.status(400).json({ error: 'Password is incorrect' }); // If the password is incorrect, respond with an error message
    }

    await user.update({ username: newUsername }); // Update the user's username

    res.json({ message: 'Username updated successfully' }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the username' }); // If an error occurs during the username update, respond with an error message
  }
});

// Change Profile Picture route
router.put('/update/profile-picture', withAuth, upload.single('profilePicture'), async (req, res) => {
  console.log('req.file:', req.file);
  try {
    const user = await User.findOne({ where: { id: req.session.user.id } }); // Find the user by their ID

    console.log('user: LN - 181', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // If the user is not found, respond with an error message
    }

    const newPicturePath = req.file.path; // Get the new profile picture's file path

    req.session.user.profilePicture = `http://localhost:3001/${newPicturePath}`; // Update the user's profile picture URL in the session

    console.log('newPicturePath:', newPicturePath)

    await user.update({ profile_picture: newPicturePath }); // Update the user's profile picture path in the database

    res.json({ message: 'Profile picture updated successfully', newPictureUrl: `http://localhost:3001/${newPicturePath}` }); // Respond with a success message and the new profile picture URL
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the profile picture' }); // If an error occurs during the profile picture update, respond with an error message
  }
});

module.exports = router;
