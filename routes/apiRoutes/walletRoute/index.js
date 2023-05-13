const router = require('express').Router();
const { Wallet, User } = require('../../../models');


// get wallet by id
router.get('/wallet/:id', async (req, res) => {
    try{
        const walletID = await Wallet.findByPk(req.params.id);//, { include: [{ model: User}]}); 
        
        const amount = walletID.get({plain: true});
        res.render('fundz', amount)
        //res.status(200).json(walletID);
    }
    catch(err) {
        res.status(500).json( {message: "Cannot find wallet "});
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