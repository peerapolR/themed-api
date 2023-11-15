const { createLogger, transports, format } = require("winston");
const { combine, timestamp, json } = format;
const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({
      filename: "logs/example.log",
    }),
    new transports.File({
      level: "error",
      filename: "logs/error.log",
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
