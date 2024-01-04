const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const orderController = require("../controllers/orderControllers");
const passportJWT = require("../middlewares/passportJWT");

router.post("/create", orderController.create);


module.exports = router;
