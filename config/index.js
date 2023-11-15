require("dotenv").config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV || "Local",
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  LINE_AUTH: process.env.LINE_AUTH,
  s3: {
    endpoint: process.env.S3_endpoint || "",
    accessKeyId: process.env.S3_accessKeyId || "",
    secretAccessKey: process.env.S3_secretAccessKey || "",
    bucket: process.env.S3_bucket || "",
    acl: process.env.S3_acl || "public-read",
    signatureVersion: process.env.s3_signatureVersion || "v4",
    region: process.env.s3_region || "sgp1",
  },
};
