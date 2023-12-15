const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { signSchema, updateSchema } = require("../validators.js");

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// to register - CRUD : create a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    await signSchema.validate({ email, password });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // faille of security
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// to login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await signSchema.validate({ email, password });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Email or password incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD : get all users
exports.getAllUsers = async (req, res) => {
  try {
    // if (!req.user) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD : get one user
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id_user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD : update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id_user;
    const updates = req.body;

    await updateSchema.validate(updates);

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD : delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id_user;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
