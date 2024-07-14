const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model");

module.exports.createHisaabController = async function (req, res) {
  let { title, description, encrypted, shareable, passcode, editpermissions } =
    req.body;

  encrypted = encrypted === "on" ? true : false;
  shareable = shareable === "on" ? true : false;
  editpermissions = editpermissions === "on" ? true : false;

  try {
    let hisaabcreated = await hisaabModel.create({
      title,
      description,
      user: req.user._id,
      passcode,
      encrypted,
      shareable,
      editpermissions,
    });

    let user = await userModel.findOne({ email: req.user.email });
    user.hisaab.push(hisaabcreated._id);

    await user.save();
    res.redirect("/profile");

  } 
  catch (err) {
    req.flash("error", true);
    res.redirect("/hisaab/create");
  }
};

module.exports.hisaabPageController = async function (req, res) {
  res.render("create");
};

module.exports.readHisaabController = async function (req, res) {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    const user = await userModel.findOne({ _id: req.user.userId });
    res.render("hisaab", { hisaab, user });
  } catch (error) {
    res.redirect("/error");
  }
};

module.exports.passcodeRenderController = async function (req, res) {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    res.render("passcode", { hisaab, error: req.flash("error") });
  } catch (error) {
    res.redirect("/error");
  }
};
module.exports.hisaabVerifyController = async function (req, res) {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    const user = await userModel.findOne({ _id: req.user.userId });

    if (!hisaab) {
      req.flash("error", "Hisaab not found");
      return res.redirect("/error");
    }

    if (hisaab.passcode === req.body.passcode) {
      res.render("hisaab", { hisaab, user });
    } else {
      req.flash("error", "Passcode incorrect");
      res.redirect(`/hisaab/view/passcode/${req.params.id}`);
    }
  } catch (error) {
    console.error("Error verifying passcode:", error);
    res.redirect("/error");
  }
};

module.exports.showEditController = async function (req, res) {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });

    res.render("edit", { error: req.flash("error"), hisaab });
  } catch (error) {
    res.redirect("/error");
  }
};

module.exports.editPostController = async function (req, res) {
  const id = req.params.id;
  const hisaab = await hisaabModel.findById(id);
  if (!hisaab) {
    return res.redirect("/profile");
  }
  hisaab.title = req.body.title;
  hisaab.description = req.body.description;
  hisaab.encrypted = req.body.encrypted == "on" ? true : false;
  hisaab.editpermissions = req.body.editpermissions == "on" ? true : false;
  hisaab.shareable = req.body.shareable == "on" ? true : false;
  hisaab.passcode = req.body.passcode;
  await hisaab.save();
  res.redirect('/profile');
};

module.exports.deleteHisaabController = async function (req, res) {
  try {
    const user = await userModel
      .findOne({ _id: req.user._id })
      .populate("hisaab");
    if (!user) {
      throw new Error("User not found");
    }

    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    if (!hisaab) {
      throw new Error("Hisaab not found");
    }

    // Check ownership before deletion
    if (user._id.toString() !== hisaab.user.toString()) {
      return res.redirect("/profile"); // Unauthorized
    }

    // Delete hisaab and update user's hisaab array
    await hisaabModel.findOneAndDelete({ _id: req.params.id });

    // Update user's hisaab array in memory
    user.hisaab = user.hisaab.filter((h) => h._id.toString() !== req.params.id);

    // Save the updated user object
    await user.save();

    // Redirect to profile after successful deletion
    return res.redirect("/profile");
  } catch (error) {
    console.error("Error in deleteHisaabController:", error);
    return res.redirect("/error");
  }
};
