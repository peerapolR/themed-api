var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new mongoose.Schema(
  {
    coupon_name: { type: String, required: true },
    coupon_code: { type: String, required: true, unique: true },
    coupon_cat: { type: Schema.Types.Mixed, default: "all" },
    discount_per: { type: Number },
    discount_num: { type: Number },
    expired_date: { type: Date },
    used_date: { type: Date },
    createdBy: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "coupons" }
);

const coupon = mongoose.model("coupon", schema);

module.exports = coupon;
