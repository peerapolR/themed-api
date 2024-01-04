// const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const s3url = require("../utils/content");

exports.newUser = async (req, res, next) => {
  try {
    const {
      name,
      address,
      tel,
      clinicName,
      cert,
      line_name,
      line_id,
      line_img,
    } = req.body;

    const existUser = await User.findOne({ line_id });
    if (existUser) {
      const error = new Error("This Line already use!!");
      error.statusCode = 400;
      throw error;
    }

    let user = new User();
    user.name = name;
    user.address = address;
    user.tel = tel;
    user.clinic_name = clinicName;
    user.cert = cert;
    user.line_name = line_name;
    user.line_id = line_id;
    user.line_img = line_img;
    await user.save();

    const resUser = await User.findOne({ line_id })
      .select("-createdAt -updatedAt -__v -isActive")
      .lean();

    return res.status(200).json({
      ...responseMessage.success,
      resUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkUser = async (req, res, next) => {
  try {
    const { line_id } = req.body;

    const existUser = await User.findOne({ line_id })
      .select("-createdAt -updatedAt -__v -isActive")
      .lean();

    if (!existUser) {
      return res.status(404).json({
        ...responseMessage.fail,
      });
    } else {
      return res.status(200).json({
        ...responseMessage.success,
        existUser,
      });
    }
  } catch (error) {
    next(error);
  }
};
