// Dependencies
const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

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

    user.profilePicture = req.session.user.profilePicture;

    // Pass serialized data and session flag into template
    res.render('account', {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
