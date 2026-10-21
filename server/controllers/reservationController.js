
const Reservation = require("../models/Reservation");
const Crop = require("../models/Crop");
const Order = require("../models/Order");
const {
  createNotification,
} = require("../utils/notificationHelper");

// CREATE RESERVATION
const createReservation = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can create reservations",
      });
    }

    const { cropId, quantity, message } = req.body;

    if (!cropId || !quantity) {
      return res.status(400).json({
        message: "Crop and quantity are required",
      });
    }

    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than zero",
      });
    }

    const crop = await Crop.findOne({
      _id: cropId,
      status: "available",
    });

    if (!crop) {
      return res.status(404).json({
        message: "Crop is no longer available",
      });
    }

    if (crop.farmer.toString() === req.user.id.toString()) {
      return res.status(400).json({
        message: "You cannot reserve your own crop",
      });
    }

    if (Number(quantity) > crop.quantity) {
      return res.status(400).json({
        message: "Requested quantity exceeds available quantity",
      });
    }

    const existingReservation = await Reservation.findOne({
      crop: cropId,
      buyer: req.user.id,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "You already have a reservation for this crop",
      });
    }

    const reservation = await Reservation.create({
      crop: crop._id,
      buyer: req.user.id,
      farmer: crop.farmer,
      quantity: Number(quantity),
      message: message || "",
    });

    crop.status = "reserved";
    await crop.save();

    // Notify farmer about the new reservation.
    await createNotification({
      user: crop.farmer,
      title: "New Crop Reservation",
      message: `A buyer has requested ${quantity} ${crop.unit || "units"} of ${crop.cropName}.`,
      type: "reservation",
    });

    const populatedReservation = await Reservation.findById(
      reservation._id
    )
      .populate(
        "crop",
        "cropName quantity unit expectedPrice location harvestDate"
      )
      .populate("buyer", "name email phone")
      .populate("farmer", "name email phone location");

    return res.status(201).json({
      message: "Crop reserved successfully",
      reservation: populatedReservation,
    });
  } catch (error) {
    console.error("Create Reservation Error:", error.message);

    return res.status(500).json({
      message: "Server error while creating reservation",
    });
  }
};

// GET BUYER RESERVATIONS
const getBuyerReservations = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can view buyer reservations",
      });
    }

    const reservations = await Reservation.find({
      buyer: req.user.id,
    })
      .populate(
        "crop",
        "cropName quantity unit expectedPrice location harvestDate"
      )
      .populate("farmer", "name email phone location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Get Buyer Reservations Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching reservations",
    });
  }
};

// GET FARMER RESERVATION REQUESTS
const getFarmerReservations = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can view reservation requests",
      });
    }

    const reservations = await Reservation.find({
      farmer: req.user.id,
    })
      .populate(
        "crop",
        "cropName quantity unit expectedPrice location"
      )
      .populate("buyer", "name email phone location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Get Farmer Reservations Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching reservation requests",
    });
  }
};

// ACCEPT / REJECT RESERVATION
const updateReservationStatus = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can update reservation status",
      });
    }

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid reservation status",
      });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    }).populate("crop");

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        message: "Reservation has already been processed",
      });
    }

    if (!reservation.crop) {
      return res.status(404).json({
        message: "Crop no longer exists",
      });
    }

    reservation.status = status;
    await reservation.save();

    // REJECT RESERVATION
    if (status === "rejected") {
      await Crop.findByIdAndUpdate(reservation.crop._id, {
        status: "available",
      });

      await createNotification({
        user: reservation.buyer,
        title: "Reservation Rejected",
        message: `Your reservation for ${reservation.crop.cropName} was rejected by the farmer.`,
        type: "reservation",
      });

      return res.status(200).json({
        message: "Reservation rejected successfully",
        reservation,
      });
    }

    // ACCEPT RESERVATION AND CREATE ORDER
    const crop = await Crop.findById(reservation.crop._id);

    if (!crop) {
      return res.status(404).json({
        message: "Crop no longer exists",
      });
    }

    const totalAmount =
      reservation.quantity * crop.expectedPrice;

    const existingOrder = await Order.findOne({
      reservation: reservation._id,
    });

    if (!existingOrder) {
      await Order.create({
        reservation: reservation._id,
        crop: crop._id,
        buyer: reservation.buyer,
        farmer: reservation.farmer,
        quantity: reservation.quantity,
        pricePerUnit: crop.expectedPrice,
        totalAmount,
        status: "confirmed",
        deliveryStatus: "not_started",
      });
    }

    crop.status = "reserved";
    await crop.save();

    await createNotification({
      user: reservation.buyer,
      title: "Reservation Accepted",
      message: `Your reservation for ${crop.cropName} has been accepted. Your order has been created.`,
      type: "reservation",
    });

    return res.status(200).json({
      message: "Reservation accepted and order created successfully",
      reservation,
    });
  } catch (error) {
    console.error("Update Reservation Error:", error.message);

    return res.status(500).json({
      message: "Server error while updating reservation",
    });
  }
};

// CANCEL RESERVATION
const cancelReservation = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can cancel reservations",
      });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      buyer: req.user.id,
    }).populate("crop", "cropName");

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (!["pending", "accepted"].includes(reservation.status)) {
      return res.status(400).json({
        message: "Reservation cannot be cancelled",
      });
    }

    if (reservation.status === "accepted") {
      await Order.findOneAndUpdate(
        { reservation: reservation._id },
        { status: "cancelled" }
      );
    }

    reservation.status = "cancelled";
    await reservation.save();

    await Crop.findByIdAndUpdate(reservation.crop._id, {
      status: "available",
    });

    await createNotification({
      user: reservation.farmer,
      title: "Reservation Cancelled",
      message: `The buyer has cancelled the reservation for ${reservation.crop?.cropName || "your crop"}.`,
      type: "reservation",
    });

    return res.status(200).json({
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Reservation Error:", error.message);

    return res.status(500).json({
      message: "Server error while cancelling reservation",
    });
  }
};

module.exports = {
  createReservation,
  getBuyerReservations,
  getFarmerReservations,
  updateReservationStatus,
  cancelReservation,
};
