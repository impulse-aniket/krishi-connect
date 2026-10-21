const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================
// REGISTER USER
// =========================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message:
          "Please provide name, email, password and phone",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "farmer",
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    console.error(
      "Registration Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};


// =========================
// LOGIN USER
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error during login",
    });
  }
};


// =========================
// GET MY PROFILE
// =========================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
};


// =========================
// UPDATE MY PROFILE
// =========================
const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) {
      user.name = name;
    }

    if (phone) {
      user.phone = phone;
    }

    if (location !== undefined) {
      user.location = location;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        location: updatedUser.location,
      },
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
};