const bcrypt = require("bcrypt");
const Group = require("../models/groupModel.js");
const User = require("../models/userModel.js");
const inviteToGroupSchema = require("../validators.js");

// Invite users to a group
exports.inviteToGroup = async (req, res) => {
  try {
    const { groupId, emails } = req.body;

    try {
      await inviteToGroupSchema.validate({ groupId, emails });
    } catch (validationError) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Check if the user is the admin of the group
    const group = await Group.findById(groupId);
    if (!group || group.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Permission denied" });
    }

    for (const email of emails) {
      // Check if the invited user is already a member of the group
      if (group.members.includes(req.user.id)) {
        return res
          .status(400)
          .json({ message: "User is already a member of the group" });
      }

      // Generate a unique token for the invitation using bcrypt
      const invitationToken = bcrypt.hashSync(
        `${groupId}-${email}-${new Date().toISOString()}`,
        10
      );

      // Add the invitation to the group
      group.invitations.push({ email, token: invitationToken });
    }

    // Save the updated group with invitations
    await group.save();

    res.status(200).json({ message: "Invitations sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Accept an invitation and join a group
exports.acceptInvitation = async (req, res) => {
  try {
    const { groupId, token } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the invitation exists
    const invitation = group.invitations.find((inv) => inv.token === token);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Check if the user is already a member of the group
    if (group.members.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "User is already a member of the group" });
    }

    // Create a new user if not in the database
    let invitedUser = await User.findOne({ email: invitation.email });
    if (!invitedUser) {
      // Generate a password using bcrypt for the invited user
      const generatedPassword = bcrypt.hashSync(
        `${invitation.email}-${new Date().toISOString()}`,
        10
      );
      invitedUser = new User({
        email: invitation.email,
        password: generatedPassword,
      });
      await invitedUser.save();
    }

    // Add the user to the group members
    group.members.push(invitedUser._id);
    // Remove the invitation from the group
    group.invitations = group.invitations.filter((inv) => inv.token !== token);
    await group.save();

    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Decline an invitation to join a group
exports.declineInvitation = async (req, res) => {
  try {
    const { groupId, token } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the invitation from the group
    group.invitations = group.invitations.filter((inv) => inv.token !== token);
    // Save the updated group without the declined invitation
    await group.save();

    res.status(200).json({ message: "Invitation declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
