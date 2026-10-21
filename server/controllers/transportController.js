
const TransportRequest = require("../models/TransportRequest");
const Order = require("../models/Order");
const Vehicle = require("../models/Vehicle");
const {
  createNotification,
  notifyUsersByRole,
} = require("../utils/notificationHelper");

// CREATE TRANSPORT REQUEST
const createTransportRequest = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can request transport",
      });
    }

    const {
      orderId,
      pickupLocation,
      deliveryLocation,
      requestedDate,
      transportCost,
      notes,
    } = req.body;

    if (!orderId || !pickupLocation || !deliveryLocation || !requestedDate) {
      return res.status(400).json({
        message: "Please provide all transport details",
      });
    }

    const date = new Date(requestedDate);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid requested date",
      });
    }

    if (
      transportCost !== undefined &&
      (!Number.isFinite(Number(transportCost)) ||
        Number(transportCost) < 0)
    ) {
      return res.status(400).json({
        message: "Transport cost cannot be negative",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      farmer: req.user.id,
    }).populate("crop");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Transport cannot be requested for a cancelled order",
      });
    }

    if (!order.crop) {
      return res.status(404).json({
        message: "Crop associated with this order was not found",
      });
    }

    const existingRequest = await TransportRequest.findOne({
      order: orderId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Transport has already been requested for this order",
      });
    }

    const request = await TransportRequest.create({
      order: order._id,
      farmer: req.user.id,
      pickupLocation,
      deliveryLocation,
      quantity: order.quantity,
      unit: order.crop.unit,
      requestedDate: date,
      transportCost: transportCost || 0,
      notes: notes || "",
    });

    // Notify all transport providers about the new request.
    await notifyUsersByRole({
      role: "transportProvider",
      title: "New Transport Request",
      message: `A farmer needs transport for ${order.crop.cropName || "a crop"}. Pickup: ${pickupLocation}. Delivery: ${deliveryLocation}.`,
      type: "transport",
    });

    const populatedRequest = await TransportRequest.findById(request._id)
      .populate("order", "quantity pricePerUnit totalAmount status")
      .populate("farmer", "name email phone location");

    return res.status(201).json({
      message: "Transport request created successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create Transport Request Error:", error.message);

    return res.status(500).json({
      message: "Server error while creating transport request",
    });
  }
};

// GET FARMER TRANSPORT REQUESTS
const getFarmerTransportRequests = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can view their transport requests",
      });
    }

    const requests = await TransportRequest.find({
      farmer: req.user.id,
    })
      .populate("order", "quantity pricePerUnit totalAmount status")
      .populate("provider", "name phone location")
      .populate("vehicle", "vehicleNumber vehicleType capacity unit")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Farmer Transport Requests Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching transport requests",
    });
  }
};

// GET PROVIDER REQUESTS
const getProviderRequests = async (req, res) => {
  try {
    if (req.user.role !== "transportProvider") {
      return res.status(403).json({
        message: "Only transport providers can view transport requests",
      });
    }

    const requests = await TransportRequest.find({
      status: "pending",
    })
      .populate("order", "quantity pricePerUnit totalAmount status")
      .populate("farmer", "name email phone location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Provider Requests Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching transport requests",
    });
  }
};

// GET PROVIDER ASSIGNMENTS
const getProviderAssignments = async (req, res) => {
  try {
    if (req.user.role !== "transportProvider") {
      return res.status(403).json({
        message: "Only transport providers can view assignments",
      });
    }

    const requests = await TransportRequest.find({
      provider: req.user.id,
    })
      .populate("order", "quantity pricePerUnit totalAmount status")
      .populate("farmer", "name email phone location")
      .populate("vehicle", "vehicleNumber vehicleType capacity unit")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Provider Assignments Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching assignments",
    });
  }
};

// ACCEPT TRANSPORT REQUEST
const acceptTransportRequest = async (req, res) => {
  try {
    if (req.user.role !== "transportProvider") {
      return res.status(403).json({
        message: "Only transport providers can accept requests",
      });
    }

    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({
        message: "Please select a vehicle",
      });
    }

    const request = await TransportRequest.findOne({
      _id: req.params.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Transport request not found or already processed",
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      provider: req.user.id,
      status: "available",
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Available vehicle not found",
      });
    }

    if (vehicle.unit === request.unit && vehicle.capacity < request.quantity) {
      return res.status(400).json({
        message: "Vehicle capacity is insufficient for this request",
      });
    }

    request.provider = req.user.id;
    request.vehicle = vehicle._id;
    request.status = "accepted";
    request.deliveryStatus = "pickup_pending";

    await request.save();

    vehicle.status = "busy";
    await vehicle.save();

    await Order.findByIdAndUpdate(request.order, {
      deliveryStatus: "pending",
    });

    // Notify the farmer that a provider accepted the request.
    await createNotification({
      user: request.farmer,
      title: "Transport Request Accepted",
      message: "A transport provider accepted your request. Pickup is pending.",
      type: "transport",
    });

    return res.status(200).json({
      message: "Transport request accepted successfully",
      request,
    });
  } catch (error) {
    console.error("Accept Transport Request Error:", error.message);

    return res.status(500).json({
      message: "Server error while accepting transport request",
    });
  }
};

// REJECT TRANSPORT REQUEST
const rejectTransportRequest = async (req, res) => {
  try {
    if (req.user.role !== "transportProvider") {
      return res.status(403).json({
        message: "Only transport providers can reject requests",
      });
    }

    const request = await TransportRequest.findOne({
      _id: req.params.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Transport request not found",
      });
    }

    request.status = "rejected";
    await request.save();

    // Notify the farmer about rejection.
    await createNotification({
      user: request.farmer,
      title: "Transport Request Rejected",
      message: "A transport provider rejected your request. You can submit another request if needed.",
      type: "transport",
    });

    return res.status(200).json({
      message: "Transport request rejected",
    });
  } catch (error) {
    console.error("Reject Transport Request Error:", error.message);

    return res.status(500).json({
      message: "Server error while rejecting transport request",
    });
  }
};

// UPDATE DELIVERY STATUS
const updateTransportStatus = async (req, res) => {
  try {
    if (req.user.role !== "transportProvider") {
      return res.status(403).json({
        message: "Only transport providers can update delivery status",
      });
    }

    const { deliveryStatus } = req.body;

    const allowedStatuses = [
      "pickup_pending",
      "picked_up",
      "in_transit",
      "delivered",
    ];

    if (!allowedStatuses.includes(deliveryStatus)) {
      return res.status(400).json({
        message: "Invalid delivery status",
      });
    }

    const request = await TransportRequest.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!request) {
      return res.status(404).json({
        message: "Transport assignment not found",
      });
    }

    const previousStatus = request.deliveryStatus;

    if (previousStatus === "delivered") {
      return res.status(400).json({
        message: "This delivery has already been completed",
      });
    }

    const allowedTransitions = {
      pickup_pending: ["picked_up"],
      picked_up: ["in_transit"],
      in_transit: ["delivered"],
    };

    if (
      previousStatus !== deliveryStatus &&
      !(allowedTransitions[previousStatus] || []).includes(deliveryStatus)
    ) {
      return res.status(400).json({
        message: `Cannot change delivery status from ${previousStatus} to ${deliveryStatus}`,
      });
    }

    request.deliveryStatus = deliveryStatus;

    if (deliveryStatus === "delivered") {
      request.status = "completed";

      await Vehicle.findByIdAndUpdate(request.vehicle, {
        status: "available",
      });

      await Order.findByIdAndUpdate(request.order, {
        deliveryStatus: "delivered",
      });
    } else if (deliveryStatus === "in_transit") {
      await Order.findByIdAndUpdate(request.order, {
        deliveryStatus: "in_transit",
      });
    } else if (deliveryStatus === "picked_up") {
      await Order.findByIdAndUpdate(request.order, {
        deliveryStatus: "pending",
      });
    }

    await request.save();

    const statusMessages = {
      pickup_pending: "Pickup is pending.",
      picked_up: "Your crop has been picked up.",
      in_transit: "Your crop is now in transit.",
      delivered: "Your crop has been delivered successfully.",
    };

    // Notify the farmer about the delivery progress.
    await createNotification({
      user: request.farmer,
      title: "Delivery Status Updated",
      message: statusMessages[deliveryStatus],
      type: "transport",
    });

    return res.status(200).json({
      message: "Delivery status updated successfully",
      request,
    });
  } catch (error) {
    console.error("Update Transport Status Error:", error.message);

    return res.status(500).json({
      message: "Server error while updating delivery status",
    });
  }
};

module.exports = {
  createTransportRequest,
  getFarmerTransportRequests,
  getProviderRequests,
  getProviderAssignments,
  acceptTransportRequest,
  rejectTransportRequest,
  updateTransportStatus,
};
