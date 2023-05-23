const router = require('express').Router();
const { Wallet } = require('../../models');


// Route to add funds to wallet
router.post('/fund', async (req, res) => {
  try {
    const walletData = await Wallet.findOne({
      where: {
        user_id: req.session.user.id,
      },
    });

    if (walletData) {
        
      // Update the wallet balance
      walletData.balance = Number(walletData.balance) + Number(req.body.amount);
      
      await walletData.save();

      res.status(200).json(walletData);
    } else {
      res.status(404).json({ message: 'No wallet found with this id!' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
