const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userControllers");
const passportJWT = require("../middlewares/passportJWT");
router.post(
  "/register",
  [
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("required email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 character"),
    body("firstName").not().isEmpty().withMessage("required first name"),
    body("lastName").not().isEmpty().withMessage("required last name"),
    body("tel").not().isEmpty().withMessage("required mobile number"),
    body("role")
      .isIn(["admin", "seller"])
      .withMessage("Please use admin or seller"),
  ],
  userController.register
);
router.post("/login", userController.login);
router.put("/update/:id", userController.update);

router.post("/lineConnecting", userController.lineConnecting); //For Line log in
// router.get("/profile", [passportJWT.isLogin], userController.profile);

module.exports = router;
