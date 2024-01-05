const generatePayload = require("promptpay-qr");
const qrcode = require("qrcode");
const fs = require("fs");

module.exports = async () => {
  const mobileNumber = "083-035-7083";
  // const IDCardNumber = "0-0000-00000-00-0";
  const amount = 1;
  const payload = generatePayload(mobileNumber, { amount });

  // Convert to SVG QR Code
  const options = { type: "svg", color: { dark: "#000", light: "#fff" } };
  qrcode.toString(payload, options, (err, svg) => {
    if (err) return console.log(err);
    fs.writeFileSync("./qr.svg", svg);
  });

  return payload;
};
