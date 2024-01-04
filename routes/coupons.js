const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const couponController = require("../controllers/couponControllers");
const passportJWT = require("../middlewares/passportJWT");

router.post("/create", couponController.create);
router.post("/checkCoupon", couponController.checkCoupon);
router.post("/useCoupon", couponController.useCoupon);

module.exports = router;
