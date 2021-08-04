const User = require("../models/user")
exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie"))
  // const isLoggedIn = req.get("Cookie").split("=")[1] === "true"
  const isLoggedIn = !!req.session.isLoggedIn
  console.log(!!isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  // setando cookie
  // res.setHeader("Set-Cookie", "loggedIn=true")  
  User.findById('6109e8bdc9de9759a8d7d0c2')
    .then(user => {
      req.session.user = user;
      // TODO: store user in session object after login. THE MONGOOSE MODEL ITSELF IS NOT STORED!
      req.session.isLoggedIn = true 
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');//TODO: redirect só pode acontecer após criação da session! para garantir isso, podemos usar essa callback ou poderíamos ter encadeado outro then
      })
    })
    .catch(err => console.log(err));
  // LEMBRE depois que essa resposta foi passada, a request MORREU!!!
  // Daí vem a necessidade de cookies e etc (;
};


exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/')
  })
}