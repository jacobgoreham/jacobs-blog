const withAuth = (req, res, next) => {
<<<<<<< HEAD
  // TODO: Add a comment describing the functionality of this if statement
  //if users not logged in this will send them to our login page
=======
  // TODO: If user not logged in then is sent to login page. This is an auth middleware function BTW.
>>>>>>> 102a9656410d21ac043f3714d320f9787819b679
  if (!req.session.logged_in) {
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = withAuth;
