const router = require('express').Router(); 
const { User } = require('../../models'); 
const withAuth = require('../../utils/auth');

// Render the account page only if the user is logged in
router.get('/account', withAuth, async (req, res) => {
  try {
    // Check session and see if the user is logged in
    if (req.session.logged_in) {
      res.render('account'); // Render the 'account' view
    } else {
      res.redirect('/login'); // Redirect to the login page if the user is not logged in
    }
  } catch (err) {
    res.status(500).json(err); // Return a 500 status code and error message if an error occurs
  }
});

module.exports = router; 
