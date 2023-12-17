const express = require("express");
const router = express.Router();

const groupController = require("../controllers/groupController");

// Je n'ai pas pu proteger les routes avec le jwt parce que sinon le crud du user ne marche plus

router.get("/all", groupController.getAllGroups);

router
  .route("/:id_group")
  .post(groupController.createGroup)
  .get(groupController.getGroupById)
  .put(groupController.updateGroup)
  .delete(groupController.deleteGroup);

const invitationController = require("../controllers/invitationController.js");

router.post("/invite", invitationController.inviteToGroup);

router.post("/accept-invitation", invitationController.acceptInvitation);

router.post("/decline-invitation", invitationController.declineInvitation);

const secretSantaAssignment = require("../controllers/secretSantaAssignment.js");

router.post(
  "/secret-santa-assignment",
  secretSantaAssignment.secretSantaAssignment
);

module.exports = router;

// Swagger API routes
/**
 * @openapi
 * tags:
 *   name: Groups
 *   description: CRUD operations for groups and invitations
 */

/**
 * @openapi
 * /groups/all:
 *   get:
 *     summary: Get all groups
 *     description: Endpoint to retrieve all groups.
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
 *   post:
 *     summary: Create a new group
 *     description: Endpoint to create a new group.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get group by ID
 *     description: Endpoint to retrieve a group by ID.
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
 *     description: Endpoint to update a group by ID.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete group by ID
 *     description: Endpoint to delete a group by ID.
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
 * /groups/invite:
 *   post:
 *     summary: Invite user to a group
 *     description: Endpoint to invite a user to a group.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/accept-invitation:
 *   post:
 *     summary: Accept group invitation
 *     description: Endpoint to accept a group invitation.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/decline-invitation:
 *   post:
 *     summary: Decline group invitation
 *     description: Endpoint to decline a group invitation.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Invitation declined successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/secret-santa-assignment:
 *   post:
 *     summary: Perform Secret Santa assignment for a group
 *     description: Endpoint to perform Secret Santa assignment for the members of a group.
 *     tags: [Groups]
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Group ID for which Secret Santa assignment needs to be performed.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             groupId:
 *               type: string
 *           required:
 *             - groupId
 *     responses:
 *       200:
 *         description: Secret Santa assignments completed successfully
 *       404:
 *         description: Group not found
 *       400:
 *         description: Not enough members for Secret Santa
 *       500:
 *         description: Internal server error
 */
