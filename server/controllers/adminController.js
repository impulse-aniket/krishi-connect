const User = require("../models/User");
const Crop = require("../models/Crop");
const Order = require("../models/Order");
const StorageBooking = require("../models/StorageBooking");
const TransportRequest = require("../models/TransportRequest");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const farmers = await User.countDocuments({
      role: "farmer",
    });

    const buyers = await User.countDocuments({
      role: "buyer",
    });

    const storageOwners = await User.countDocuments({
      role: "coldStorageOwner",
    });

    const transportProviders = await User.countDocuments({
      role: "transportProvider",
    });

    const totalCrops = await Crop.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalStorageBookings =
      await StorageBooking.countDocuments();

    const totalTransportRequests =
      await TransportRequest.countDocuments();

    res.status(200).json({
      totalUsers,
      farmers,
      buyers,
      storageOwners,
      transportProviders,
      totalCrops,
      totalOrders,
      totalStorageBookings,
      totalTransportRequests,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error.message);

    res.status(500).json({
      message: "Server error while fetching admin statistics",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error.message);

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
};