const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Asset = require("../models/asset");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const s3url = require("../utils/content");
const getFormatDate = require("../utils/getFormatDate");
const getTodatDate = require("../utils/getTodatDate");

exports.create = async (req, res, next) => {
  try {
    const {
      sales_type,
      asset_name,
      project_name,
      asset_type,
      asset_price,
      asset_rent,
      asset_location,
      asset_address,
      asset_image,
      area,
      usable_area,
      floor,
      all_room,
      bedroom,
      restroom,
      parking,
      lat,
      long,
      pet,
      new_project,
      penthouses,
      first_hand,
      foreign,
      luxury_condo,
      duplex,
      reservation_missed,
      property_rights,
      facilities,
      project_desc,
      firstname,
      isSpecial,
    } = req.body;

    //ชื่อไม่ซ้ำ
    const existAsset = await Asset.findOne({ asset_name });
    if (existAsset) {
      const error = new Error("Asset Name already exist!!");
      error.statusCode = 400;
      throw error;
    }

    let asset = new Asset({
      sales_type,
      asset_name,
      project_name,
      asset_type,
      asset_price,
      asset_rent,
      asset_location,
      asset_address,
      asset_image,
      area,
      usable_area,
      floor,
      all_room,
      bedroom,
      restroom,
      parking,
      lat,
      long,
      pet,
      new_project,
      penthouses,
      first_hand,
      foreign,
      luxury_condo,
      duplex,
      reservation_missed,
      property_rights,
      facilities,
      project_desc,
      created_by: firstname,
      isSpecial,
    });

    await asset.save();
    return res.status(201).json({
      ...responseMessage.success,
      data: "Asset has been created",
    });
  } catch (error) {
    next(error);
  }
};

exports.assetsList = async (req, res, next) => {
  try {
    const assetList = await Asset.find()
      .select("-created_by -updatedAt -__v -asset_id -isActive -isSpecial")
      .where("isActive")
      .eq(true)
      .sort({ asset_name: 1 })
      .lean();
    let newData = [];
    let totalForSale = 0;
    let totalForRent = 0;
    assetList.forEach((e) => {
      const formatDate = getFormatDate(e.createdAt);
      const formated = { ...e, createdAt: formatDate };

      totalForSale = totalForSale + e.asset_price;
      totalForRent = totalForRent + e.asset_rent;
      newData.push(formated);
    });

    return res.status(200).json({
      ...responseMessage.success,
      data: newData,
      totalSalePrice: totalForSale,
      totalRentPrice: totalForRent,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findOne()
      .select("-created_by -createdAt -updatedAt -__v")
      .where("_id")
      .eq(id)
      .where("isActive")
      .eq(true)
      .lean();
    if (asset === null) {
      const error = new Error("Asset not found");
      error.statusCode = 404;
      throw error;
    } else {
      return res.status(200).json({
        ...responseMessage.success,
        data: asset,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteAsset = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const asset = await Asset.findOne({ _id: _id });

    if (asset === null || asset.isActive === false) {
      const error = new Error("Asset not found");
      error.statusCode = 404;
      throw error;
    } else {
      await Asset.updateOne({ _id: _id }, { isActive: false });

      return res.status(200).json({
        ...responseMessage.success,
        data: `Asset id : ${_id} has been deleted!!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      sales_type,
      project_name,
      asset_type,
      asset_price,
      asset_rent,
      asset_location,
      asset_address,
      asset_image,
      area,
      usable_area,
      floor,
      all_room,
      bedroom,
      restroom,
      parking,
      lat,
      long,
      pet,
      new_project,
      penthouses,
      first_hand,
      foreign,
      luxury_condo,
      duplex,
      reservation_missed,
      property_rights,
      facilities,
      project_desc,
      isSpecial,
    } = req.body;

    // Validate
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const error = new Error("format invalid");
    //   error.statusCode = 422;
    //   error.validation = errors.array();
    //   throw error;
    // }

    const existAsset = await Asset.findOne().where("_id").eq(id);
    if (!existAsset) {
      const error = new Error("Asset not found");
      error.statusCode = 404;
      throw error;
    }

    const editAsset = await Asset.updateOne(
      { _id: id },
      {
        sales_type,
        project_name,
        asset_type,
        asset_price,
        asset_rent,
        asset_location,
        asset_address,
        asset_image,
        area,
        usable_area,
        floor,
        all_room,
        bedroom,
        restroom,
        parking,
        lat,
        long,
        pet,
        new_project,
        penthouses,
        first_hand,
        foreign,
        luxury_condo,
        duplex,
        reservation_missed,
        property_rights,
        facilities,
        project_desc,
        isSpecial,
      }
    );
    if (editAsset.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: `Asset ID ${id} has been updated`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.publicUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const today = await getTodatDate();

    const asset = await Asset.findOne().where("_id").eq(id);
    if (!asset) {
      const error = new Error("Asset not found");
      error.statusCode = 404;
      throw error;
    }
    let update;
    if (["draft", "cancle"].includes(asset.status)) {
      update = await Asset.updateOne(
        { _id: id },
        {
          status: "public",
          public_at: today,
        }
      );
    } else if (asset.status === "public") {
      update = await Asset.updateOne(
        { _id: id },
        {
          status: "cancle",
          public_at: null,
        }
      );
    }

    if (update.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      return res.status(200).json({
        ...responseMessage.success,
        data: `Asset status id : ${id} has been update`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAssetBySpecial = async (req, res, next) => {
  try {
    const assetList = await Asset.find()
      .select("-created_by -createdAt -updatedAt -__v")
      .where("isActive")
      .eq(true)
      .where("isSpecial")
      .eq(true)
      .sort({ asset_name: 1 })
      .lean();

    return res.status(200).json({
      ...responseMessage.success,
      data: assetList,
    });
  } catch (error) {
    next(error);
  }
};
