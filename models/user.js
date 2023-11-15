const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const schema = new mongoose.Schema(
  {
    uid: {
      type: String,
      index: true,
      default: () => uuidv4(),
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true, trim: true, minlength: 5 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    tel: { type: String, unique: true },
    role: { type: String, default: "admin" },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "users" }
);

schema.methods.encryPassword = async function (password) {
  const salt = await bcrypt.genSalt(5);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

schema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

const user = mongoose.model("user", schema);

module.exports = user;
