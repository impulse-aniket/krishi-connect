const express = require("express");

const {
  createStorageBooking,
  getFarmerBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelStorageBooking,
} = require("../controllers/storageBookingController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createStorageBooking
);

router.get(
  "/farmer",
  protect,
  getFarmerBookings
);

router.get(
  "/owner",
  protect,
  getOwnerBookings
);

router.put(
  "/:id/status",
  protect,
  updateBookingStatus
);

router.put(
  "/:id/cancel",
  protect,
  cancelStorageBooking
);

module.exports = router;