const router = require('express').Router();
const { Wallet } = require('../../models');


// Route to add funds to wallet
router.post('/fund', async (req, res) => {
    console.log(req.body, "this is req.body in walletRoutes.js");
  try {
    const walletData = await Wallet.findOne({
      where: {
        user_id: req.session.user.id,
      },
    });

    console.log(walletData);

    if (walletData) {
        
      // Update the wallet balance
      walletData.balance = Number(walletData.balance) + Number(req.body.amount);
      console.log(walletData.balance, "this is walletData.balance in walletRoutes.js");


      await walletData.save();

      res.status(200).json(walletData);
    } else {
      res.status(404).json({ message: 'No wallet found with this id!' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post('/fund', async (req, res) => {
//   try {
//     const walletData = await Wallet.findOne({
//       where: {
//         user_id: req.session.user.id,
//       },
//     });

//     if(walletData) {
//       walletData.balance = Number(req.body.input);

//       console.log( "blackjack has reached route to update wallet balance");

//       await walletData.save();
//       res.status(200).json(walletData);
//     }else {
//       res.status(404).json({ message: 'The wallet has not been found' });
//     } 
//     }
//     catch (err) {
//       res.status(500).json(err);
//     }

// });

module.exports = router;
