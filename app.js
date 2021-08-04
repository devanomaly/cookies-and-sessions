require("dotenv/config")

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// TODO: lembre como usar o session e MongoDB...
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
// seguindo a documentação:
// The MongoDBStore class has 3 required options:
  // uri: a MongoDB connection string
  // databaseName: the MongoDB database to store sessions in
  // collection: the MongoDB collection to store sessions in
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions", // nome da coleção
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:"um segredo top da balada demais pae",
  resave: false,
  saveUninitialized: false,
  store: store //aqui eh onde usamos o MongoDBStore definido mais para cima...
}))

// app.use((req, res, next) => {
//   User.findById('5bab316ce0a7c75f783cb8a8')
//     .then(user => {
//       req.user = user;
//       // TODO: store user in session object after login
//       next();
//     })
//     .catch(err => console.log(err));
// });

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
