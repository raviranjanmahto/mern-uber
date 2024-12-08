require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");

const DATABASE_URI = process.env.DATABASE_URI;

const app = express();

app.use(cors());
app.use(express.json());

dbConnect(DATABASE_URI);

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

app.use(errorGlobalMiddleware);

module.exports = app;
