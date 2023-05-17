const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Wallet } = require('../../models');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const withAuth = require('../../utils/auth');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Register route GOOD
router.post('/register', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const userData = await User.create({
      username: req.body.username,
      password: hashedPassword,
    }, { transaction: t });

    // Create wallet with a placeholder encrypted_id
    const walletData = await Wallet.create({
      balance: 1.00,
      user_id: userData.id,
      encrypted_id: 'placeholder',
    }, { transaction: t });
    

    // Update the wallet with the real encrypted_id
    console.log('Before walletData.save');
    console.log('walletData.id:', walletData.id);
    console.log('process.env.CRYPTOJS_SECRET:', process.env.CRYPTOJS_SECRET);

    walletData.encrypted_id = CryptoJS.AES.encrypt(walletData.id.toString(), process.env.CRYPTOJS_SECRET).toString();
    await walletData.save({ transaction: t });
    console.log('After walletData.save');


    await t.commit();

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    await t.rollback();
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
      where: { username },
      include: [{ model: Wallet }] 
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
      profilePicture: `http://localhost:3001/${userData.profile_picture}`,
    };
   
    req.session.logged_in = true;
    

    console.log(req.session);

    res.json({ user: userData, message: 'ok' });
  
  } catch (err) {

    console.error(err.message); 
    res.status(400).json(err);

  }

});


// Logout route CHECK THIS
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Change Password route GOOD
router.put('/update/password', withAuth, async (req, res) => {
  
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ where: { id: req.session.user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    console.log('LN: 128 - validPassword:', validPassword)

    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await user.update({ password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the password' });
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

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    await user.update({ username: newUsername });

    res.json({ message: 'Username updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the username' });
  }
});


// Change Profile Picture route
router.put('/update/profile-picture', withAuth, upload.single('profilePicture'), async (req, res) => {
  console.log('req.file:', req.file);
  try {
    const user = await User.findOne({ where: { id: req.session.user.id } });

    console.log('user: LN - 181', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPicturePath = req.file.path;

    req.session.user.profilePicture = `http://localhost:3001/${newPicturePath}`;


    console.log('newPicturePath:', newPicturePath)

    await user.update({ profile_picture: newPicturePath });

    res.json({ message: 'Profile picture updated successfully', newPictureUrl: `http://localhost:3001/${newPicturePath}` });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the profile picture' });
  }
});






module.exports = router;
