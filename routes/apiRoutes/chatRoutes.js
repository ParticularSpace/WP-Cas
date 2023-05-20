// Importing the required dependencies
const express = require('express'); // Importing Express
const router = express.Router(); // Using the Router module from Express
const { generateResponse } = require('../../utils/openAIService'); // Importing the 'generateResponse' function from the 'openAIService' module in the 'utils' directory
const { User } = require('../../models'); // Importing the User model

// Handling POST request for '/chat' endpoint
router.post('/chat', async (req, res) => {
  try {
    const message = req.body.message; // Extracting the message from the request body
    const username = req.body.username; // Extracting the username from the request body

    // Fetch the user's name from the database
    const user = await User.findOne({ where: { username: username } });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let response = await generateResponse(message); // Generating a response using the 'generateResponse' function

    // If the message from the user was a login attempt, customize the AI's response
    if (message === 'login') {
      response = `Hello, ${user.username}, welcome back to the Four-leaf Casino.`;
    }

    res.json({ message: response }); // Sending the response content as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' }); // Returning a 500 error for any error during processing
  }
});

module.exports = router; // Exporting the router for use in other files
