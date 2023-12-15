const Group = require("../models/groupModel.js");
const User = require("../models/userModel.js");
const jwt = require("../middlewares/jwt.js");

const generateInvitationToken = (groupId, email) => {
  const secretKey = process.env.INVITATION_SECRET_KEY;
  const payload = { groupId, email };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

exports.createGroup = async (req, res) => {
  try {
    const { name, admin, members } = req.body;

    const selectedAdmin =
      admin || (members && members.length > 0 ? members[0] : null);

    const adminUser = await User.findById(selectedAdmin);
    if (!adminUser) {
      return res.status(400).json({ error: "Invalid admin user" });
    }

    if (members) {
      const invalidMembers = await User.find({ _id: { $in: members } });
      if (invalidMembers.length !== members.length) {
        return res.status(400).json({ error: "Invalid member users" });
      }
    }

    const newGroup = new Group({ name, admin: selectedAdmin, members });
    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    return res.status(400).json({ error: "Group name must be unique" });
  }
  res.status(500).json({ error: "Internal server error" });
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("admin", "email");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id_group;
    const group = await Group.findById(groupId).populate("admin", "email");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//pb: on ne peut pas ajouter ou supprimer des membres, à refaire

// exports.updateGroup = async (req, res) => {
//   try {
//     const groupId = req.params.id_group;
//     const { name } = req.body;

//     const existingGroup = await Group.findById(groupId);
//     if (!existingGroup) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     if (name && name !== existingGroup.name) {
//       const isNameUnique = await Group.findOne({ name });
//       if (isNameUnique) {
//         return res.status(400).json({ error: "Group name must be unique" });
//       }
//     }

//     existingGroup.name = name;
//     const updatedGroup = await existingGroup.save();

//     res
//       .status(200)
//       .json({ message: "Group updated successfully", group: updatedGroup });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id_group;

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.inviteMembers = async (req, res) => {
  try {
    const groupId = req.params.id_group;
    const { emails } = req.body;

    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    const userId = req.user.id;
    if (existingGroup.admin.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Only the group admin can invite members" });
    }

    const invitationTokens = emails.map((email) =>
      generateInvitationToken(groupId, email)
    );

    res.status(200).json({
      message: "Invitations sent successfully",
      tokens: invitationTokens,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

function generateInvitationToken(groupId, email) {
  const secretKey = process.env.INVITATION_SECRET_KEY;
  const payload = { groupId, email };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
}

exports.responseInvitation = async (req, res) => {
  try {
    const { token, acceptInvitation } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Invalid token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.INVITATION_SECRET_KEY);

    const { groupId, email } = decodedToken;

    const userId = req.user.id;
    const invitedUser = await User.findOne({ email });
    if (!invitedUser || invitedUser.id !== userId) {
      return res
        .status(403)
        .json({ error: "Invalid user or unauthorized access" });
    }

    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (acceptInvitation) {
      res.status(200).json({ message: "Invitation accepted" });
    } else {
      res.status(200).json({ message: "Invitation declined" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
