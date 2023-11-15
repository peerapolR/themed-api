const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const assetController = require("../controllers/assetControllers");
const passportJWT = require("../middlewares/passportJWT");

router.post("/create", assetController.create);
router.get("/assetsList", assetController.assetsList);
router.get("/getAssetById/:id", assetController.getAssetById);
router.delete("/:_id", assetController.deleteAsset);
router.put("/update/:id", assetController.update);
router.put("/public/:id", assetController.publicUpdate);
router.get("/getAssetBySpecial", assetController.getAssetBySpecial);

module.exports = router;
