const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
// const Asset = require("../models/asset");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const axios = require("axios");
// const s3url = require("../utils/content");

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, tel, role } = req.body;
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      const error = new Error("email already use!!");
      error.statusCode = 400;
      throw error;
    }
    let user = new User();
    user.email = email;
    user.password = await user.encryPassword(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.tel = tel;
    user.role = role;
    await user.save();
    return res
      .status(201)
      .json({ ...responseMessage.success, data: "Registed" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check email exist system
    const user = await User.findOne({ email: email }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!user) {
      const error = new Error("email Not Found");
      error.statusCode = 404;
      throw error;
    }
    // compare password ถ้าไม่ตรง Return false
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("Password Invalid");
      error.statusCode = 401;
      throw error;
    }

    //create token
    const token = await jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "10 days" }
    );

    //decode expiresIn
    const expires_in = jwt.decode(token);

    return res.status(200).json({
      ...responseMessage.success,
      data: user,
      message: "login success",
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const existUser = await User.findOne().where("email").eq(email);
    if (!existUser) {
      const error = new Error("email does not exist!!");
      error.statusCode = 401;
      throw error;
    }
    if (existUser.password === password) {
      const error = new Error("New password are same with old password!!");
      error.statusCode = 401;
      throw error;
    }

    const editUser = await User.updateOne(
      { _id: id },
      {
        password: await existUser.encryPassword(password),
        firstName,
        lastName,
      }
    );
    if (editUser.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

//For LineOA to send data to Maland chat line
exports.lineConnecting = async (req, res, next) => {
  try {
    let lineUser = req.body.events[0].source; //user ID from Line
    let lineMessage = req.body.events[0].message; //Message
    // let LineOA = req.body.destination; //Line OA
    // let lineReplyToken = req.body.events[0].replyToken; //Reply Token
    console.log(lineUser);
    let textResponse = "";
    if (["ซื้อ", "เช่า", "ซื้อและเช่า"].includes(lineMessage.text)) {
      switch (lineMessage.text) {
        case "ซื้อ":
          textResponse = `ตัวอย่างการซื้อ
          ลูกค้าสนใจ : (ซื้อ)(บ้าน)
          ชื่อลูกค้า : (เจน สรวงสุดา)
          เบอร์ติดต่อ : (09xxxxxxx)
          อาชีพ : (ux)
          สนใจย่าน : (เยาวราช)
          ขนาดพื้นที่ : (150 ตรม)
          จำนวนห้อง : (4)
          สิ่งอำนวยความสะดวก
          - โรงเรียนนานาชาติ
          - ห้างสรรพสินค้า
          - โรงพยาบาล
          - ทางด่วน
          - ริมแม่น้ำเจ้าพระยา
          ราคาที่ต้องการซื้อ : 10 M - 20 M`;
          break;
        case "เช่า":
          textResponse = `ตัวอย่างการเช่า
          ลูกค้าสนใจ : (เช่า)(คอนโด)
          ชื่อลูกค้า : (เจน สรวงสุดา)
          เบอร์ติดต่อ : (09xxxxxxx)
          อาชีพ : (ux)
          สนใจย่าน : (เยาวราช)
          ขนาดพื้นที่ : (50 ตรม)
          จำนวนห้อง : (3)
          สิ่งอำนวยความสะดวก
          - โรงเรียนนานาชาติ
          - ห้างสรรพสินค้า
          - โรงพยาบาล
          - ทางด่วน
          - ริมแม่น้ำเจ้าพระยา
          ราคาที่ต้องการเช่า : 30k - 50k`;
          break;
        case "ซื้อและเช่า":
          textResponse = `ตัวอย่างการซื้อและเช่า
          ลูกค้าสนใจ : (ซื้อและเช่า)(คอนโด)
          ชื่อลูกค้า : (เจน สรวงสุดา)
          เบอร์ติดต่อ : (09xxxxxxx)
          อาชีพ : (ux)
          สนใจย่าน : (เยาวราช)
          ขนาดพื้นที่ : (60 ตรม)
          จำนวนห้อง : (3)
          สิ่งอำนวยความสะดวก
          - โรงเรียนนานาชาติ
          - ห้างสรรพสินค้า
          - โรงพยาบาล
          - ทางด่วน
          - ริมแม่น้ำเจ้าพระยา
          ราคาที่ต้องการซื้อ : 15 M - 25 M
          ราคาที่ต้องการเช่า : 50k - 80k`;
          break;
      }

      const options = {
        method: "POST",
        url: "https://api.line.me/v2/bot/message/push",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.LINE_AUTH}`,
        },

        data: {
          to: "U3c976721790fe52756d1e3106fa13d15", // ไลน์ของ Maland
          messages: [
            {
              type: "text",
              text: textResponse,
            },
          ],
        },
      };

      await axios
        .request(options)
        .then((response) => {
          // console.log(response.data);
          console.log("ส่งข้อความสำเร็จ");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // return res.status(200).json({
    //   ...responseMessage.success,
    //   data: "Success",
    // });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
