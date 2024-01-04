// const jwt = require("jsonwebtoken");
const Coupon = require("../models/coupon");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const genCoupon = require("../utils/genCoupon");
// const s3url = require("../utils/content");

exports.create = async (req, res, next) => {
  try {
    const {
      coupon_name,
      coupon_code,
      coupon_cat,
      discount_per,
      discount_num,
      expired_date,
      used_date,
      createdBy,
    } = req.body;

    let coupon = new Coupon();
    coupon.coupon_name = coupon_name;
    coupon.coupon_code = coupon_code;
    coupon.coupon_cat = coupon_cat;
    coupon.discount_per = discount_per;
    coupon.discount_num = discount_num;
    coupon.expired_date = expired_date;
    coupon.used_date = used_date;
    coupon.createdBy = createdBy;
    await coupon.save();

    return res.status(200).json({
      ...responseMessage.success,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkCoupon = async (req, res, next) => {
  try {
    const { coupon_code } = req.body;

    const existCoupon = await Coupon.findOne()
      .select("coupon_code isActive coupon_name discount_num discount_per")
      .where("coupon_code")
      .eq(coupon_code)
      .where("isActive")
      .eq(true)
      .lean();
    if (!existCoupon) {
      return res.status(404).json({
        ...responseMessage.fail,
      });
    } else {
      return res.status(200).json({
        ...responseMessage.success,
        coupon: existCoupon,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.useCoupon = async (req, res, next) => {
  try {
    const { coupon_code } = req.body;

    const existCoupon = await Coupon.findOne()
      .where("coupon_code")
      .eq(coupon_code)
      .where("isActive")
      .eq(true);

    if (!existCoupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }

    const updateCoupon = await Coupon.updateOne(
      { coupon_code: coupon_code },
      { isActive: false }
    );
    if (updateCoupon.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      return res.status(200).json({
        message: `Use Coupon code : ${coupon_code} Success`,
      });
    }
  } catch (error) {
    next(error);
  }
};
