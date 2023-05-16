const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const hbs = exphbs.create({});
const sequelize = require('./config/connection');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const chatRoutes = require('./routes/apiRoutes/chatRoutes');




const app = express();

const PORT = process.env.PORT || 3001;


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'))




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


app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.logged_in) {
    res.clearCookie('my_app.sid');
  }
  next();
});


app.use(routes);

app.use('/api', chatRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});