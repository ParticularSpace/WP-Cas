const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const hbs = exphbs.create({});
const sequelize = require('./config/connection');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT || 3001;


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// app.use(
//   session({
//     key: 'user_sid',
//     secret: process.env.SESSION_SECRET, 
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 600000,
//     },
//   })
// );


// app.use((req, res, next) => {
//   if (req.cookies.user_sid && !req.session.user) {
//     res.clearCookie('user_sid');
//   }
//   next();
// });

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});
