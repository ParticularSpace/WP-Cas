const router = require('express').Router();
const {User} = require('../../models');

// /users
// /users  - render all the users
// /todos - renders all the todos
router.get('/login', async (req, res) => {
  try {
    const usersData = await User.findAll();
    const users = usersData.map(user => user.get({plain: true}));
    res.render('users', {
      sentence: 'This is a sentence',
      users
    });
  } catch (error) {
    res.status(500).json({error});
  }
});


router.get('/home', async (req, res) => {
 
});


module.exports = router;