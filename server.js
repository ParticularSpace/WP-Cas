const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const hbs = exphbs.create({});

const sequelize = require('./config/connection');

const app = express();

const PORT = process.env.PORT || 3001;

// setup express so that it knows we're using handlebars as our
// template engine



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Express middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());



app.use(routes);




sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

