const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
// const path = require('path');
const hbs = exphbs.create({});
const sequelize = require('./config/connection');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const chatRoutes = require('./routes/apiRoutes/chatRoutes');

const app = express();

const PORT = process.env.PORT || 3001;


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.static("public")); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

app.use('/uploads', express.static('uploads')); // Serve static files from the "uploads" directory

app.use(
  session({
    name: 'my_app.sid', // Set the name of the session cookie
    secret: process.env.SESSION_SECRET, // Set the session secret from environment variable
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Set the session cookie expiration time to 24 hours
    },
  })
);

app.use((req, res, next) => {
  // Clear the session cookie if user_sid is present but the user is not logged in
  if (req.cookies.user_sid && !req.session.logged_in) {
    res.clearCookie('my_app.sid');
  }
  next();
});

app.use(routes); // Include the application routes

app.use('/api', chatRoutes); // Include the chat API routes

sequelize.sync({ force: false }).then(() => { // Sync the database models with the database
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`); // Start the server and listen on the specified port
  });
});
