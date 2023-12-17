const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const saltRounds = 10;

// User Registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    await registerSchema.validate({ username, email, password });

    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance with the hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const user = await newUser.save();

    res.status(201).json({ message: `Created User ${user.email}` });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await loginSchema.validate({ email, password });

    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    if (!user) {
      res.status(500).json({ message: "User not found" });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      // If the password is valid, generate a JWT token with user data
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });

      // Respond with the generated JWT token
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Email or password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error has been detected." });
  }
};
