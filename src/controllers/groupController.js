const Group = require("../models/groupModel.js");
const User = require("../models/userModel.js");
const jwt = require("../middlewares/jwt.js");
const { assignSecretSantas } = require("../assignSecretSantas.js");

const generateInvitationToken = (groupId, email) => {
  const secretKey = process.env.INVITATION_SECRET_KEY;
  const payload = { groupId, email };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

const generateRandomPassword = () => {
  const length = 10;
  const charsetRegex = /[a-zA-Z0-9]/;
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * (charsetRegex.test("A") ? 26 : 10)) +
        (charsetRegex.test("A") ? 65 : 48)
    );
    password += randomChar;
  }

  return password;
};

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const isNameUnique = await Group.findOne({ name });
    if (isNameUnique) {
      return res.status(400).json({ error: "Group name must be unique" });
    }

    const admin = req.user.id;

    const newGroup = new Group({ name, admin });
    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
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

exports.updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id_group;
    const { name, members, secretSantaAssignments } = req.body;

    const existingGroup = await Group.findById(groupId).populate(
      "members",
      "id name"
    );

    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (name && name !== existingGroup.name) {
      const isNameUnique = await Group.findOne({ name });
      if (isNameUnique) {
        return res.status(400).json({ error: "Group name must be unique" });
      }
      existingGroup.name = name;
    }

    if (members && members.length > 0) {
      const existingUsers = await User.find({ _id: { $in: members } });
      if (existingUsers.length !== members.length) {
        return res.status(400).json({ error: "Invalid members" });
      }
      existingGroup.members = members;
    }

    if (secretSantaAssignments) {
      existingGroup.secretSantaAssignments = secretSantaAssignments;
    }

    const updatedGroup = await existingGroup.save();

    res
      .status(200)
      .json({ message: "Group updated successfully", group: updatedGroup });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id_group;

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
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

exports.responseInvitation = async (req, res) => {
  try {
    const { token, acceptInvitation } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Invalid token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.INVITATION_SECRET_KEY);

    const { groupId, email } = decodedToken;

    const userId = req.user.id;
    let invitedUser = await User.findOne({ email });

    if (!invitedUser) {
      const generatedPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      invitedUser = new User({ email, password: hashedPassword });
      await invitedUser.save();
    }

    if (invitedUser.id !== userId) {
      return res
        .status(403)
        .json({ error: "Invalid user or unauthorized access" });
    }

    const existingGroup = await Group.findById(groupId);

    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (acceptInvitation) {
      existingGroup.members.push(invitedUser);
      await existingGroup.save();

      res.status(200).json({ message: "Invitation accepted" });
    } else {
      res.status(200).json({ message: "Invitation declined" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.assignSecretSantas = async (req, res) => {
  try {
    const groupId = req.params.id_group;
    const group = await Group.findById(groupId).populate("members", "id name");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Appel de la fonction d'attribution des Secret Santas
    const secretSantaAssignments = assignSecretSantas(group.members);

    group.secretSantaAssignments = secretSantaAssignments;
    await group.save();

    res.status(200).json({
      message: "Secret Santas assigned successfully",
      assignments: secretSantaAssignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
