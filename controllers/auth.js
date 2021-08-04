exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
    req.isLoggedIn = true;
    res.redirect('/');
    // LEMBRE depois que essa resposta foi passada, a request MORREU!!!
    // Daí vem a necessidade de cookies e etc (;
  };
