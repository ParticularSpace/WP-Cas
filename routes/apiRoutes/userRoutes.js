const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Wallet } = require('../../models');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// Register route
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
      balance: 0.01,
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




// Login route
router.post('/login', async (req, res) => {
  try {

    const { username, password } = req.body;

    console.log(req.body);

    const userData = await User.findOne({ 
      where: { username },
      include: [{ model: Wallet }] // Include Wallet data in the response
    });
    
    //console.log(userData);

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(password);//(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    req.session.user = {
      id: userData.id,
      username: userData.username,
    };
   
    req.session.logged_in = true;
    
    console.log(userData.id);
    console.log(userData.username);
  
    
    //req.session.save(() => {
    //  res.json({ user: userData, message: 'You are now logged in!' });
    //});
    
  } 
  catch (err) {
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
