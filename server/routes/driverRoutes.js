const router = require("express").Router();
const driverController = require("../controllers/driverController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware.protect, driverController.createDriver);

module.exports = router;
