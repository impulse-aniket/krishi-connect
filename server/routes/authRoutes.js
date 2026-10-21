const express = require("express");

const {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);


// Get profile
router.get("/profile", protect, getMyProfile);


// Update profile
router.put("/profile", protect, updateMyProfile);


module.exports = router;