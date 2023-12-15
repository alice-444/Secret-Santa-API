const express = require("express");
const router = express.Router();
const jwt = require("../middlewares/jwt.js");

const userController = require("../controllers/userController.js");

router.route("/").get(jwt.verifyToken, userController.getAllUsers);

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

router
  .route("/:id_user")
  .all(jwt.verifyToken)
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

// /**
//  * @openapi
//  * tags: User
//  *   name: Groups
//  *   description: CRUD of groups
//  */

//  server.post('/groups/create', jwtMiddleware.verifyToken, groupController.createAGroup);
// /**
//  * @openapi
//  * /groups/create:
//  *   post:
//  *     summary: Create a new group
//  *     description: Endpoint to create a new group.
//  *     tags: [Groups]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *             required:
//  *               - name
//  *               - id
//  *     responses:
//  *       201:
//  *         description: Group created successfully
//  *         content:
//  *           application/json:
//  *             example: { message: 'Group created successfully and its name is ${name}' }
//  */
