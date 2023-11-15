const config = require("../config/index");
const aws = require("aws-sdk");
module.exports = (content) => {
  const s3 = new aws.S3({
    endpoint: config.s3.endpoint,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    signatureVersion: config.s3.signatureVersion,
    region: config.s3.region,
  });
  const s3url = s3.getSignedUrl("getObject", {
    Bucket: config.s3.bucket,
    Key: content,
    Expires: 10800,
  });
  return s3url;
};
