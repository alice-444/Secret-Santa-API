const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    let newUser = new User(req.body);
    let user = await newUser.save();
    res
      .status(201)
      .json({ message: `Created User ${(user.username, user.email)}` });
  } catch (error) {
    res.status(401).json({ message: "Invalid request" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(500).json({ message: "User not found" });
      return;
    }

    if (user.email === req.body.email && user.password === req.body.password) {
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
      };
      const token = await jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Email or password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error has been detected." });
  }
};
