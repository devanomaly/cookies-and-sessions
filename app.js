require("dotenv/config")

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5bab316ce0a7c75f783cb8a8')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(result => {
    console.log("\nConectado ao MongoDB!!\n")
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Rafa',
          email: 'rafa@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
