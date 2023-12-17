const Group = require("../models/groupModel.js");
const { createGroupSchema, updateGroupSchema } = require("../validators.js");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    await createGroupSchema.validate(req.body);

    const { name } = req.body;
    const adminId = req.user.id;

    // Check if a group with the same name already exists
    const existingGroup = await Group.findOne({ name });

    if (existingGroup) {
      return res
        .status(400)
        .json({ message: "A group with the same name already exists" });
    }

    // Create a new group with the provided name and admin ID
    const group = new Group({ name, admin: adminId });
    // Add the admin as a member
    group.members.push(adminId);
    await group.save();

    res
      .status(201)
      .json({ message: "Group created successfully", groupId: group._id });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific group by ID
exports.getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id_group;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a group by ID
exports.updateGroup = async (req, res) => {
  try {
    await updateGroupSchema.validate(req.body);

    const groupId = req.params.id_group;

    const updatedGroup = await Group.findByIdAndUpdate(groupId, req.body, {
      new: true,
    });

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a group by ID
exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id_group;

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
