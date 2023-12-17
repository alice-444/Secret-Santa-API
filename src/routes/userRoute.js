const express = require("express");
const router = express.Router();
const jwt = require("../middlewares/jwt.js");

const auth = require("../controllers/auth.js");

router.route("/register").post(auth.register);
router.route("/login").post(auth.login);

// Je n'ai pas pu proteger les routes avec le jwt parce que sinon le crud du user ne marche plus

const userController = require("../controllers/userController.js");
router.route("/").get(userController.getAllUsers);

router
  .route("/:id_user")
  .all(jwt.verifyToken)
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

// Swagger API routes
/**
 * @openapi
 * tags:
 *   name: Users
 *   description: CRUD operations for user
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type :string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user login.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Email or password incorrect
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Endpoint to retrieve all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users/{id_user}:
 *   get:
 *     summary: Get user by ID
 *     description: Endpoint to retrieve a user by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update user by ID
 *     description: Endpoint to update a user by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete user by ID
 *     description: Endpoint to delete a user by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
