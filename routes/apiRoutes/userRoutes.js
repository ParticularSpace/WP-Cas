const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Wallet } = require('../../models');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
require('dotenv').config();

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




// Login route BAD wont redirect to dashboard

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
    };
   
    req.session.logged_in = true;
    

    console.log(req.session);

    res.json({ user: userData, message: 'ok' });
  
  } catch (err) {

    console.error(err.message); 
    res.status(400).json(err);

  }

});

//just in case for now

// // Logout route
// router.post('/logout', (req, res) => {
//   if (req.session.logged_in) {
//     req.session.destroy(() => {
//       res.status(204).end();
//     });
//   } else {
//     res.status(404).end();
//   }
// });

module.exports = router;
