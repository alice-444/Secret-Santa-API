const Group = require("../models/groupModel.js");
const User = require("../models/userModel.js");
const jwt = require("../middlewares/jwt.js");

// generator of invitation tokens
const generateInvitationToken = (groupId, email) => {
  const secretKey = process.env.INVITATION_SECRET_KEY;
  const payload = { groupId, email };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

// generator of password
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

// invited member
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

// accepting or refused
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
