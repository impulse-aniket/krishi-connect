const express = require("express");

const {
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliveryStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// BUYER ORDERS
router.get(
  "/buyer",
  protect,
  getBuyerOrders
);

// FARMER ORDERS
router.get(
  "/farmer",
  protect,
  getFarmerOrders
);

// SINGLE ORDER
router.get(
  "/:id",
  protect,
  getOrderById
);

// UPDATE ORDER STATUS
router.put(
  "/:id/status",
  protect,
  updateOrderStatus
);

// UPDATE DELIVERY STATUS
router.put(
  "/:id/delivery-status",
  protect,
  updateDeliveryStatus
);

module.exports = router;