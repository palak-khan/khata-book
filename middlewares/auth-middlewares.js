const jwt = require("jsonwebtoken");
const userModel = require('../models/user-model');

module.exports.isLoggedIn = async function (req, res, next) {
  if (req.cookies.token) {
    try {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      let user = await userModel.findOne({ email: decoded.email });
      if (!user) {
        req.flash('error', 'User not found. Please login again.');
        return res.redirect('/');
      }
      req.user = user;
      next();
    } catch (err) {
      req.flash('error', 'Invalid token. Please login again.');
      return res.redirect("/");
    }
  } else {
    req.flash('error', 'Please login first.');
    return res.redirect("/");
  }
};

module.exports.redirectIfLoggedIn = function (req, res, next) {
  if (req.cookies.token) {
    try {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      if (decoded) {
        return res.redirect("/profile");
      }
    } catch (err) {
      next();
    }
  } else {
    next();
  }
};
