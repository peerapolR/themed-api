var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema(
  {
    order_id: { type: String, unique: true },
    customer_id: { type: String, required: true },
    product_list: { type: Schema.Types.Mixed, required: true },
    price: { type: String, required: true },
    address_send: { type: String },
    shipping_method: { type: String },
    payment_method: { type: String },
    payment_img: { type: String },
    order_status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "reject", "cancle"],
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "orders" }
);

const order = mongoose.model("order", schema);

module.exports = order;
