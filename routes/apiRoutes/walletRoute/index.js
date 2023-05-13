const router = require('express').Router();
const { Wallet, User } = require('../../../models');


// get wallet by id
router.get('/wallet/:id/balance', async (req, res) => {
    try{


        const walletID = req.params.id;
        const selectedWallet = await Wallet.findByPk(walletID);

        if(!selectedWallet){
            return res.status(404).json({ message: 'Wallet not found'})
        }
    
        res.status(200).json( {balance: selectedWallet.balance} );

        const walletID = await Wallet.findByPk(req.params.id, {include: [{model: User}],}); 
        
        /*const amount = walletID.get({plain: true});
        res.render('fundz', { amount });*/
        res.status(200).json(walletID);

    }
    catch(err) {
        res.status(500).json( {message: " Internal Error "});
    }
});

// update wallet by id 
router.put('wallet/:id/balance', async (req, res) => {
    try {
        const walletId = req.params.id;
        const { newBalance } = req.body;
    
        const wallet = await Wallet.findByPk(walletId);
    
        if (!wallet) {
          return res.status(404).json({ message: 'Wallet not found' });
        }
    
        wallet.balance = newBalance;
        await wallet.save();
    
        res.json({ message: 'Balance updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    
});

module.exports = router;