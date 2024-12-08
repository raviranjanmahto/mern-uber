const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);

module.exports = router;
