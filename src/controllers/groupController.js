const Group = require("../models/groupModel.js");
const User = require("../models/userModel.js");
const { assignSecretSantas } = require("../assignSecretSantas.js");

// CRUD : create a new group
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

// CRUD : get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("admin", "email");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD : get one group
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

// CRUD : update group
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
      if (existingGroup.members.length < 2) {
        return res
          .status(400)
          .json({ error: "Not enough members for Secret Santa" });
      }
      existingGroup.secretSantaAssignments = assignSecretSantas(
        existingGroup.members
      );
    }

    const updatedGroup = await existingGroup.save();

    res
      .status(200)
      .json({ message: "Group updated successfully", group: updatedGroup });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD : delete group
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
