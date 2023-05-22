// Purpose: Middleware to check if user is logged in
const withAuth = (req, res, next) => {
  console.log(req.session);
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

  
  module.exports = withAuth;
  