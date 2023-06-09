// Importing the required dependencies
const router = require('express').Router(); 
const sequelize = require('../../config/connection');
const { User, Wallet, BlackJack } = require('../../models'); // models
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const withAuth = require('../../utils/auth'); // auth middleware
const upload = require('../../config/s3'); // s3 middleware

const { generateResponse } = require('../../utils/openAIService'); // AI middleware

// AWS S3 bucket configuration
const bucketName = process.env.AWS_S3_BUCKET; 
const region = process.env.AWS_REGION; 


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

    // Create wallet with a placeholder encrypted_id to ensure there is a unique encrypted_id for each user before the wallet is updated with the real encrypted_id
    const walletData = await Wallet.create({
      balance: 1.00,
      user_id: userData.id,
      encrypted_id: 'placeholder',
    }, { transaction: t }); // Create a new wallet record with the provided balance, user ID, and a placeholder encrypted ID within the transaction


    // Update the wallet with the real encrypted_id
    walletData.encrypted_id = CryptoJS.AES.encrypt(walletData.id.toString(), process.env.CRYPTOJS_SECRET).toString();
    await walletData.save({ transaction: t }); // Encrypt the wallet ID using CryptoJS and the provided secret, then save the updated wallet data within the transaction
    
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
  console.log('req.body:', req.body);
  
  try {
    const { username, password } = req.body;
    

    const userData = await User.findOne({
      where: { username }, // Find the user with the provided username
      include: [{ model: Wallet }] // Include the Wallet model in the query
    });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' }); // Respond with an error message if the user doesn't exist
      return;
    }

    const validPassword = await userData.checkPassword(password); // Check if the provided password matches the user's stored password

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password or password, please try again' }); // Respond with an error message if the password is incorrect
      return;
    }
    
    // Generate a welcome message using the user's username
const welcomeMessage = await generateResponse(`My name is ${userData.username}`);


    req.session.user = {
      id: userData.id,
      username: userData.username,
      profilePicture: userData.profile_picture,
      // welcomeMessage: welcomeMessage,
    };

    req.session.logged_in = true; // Set the session as logged in

    res.json({ user: userData, message: welcomeMessage }); // Respond with the user data and a success message

  } catch (err) {
    console.error(err.message);
    res.status(400).json(err); // Respond with an error message if an error occurs during the login process
  }
});


// Logout route CHECK THIS
router.post('/logout', (req, res) => {
  console.log('req.session:', req.session);
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end(); // Destroy the session and respond with a 204 status code
      res.render('login');
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
      return res.status(404).json({ error: 'User not found' }); 
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

// Upload GOOD
router.post('/upload', upload.single('profilePicture'), async (req, res) => {
  const fileName = req.file.key; // the key of the uploaded file
  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

  // Update the session
  req.session.user.profilePicture = fileUrl;

  // Update the database
  try {
    await User.update(
      { profile_picture: fileUrl }, // new data to update
      { where: { id: req.session.user.id } } // where clause
    );
    
  } catch (error) {
    console.error('Failed to update profile_picture in the database:', error);
  }

  res.json({ message: 'File uploaded successfully', fileUrl: fileUrl });
});

// update profile picture GOOD
router.put('/update/profile-picture', withAuth, async (req, res) => {

  try {
      const user = await User.findOne({ where: { id: req.session.user.id } });
    
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const newPicturePath = req.body.location; // Use req.body.location to get the URL

      await user.update({ profile_picture: newPicturePath });
      res.json({ message: 'Profile picture updated successfully', newPictureUrl: user.profile_picture });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the profile picture' });
  }
});

// Delete user
router.delete('/delete', withAuth, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.session.user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); 
    }

    await user.destroy(); // Delete the user

    req.session.destroy(() => {
      res.status(204).end(); // Destroy the session and respond with a 204 status code
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' }); // If an error occurs during the user deletion, respond with an error message
  }
});

// use a post route to create a new game of blackjack that records the outcomes of the game and all the needed info user_id, bet, result, amount_won_lost, time_played, remaining_deck

// Create a new game of blackjack
router.post('/blackjack', withAuth, async (req, res) => {
  console.log('req.body:', req.body);
  try {
    const { bet_amount, gameOutcome, amount_won_lost } = req.body;
    const gameData = await BlackJack.create({
      bet_amount,
      gameOutcome,
      amount_won_lost,
      user_id: req.session.user.id,
    });

    console.log('gameData:', gameData);
    res.json(gameData);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating game' });
  }
});














module.exports = router;
