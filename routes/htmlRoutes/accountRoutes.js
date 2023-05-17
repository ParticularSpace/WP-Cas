const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/account', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.session.user.id,
      },
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });
    console.log(user, 'this is user in accountRoutes 16');

if(user.profile_picture) {
  user.profilePicture = user.profile_picture;
} else {
  user.profilePicture = 'images/fullDeck/2-heart.png';
}


    res.render('account', {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
