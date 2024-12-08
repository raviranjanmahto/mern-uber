require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");

const DATABASE_URI = process.env.DATABASE_URI;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

dbConnect(DATABASE_URI);

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/drivers", driverRoutes);

app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

app.use(errorGlobalMiddleware);

module.exports = app;
