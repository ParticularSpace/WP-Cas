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

// Display balance amount
router.get('/:id/balance_display', async (req, res) => {
    try {
        const walletId = req.params.id;
        const wallet = await Wallet.findByPk(walletId); 
    
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' }); 
        }
    
        const balance = wallet.balance;
        res.render('fundz', balance); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
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

module.exports = router;
