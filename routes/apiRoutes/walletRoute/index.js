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
    }
    catch(err) {
        res.status(500).json( {message: " Internal Error "});
    }
});

// update wallet by id 
router.put('/:id', async (req, res) => {
    try{
        const updateWallet = await Wallet.update(req.body, {where: {id: req.params.id}});
        res.status(200).json(updateWallet);
    }
    catch(err) {
        res.status(500).json( { message: "Cannot update wallet "});
    }
});

module.exports = router;