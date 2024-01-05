const express = require("express");
const cors = require("cors");
const corsOptions = {
  // origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("./config/index");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const couponsRouter = require("./routes/coupons");
const lineMessagesRouter = require("./routes/lineMessages");

const errorHandler = require("./middlewares/errorHandler");
const passportJWT = require("./middlewares/passportJWT");
const checkRole = require("./middlewares/checkRole");

const app = express();
app.use(cors(corsOptions));

TZ = "Asia/Bangkok";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGODB_URI);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/coupons", couponsRouter);
app.use("/line", lineMessagesRouter);

// Check is login
// app.use("/bloods", [passportJWT.isLogin], bloodsRouter);

app.use(errorHandler);
module.exports = app;
