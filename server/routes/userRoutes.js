const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/profile", authMiddleware.protect, userController.profile);

router.get("/logout", authMiddleware.protect, userController.logout);

module.exports = router;
