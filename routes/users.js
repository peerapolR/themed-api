const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userControllers");
const passportJWT = require("../middlewares/passportJWT");

router.post("/newUser", userController.newUser);
router.post("/checkUser", userController.checkUser);

// router.post("/lineConnecting", userController.lineConnecting); //For Line log in
// router.get("/profile", [passportJWT.isLogin], userController.profile);

module.exports = router;
