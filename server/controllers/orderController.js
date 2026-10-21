const Order = require("../models/Order");

// GET BUYER ORDERS
const getBuyerOrders = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message:
          "Only buyers can view buyer orders",
      });
    }

    const orders = await Order.find({
      buyer: req.user.id,
    })
      .populate(
        "crop",
        "cropName unit location harvestDate"
      )
      .populate(
        "farmer",
        "name email phone location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get Buyer Orders Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching buyer orders",
    });
  }
};

// GET FARMER ORDERS
const getFarmerOrders = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message:
          "Only farmers can view farmer orders",
      });
    }

    const orders = await Order.find({
      farmer: req.user.id,
    })
      .populate(
        "crop",
        "cropName unit location harvestDate"
      )
      .populate(
        "buyer",
        "name email phone location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get Farmer Orders Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching farmer orders",
    });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "crop",
        "cropName quantity unit location harvestDate"
      )
      .populate(
        "buyer",
        "name email phone location"
      )
      .populate(
        "farmer",
        "name email phone location"
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const userId = req.user.id.toString();

    const isBuyer =
      order.buyer._id.toString() === userId;

    const isFarmer =
      order.farmer._id.toString() === userId;

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({
        message:
          "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error(
      "Get Order Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching order",
    });
  }
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "confirmed",
      "processing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const userId = req.user.id.toString();

    const isBuyer =
      order.buyer.toString() === userId;

    const isFarmer =
      order.farmer.toString() === userId;

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({
        message:
          "You are not authorized to update this order",
      });
    }

    // Farmer controls processing stages
    if (
      isFarmer &&
      ![
        "processing",
        "ready",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Farmer cannot set this order status",
      });
    }

    // Buyer can cancel
    if (
      isBuyer &&
      status !== "cancelled"
    ) {
      return res.status(400).json({
        message:
          "Buyer can only cancel an order",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while updating order",
    });
  }
};

// UPDATE DELIVERY STATUS
const updateDeliveryStatus = async (
  req,
  res
) => {
  try {
    const {
      deliveryStatus,
    } = req.body;

    const allowedStatuses = [
      "not_started",
      "pending",
      "in_transit",
      "delivered",
    ];

    if (
      !allowedStatuses.includes(
        deliveryStatus
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid delivery status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const userId = req.user.id.toString();

    const isBuyer =
      order.buyer.toString() === userId;

    const isFarmer =
      order.farmer.toString() === userId;

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({
        message:
          "You are not authorized to update delivery status",
      });
    }

    order.deliveryStatus =
      deliveryStatus;

    await order.save();

    res.status(200).json({
      message:
        "Delivery status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Delivery Status Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while updating delivery status",
    });
  }
};

module.exports = {
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliveryStatus,
};