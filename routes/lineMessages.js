const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const lineMessageControllers = require("../controllers/lineMessageControllers");
const passportJWT = require("../middlewares/passportJWT");

router.post("/admin", lineMessageControllers.admin);
router.post("/messageHook", lineMessageControllers.messageHook);

module.exports = router;
