# WP-Cas

"WP" stands for "Well Played" and "Cas" stands for "Casino" 

Primary game is black jack with support games as in slots, roulette, etc.

GPT-4 acts as dealer to talk to players and play games.

Require: User login (email / password) and Verify Phone number. 

Allow: Profile photos, display name, etc.

To Play: Connect wallet (MetaMask) and deposit ETH / BTC to play.

Technologies: HTML, CSS, JS, React, Node, Express, Web3, SQL, Sequelize, Inquirer, GPT-4, etc.

https://platform.openai.com/account/api-keys

Project setup:

a. Initialize a Git repository ✅

b. Set up Node.js and Express.js for the project ✅

c. Configure the project to use Handlebars.js as a templating engine ✅

d. Install and set up Sequelize ORM and MySQL for the database ✅

Database design and implementation:

a. Design the database schema for users, games, and transactions

b. Create the necessary Sequelize models and associations

c. Implement seed data for testing purposes

Authentication and authorization:

a. Implement user registration and login functionality

b. Set up express-session for session management and cookies for user authentication

c. Protect sensitive information and API keys using environment variables and/or other encryption techniques

API design and implementation:

a. Design and implement RESTful API routes for user management, game management, and transactions

b. Implement both GET and POST routes for retrieving and adding new data

c. Test and document the API routes

Integrate GPT-4 API for AI dealer and chat functionality

a. Create a wrapper module for the GPT-4 API: Implement a module to handle API requests and responses with the GPT-4 API.

b. Implement AI dealer functionality: Use the GPT-4 API to generate game-related actions, such as dealing cards, determining winners, and managing game states.

c. Add chat functionality with AI: Implement chat routes and views for users to interact with the AI dealer, and use the GPT-4 API to generate appropriate responses to user messages.

d. Handle rate limits and API errors: Implement error handling and rate-limiting mechanisms to ensure the application continues to work smoothly even when the GPT-4 API has usage limitations or returns errors.

e. Secure API key and sensitive data: Ensure the GPT-4 API key and other sensitive information are securely stored and not exposed in the application code or version control system.


User Interface (UI) design and implementation:

a. Design a polished and responsive UI for the online casino

b. Implement UI templates using Handlebars.js

c. Integrate the front-end with the back-end API

Game implementation:

a. Develop the main Blackjack game logic

b. Implement additional casino games as needed

c. Integrate the games with the user accounts and transactions system

Security and quality assurance:

a. Implement appropriate security measures to protect user data and transactions

b. Perform thorough testing of all implemented features

c. Ensure code quality and adherence to coding standards

Deployment and hosting:

a. Set up the project on Heroku for deployment

b. Configure any necessary environment variables or settings for deployment

c. Deploy the application to Heroku

Documentation:

a. Create a comprehensive README file that includes project details, setup instructions, and API documentation

b. Document any additional resources or references used in the project
