// Importing the required dependencies
const express = require('express'); // Importing Express
const router = express.Router(); // Using the Router module from Express
const { generateResponse } = require('../../utils/openAIService'); // Importing the 'generateResponse' function from the 'openAIService' module in the 'utils' directory

// Handling POST request for '/chat' endpoint
router.post('/chat', async (req, res) => {
  try {
    const message = req.body.message; // Extracting the message from the request body
    const response = await generateResponse(message); // Generating a response using the 'generateResponse' function
    
    res.json({ message: response.content }); // Sending the response content as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' }); // Returning a 500 error for any error during processing
  }
});

module.exports = router; // Exporting the router for use in other files
