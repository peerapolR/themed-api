const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Order = require("../models/order");
const User = require("../models/user");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");

exports.create = async (req, res, next) => {
  try {
    const {
      customer_id,
      product_list,
      price,
      address_send,
      shipping_method,
      payment_method,
      payment_img,
    } = req.body;

    const existUser = await User.findOne({ line_id: customer_id });
    if (!existUser) {
      const error = new Error("No User in system!!");
      error.statusCode = 400;
      throw error;
    }

    let order = new Order();
    order.customer_id = customer_id;
    order.product_list = product_list;
    order.price = price;
    order.address_send = address_send;
    order.shipping_method = shipping_method;
    order.payment_method = payment_method;
    order.payment_img = payment_img;

    const orderDetail = await order.save();

    return res.status(200).json({
      ...responseMessage.success,
      orderId: orderDetail._id,
    });
  } catch (error) {
    next(error);
  }
};
