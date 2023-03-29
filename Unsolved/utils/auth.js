const withAuth = (req, res, next) => {
  // TODO: Add a comment describing the functionality of this if statement
  //if users not logged in this will send them to our login page
  // TODO: If user not logged in then is sent to login page.
  if (!req.session.user_in) {
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = withAuth;
