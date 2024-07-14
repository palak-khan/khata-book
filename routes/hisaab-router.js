const express = require("express");
const router = express.Router();
const {
  createHisaabController,
  hisaabPageController,
  readHisaabController ,
  hisaabVerifyController,
  passcodeRenderController,
  showEditController,
  editPostController,
  deleteHisaabController,
} = require("../controllers/hisaab-controller");

const {
  isLoggedIn,
  redirectIfloggedIn,
} = require("../middlewares/auth-middlewares");

router.get("/create", isLoggedIn, hisaabPageController);
router.post("/create", isLoggedIn, createHisaabController);

router.get("/view/:id", isLoggedIn, readHisaabController );

router.get("/view/passcode/:id", isLoggedIn, passcodeRenderController);
router.post("/view/passcode/:id", isLoggedIn, hisaabVerifyController);

router.get("/edit/:id", isLoggedIn, showEditController);
router.post("/edit/:id", isLoggedIn, editPostController);

router.get("/delete/:id", isLoggedIn, deleteHisaabController);

module.exports = router;
