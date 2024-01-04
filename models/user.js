const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    line_name: { type: String, required: true },
    line_id: { type: String, required: true, unique: true },
    line_img: { type: String },
    address: { type: String, required: true },
    tel: { type: String, required: true, trim: true },
    clinic_name: { type: String },
    cert: { type: String, required: true, trim: true },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "users" }
);

const user = mongoose.model("user", schema);

module.exports = user;
