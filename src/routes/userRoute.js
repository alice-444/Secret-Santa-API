const express = require("express");
const router = express.Router();
const jwt = require("../middlewares/jwt.js");

const userController = require("../controllers/userController.js");

// router.route("/").get(userController.getAllUsers);

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

router.route("/users/:id_user");
// .all(jwt.verifyToken)
// .get(userController.getUser)
// .put(userController.updateUser)
// .delete(userController.deleteUser);

module.exports = router;
