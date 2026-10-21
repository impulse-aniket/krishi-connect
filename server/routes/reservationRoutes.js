const express = require("express");

const {
  createReservation,
  getBuyerReservations,
  getFarmerReservations,
  updateReservationStatus,
  cancelReservation,
} = require("../controllers/reservationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE RESERVATION
router.post(
  "/",
  protect,
  createReservation
);

// BUYER RESERVATIONS
router.get(
  "/buyer",
  protect,
  getBuyerReservations
);

// FARMER RESERVATION REQUESTS
router.get(
  "/farmer",
  protect,
  getFarmerReservations
);

// FARMER ACCEPT / REJECT
router.put(
  "/:id/status",
  protect,
  updateReservationStatus
);

// BUYER CANCEL
router.put(
  "/:id/cancel",
  protect,
  cancelReservation
);

module.exports = router;