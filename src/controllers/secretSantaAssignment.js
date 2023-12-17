const Group = require("../models/groupModel.js");

// Function to apply the Secret Santa algorithm
const applySecretSantaAlgorithm = (members) => {
  // Create a shuffled copy of the members array
  const shuffledMembers = [...members];
  for (let i = shuffledMembers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements to shuffle the array
    [shuffledMembers[i], shuffledMembers[j]] = [
      shuffledMembers[j],
      shuffledMembers[i],
    ];
  }

  // Generate Secret Santa assignments
  const assignments = [];
  for (let i = 0; i < members.length; i++) {
    const currentMember = members[i];
    const assignedMember = shuffledMembers[(i + 1) % members.length];
    assignments.push({
      giver: currentMember._id,
      receiver: assignedMember._id,
    });
  }

  return assignments;
};

// Assign Secret Santa
exports.secretSantaAssignment = async (req, res) => {
  try {
    const groupId = req.body.groupId;

    // Retrieve the group members from the database
    const group = await Group.findById(groupId).populate("members", "_id");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if there are enough members for Secret Santa
    if (group.members.length < 2) {
      return res
        .status(400)
        .json({ message: "Not enough members for Secret Santa" });
    }

    const assignments = applySecretSantaAlgorithm(group.members);

    // Save the assignments in the database
    group.secretSantaAssignments = assignments;
    await group.save();

    res
      .status(200)
      .json({ message: "Secret Santa assignments completed", assignments });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
