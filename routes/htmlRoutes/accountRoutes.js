// Dependencies
const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');
const { Wallet } = require('../../models');

// GET route for getting the user's account page
router.get('/account', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.session.user.id,
      },
      attributes: { exclude: ['password'] },
    });

    // Serialize data so the template can read it
    const user = userData.get({ plain: true });
    console.log(user, 'this is user in accountRoutes 16');

if(user.profile_picture) {
  user.profilePicture = user.profile_picture;
} else {
  user.profilePicture = 'images/fullDeck/2-heart.png';
}


    // Pass serialized data and session flag into template
    res.render('account', {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/account/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Use the id from the request parameters
    const userData = await User.findByPk(userId);
    const user = userData.get({plain: true});
    res.render('dashboard', 
      {
        ...user,
        logged_in: req.session.logged_in
      }
    );
  } catch (error) {
    res.status(500).json({error});
  }
});



router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.session.user.id,
      },
      attributes: { exclude: ['password'] },
    });

    // get the user's wallet
    const walletData = await Wallet.findOne({
      where: {
        user_id: req.session.user.id,
      },
    });

    // Serialize data so the template can read it
    const user = userData.get({ plain: true });
    const wallet = walletData.get({ plain: true });
    console.log(user, 'this is user in /dashboard route');

    if(user.profile_picture) {
      user.profilePicture = user.profile_picture;
    } else {
      user.profilePicture = 'images/fullDeck/2-heart.png';
    }

    // Pass serialized data and session flag into template
    res.render('dashboard', {
      ...user,
      walletBalance: wallet.balance, // passing wallet balance to the front-end
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});




// const userData = await User.findOne({ 
//   where: { username },
//   include: [{ model: Wallet }] 
//   });

// router.get('/dashboard', async (req, res) => {
//   // const user = req.body;
//   const {logged_in, user} = req.session;
//   if (!logged_in) {
//     res.render('login')
//   }
//   console.log('accountROutes', req.session)
//   console.log('user', user)
//   res.render('dashboard', {user});
// });

// router.get('/', async (req, res) => {
//   try {
//   const {username} = req.body;
//   const userData = await User.findByPk(username);
//   const user = userData.get({plain: true});
//   res.render('dashboard', {
//     user
//   })
// } catch (err) {
//   res.status(500).json({err})
// }
// });

// router.get('/dashboard', function(req, res) {
//   User.find(function (err, users, res) {
//     if (err) return res.sendStatus(500);
//     res.render('dashboard', { userList : users });
//   });
// });

module.exports = router;
