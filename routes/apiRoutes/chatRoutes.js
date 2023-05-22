// Importing the required dependencies
const express = require('express'); // Importing Express
const router = express.Router(); // Using the Router module from Express
const { generateResponse } = require('../../utils/openAIService'); // Importing the 'generateResponse' function from the 'openAIService' module in the 'utils' directory
const { User } = require('../../models'); // Importing the User model

// Handling POST request for '/chat' endpoint 
router.post('/chat', async (req, res) => {
  try { 
    const message = req.body.message;
    const username = req.session.user.username;

    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let response = await generateResponse(message);
    console.log(req.session, 'req.session inside of chatRoutes.js')
    // If there is a welcome message in the session, display it
    if (req.session.user.welcomeMessage) {
      response = req.session.user.welcomeMessage;
      delete req.session.user.welcomeMessage; // Remove the welcome message from the session
    }
    console.log('after delete', req.session);

    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});



// Handling POST request for '/chat/announce' endpoint
router.post('/chat/announce', async (req, res) => {
  const { userMessage, gameOutcome } = req.body;
  try {
    const response = await generateResponse(userMessage, gameOutcome);
    res.json({ message: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});



module.exports = router; // Exporting the router for use in other files
