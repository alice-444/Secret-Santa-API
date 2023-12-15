const express = require("express");
const router = express.Router();
const jwt = require("../middlewares/jwt.js");

const groupController = require("../controllers/groupController.js");
const invitationController = require("../controllers/invitationController.js");

router.route("/").post(groupController.getAllGroups);

router.route("/").post(jwt.verifyToken, groupController.createGroup);

router
  .route("/groups/:id_group/invite")
  .post(invitationController.inviteMembers);

router.route("/invitation").post(invitationController.responseInvitation);

// router
//   .route("/groups/:id_group/assign-secret-santas")
//   .post(groupController.assignSecretSantas);

router
  .route("/:id_group")
  .get(groupController.getGroupById)
  .put(groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;

/**
 * @openapi
 * tags:
 *   name: Groups
 *   description: CRUD operations for groups
 */

/**
 * @openapi
 * /groups:
 *   post:
 *     summary: Create a new group
 *     description: Endpoint to create a new group.
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Validation error or group name must be unique
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Get all groups
 *     description: Retrieve a list of all groups.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/{id_group}:
 *   get:
 *     summary: Get group by ID
 *     description: Retrieve a group by its ID.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update group by ID
 *     description: Endpoint to update a group by its ID.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
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
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Validation error or group name must be unique
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete group by ID
 *     description: Endpoint to delete a group by its ID.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/{id_group}/invite:
 *   post:
 *     summary: Invite members to a group
 *     description: Endpoint to invite members to a group.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
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
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - emails
 *     responses:
 *       200:
 *         description: Invitations sent successfully
 *       403:
 *         description: Only the group admin can invite members
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/invitation:
 *   post:
 *     summary: Respond to a group invitation
 *     description: Endpoint to respond to a group invitation.
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               acceptInvitation:
 *                 type: boolean
 *             required:
 *               - token
 *               - acceptInvitation
 *     responses:
 *       200:
 *         description: Invitation accepted or declined
 *       400:
 *         description: Invalid token provided
 *       403:
 *         description: Invalid user or unauthorized access
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
