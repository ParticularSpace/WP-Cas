const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');


// Register route
router.post('/register', async (req, res) => {
  try {
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const userData = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.error(err.message); // Log the error message to your server logs
    res.status(400).json({ message: 'An error occurred while registering' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {

      //const username = req.body.username;
      //const password = req.body.password;

    const userData = await User.findOne({ where: { username: req.body.username } });
      /*User.findOne({ username }).then(user => {
        if (!user) res.status(400).json({ message: 'User does not exist' });
          
        bcrypt.compare(password, user.password, (err, data) => {
          if(err) throw err

          if(data) {
            return res.status(200).json({ message: "Login Success"});
          }
          else {
            return res.status(401).json({ message: "Invalid login credentials"});
          }
        });
        
      });*/

    console.log("User Data: ", userData);  // Add this line

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    console.log("Entered password: ", req.body.password); // Add this line
    console.log("Stored hashed password: ", userData.password); // Add this line



    const validPassword = await bcrypt.compare(req.body.password, userData.password);


    console.log("Valid Password: ", validPassword);  // And this line

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {

    console.log(err);  // Add this line
    
    res.status(400).json(err);
  }
});


// Logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
