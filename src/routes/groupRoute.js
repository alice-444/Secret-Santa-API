const express = require("express");
const router = express.Router();
const jwt = require("../middlewares/jwt.js");

const groupController = require("../controllers/groupController.js");

// router.use(jwt.verifyToken);

router.route("/").post(groupController.getAllGroups);

router.route("/").post(groupController.createGroup);

router.route("/groups/:id_group/invite").post(groupController.inviteMembers);

router.route("/response-invitation").post(groupController.responseInvitation);

router
  .route("/:id_group")
  .get(groupController.getGroupById)
  .put(groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;
