const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

// Render the account page only if the user is logged in
router.get('/account', withAuth, async (req, res) => {
  try {
    // check session and see if user is logged in
    if (req.session.logged_in) {
        res.render('account');
    } else {
        res.redirect('/login');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
