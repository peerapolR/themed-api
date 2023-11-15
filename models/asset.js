const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const schema = new mongoose.Schema(
  {
    asset_id: {
      type: String,
      index: true,
      default: () => uuidv4(),
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "public", "sold", "cancle"],
    },
    created_by: { type: String },
    public_at: { type: Date, default: null },
    isSpecial: { type: Boolean, default: false },
    sales_type: { type: String, enum: ["sale", "rent", "both"] },
    asset_name: { type: String, unique: true },
    project_name: { type: String },
    asset_type: { type: String },
    asset_price: { type: Number },
    asset_rent: { type: Number },
    asset_location: { type: String },
    asset_address: { type: String },
    asset_image: { type: String },
    area: { type: String },
    usable_area: { type: String },
    floor: { type: String },
    all_room: { type: String },
    bedroom: { type: String },
    restroom: { type: String },
    parking: { type: String },
    lat: { type: String },
    long: { type: String },
    pet: { type: Boolean },
    new_project: { type: Boolean },
    penthouses: { type: Boolean },
    first_hand: { type: Boolean },
    foreign: { type: Boolean },
    luxury_condo: { type: Boolean },
    duplex: { type: Boolean },
    reservation_missed: { type: Boolean },
    property_rights: { type: String },
    facilities: { type: String },
    project_desc: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "assets" }
);

const asset = mongoose.model("asset", schema);

module.exports = asset;
