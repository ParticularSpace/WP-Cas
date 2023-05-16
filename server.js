// import required packages
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
//  const path = require('path');
const hbs = exphbs.create({});
const sequelize = require('./config/connection');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// import routes
const chatRoutes = require('./routes/apiRoutes/chatRoutes');

// create express app
const app = express();

const PORT = process.env.PORT || 3001;

// set up handlebars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// serve static files
app.use(express.static("public"));

// parse request data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// parse cookies
app.use(cookieParser());

// configure session
app.use(
  session({
    name: 'my_app.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// clear cookie if user is not logged in
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.logged_in) {
    res.clearCookie('my_app.sid');
  }
  next();
});

// use routes
app.use(routes);

// use chat routes
app.use('/api', chatRoutes);

// start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});
