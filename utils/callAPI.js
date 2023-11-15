const axios = require("axios");
module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    axios
      .get(`${url}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
