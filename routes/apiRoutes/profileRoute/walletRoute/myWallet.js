// Importing the required dependencies
const router = require('express').Router(); 
const { Wallet, User } = require('../../../../models'); 
const withAuth = require('../../../../utils/auth'); 

// Get wallet by ID
router.get('/:id', async (req, res) => {
    try{
        const walletID = await Wallet.findByPk(req.params.id); 
        
        if(!walletID){
            return res.status(404).json({ message: 'Wallet not found' }); 
        }
    
        res.status(200).json(walletID); 
    }
    catch(err) {
        res.status(500).json({ message: 'Internal Error' }); 
    }
});




// Get wallet's balance by ID
router.get('/:id/balance', async (req, res) => {
    try {
        const walletID = req.params.id;
        const wallet = await Wallet.findByPk(walletID); 
    
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' }); 
        }
    
        const balance = wallet.balance;
        res.status(200).json({ balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
});


// ====== post function right here. =============================

router.post('/U_W_bal', async (req, res) => {
    try {
      const walletData = await Wallet.findOne({
        where: {
          user_id: req.session.user.id,
        },
      });
  
      if(walletData) {
        walletData.balance = Number(req.body.input);
  
        console.log( "blackjack has reached route to update wallet balance");
  
        await walletData.save();
        res.status(200).json(walletData);
      }else {
        res.status(404).json({ message: 'The wallet has not been found' });
      } 
      }
      catch (err) {
        res.status(500).json(err);
      }
  
  });

module.exports = router;
