
const router = require('express').Router();

const { Wallet } = require('../../models');
const { User } = require('../../models');
const withAuth = require('../../utils/auth'); 

// router.get('/games', withAuth, async(req, res) => {
    
//     try{
 
//              const walletData = await Wallet.findOne({
//                  where: { user_id: req.session.user.id, },
                     
//              });
         
//              const wallet = walletData.get({plain: true});
            
//             res.render('games', { walletBal: wallet.balance,});
//             res.render('games');
//             }
//              catch (err) {
//              res.status(500).json({ message: 'Error retrieving wallet balance' });
//             }
    

// });

// router.get('/games/:id',  async (req, res) => {
//     try{
 
//      const walletData = await Wallet.findOne({
//          where: { user_id: req.session.user.id, },
             
//      });
 
//      const wallet = walletData.get({plain: true});
 
//     res.render('fundz', { walletBal: wallet.balance,});
 
//     }
//      catch (err) {
//      res.status(500).json({ message: 'Error retrieving wallet balance' });
//     }
     
//  });

//  

// router.get('/games', async (req, res) => {
//     try {
      
//       const userId = req.session.userId; // Adjust this to match how you store the user's ID
  
//       // Find the user and their associated wallet
//       const user = await User.findByPk(userId, {
//         include: Wallet,
//       });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Retrieve the wallet balance from the user's wallet
//       const walletBalance = user.wallet ? user.wallet.balance : null;
  
//       // Render the Handlebars template and pass the wallet balance as a context variable
//       res.render('balance', { balance: walletBalance });
//     } catch (error) {
//       console.error('Error retrieving wallet balance:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

// router.get('/games/:id', withAuth, async (req, res) => {
//     try {
//       const userData = await User.findOne({
//         where: {
//           id: req.session.user.id,
//         },
//         attributes: { exclude: ['password'] },
//       });
  
//       // get the user's wallet
//       const walletData = await Wallet.findOne({
//         where: {
//           user_id: req.session.user.id,
//         },
//       });
  
//       // Serialize data so the template can read it
//       const user = userData.get({ plain: true });
//       const wallet = walletData.get({ plain: true });
//       console.log(user, 'this is user in /dashboard route');
  
//       if(user.profile_picture) {
//         user.profilePicture = user.profile_picture;
//       } else {
//         user.profilePicture = 'images/fullDeck/2-heart.png';
//       }
  
//       // Pass serialized data and session flag into template
//       res.render('funds', {
//         ...user,
//         walletBalance: wallet.balance, // passing wallet balance to the front-end
//         logged_in: req.session.logged_in,
//       });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


router.get('/games', withAuth, async (req, res) => {
  try {
    // Find the wallet data
    const walletData = await Wallet.findOne({
      where: { user_id: req.session.user.id },
    });
    
    const wallet = walletData.get({ plain: true });

    // Find the user data
    const userData = await User.findByPk(req.session.user.id);
    const user = userData.get({ plain: true });

    // Render 'games' with user details and wallet balance
    res.render('games', {
      logged_in: req.session.logged_in, 
      profilePicture: user.profile_picture, 
      walletBalance: wallet.balance,
      username: user.username,
      
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving wallet balance' });
  }
});


module.exports = router;
