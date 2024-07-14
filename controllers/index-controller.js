const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.landingPageController = function (req, res) {
  res.render("index", { loggedin: false, error: req.flash('error') });
};

module.exports.registerPageController = function (req, res) {
  res.render("register", { loggedin: false, error: req.flash('error') });
};

module.exports.registerController = async function (req, res) {
  let { email, password, username, name } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "You already have an account, please login");
      return res.redirect("/");
    } else {
      let salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);

      user = await userModel.create({ email, name, username, password: hashed });

      let token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_KEY
      );
      res.cookie("token", token);
      res.redirect("/profile");
    }
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginController = async function (req, res) {
  let { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      req.flash("error", "You don't have an account, please create one.");
      return res.redirect("/register");
    }

    let result = await bcrypt.compare(password, user.password);
    if (result) {
      let token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_KEY
      );
      res.cookie("token", token);
      res.redirect("/profile");
    } else {
      req.flash("error", "Invalid credentials");
      return res.redirect("/");
    }
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.logoutController = async function (req, res) {
  res.cookie("token", "");
  return res.redirect("/");
};
module.exports.errorController = function (req, res) {
  res.render("error");
};

module.exports.profileController = async function (req, res) {
  try {
    let byDate = Number(req.query.byDate) || -1;
    let { startDate, endDate } = req.query;

    startDate = startDate ? new Date(startDate) : new Date("1985-01-01");
    endDate = endDate ? new Date(endDate) : new Date();

    let user = await userModel.findOne({ email: req.user.email }).populate({
      path: "hisaab",
      match: { createdAt: { $gte: startDate, $lte: endDate } },
      options: { sort: { createdAt: byDate } },
    });

    res.render("profile", { user });
  } catch (err) {
    res.send(err.message);
  }
};
