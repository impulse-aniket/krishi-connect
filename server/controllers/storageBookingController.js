
const StorageBooking = require("../models/StorageBooking");
const ColdStorage = require("../models/ColdStorage");
const {
  createNotification,
} = require("../utils/notificationHelper");

// CREATE STORAGE BOOKING
const createStorageBooking = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can book cold storage",
      });
    }

    const {
      storageId,
      quantity,
      startDate,
      endDate,
      notes,
    } = req.body;

    if (!storageId || !quantity || !startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide all booking details",
      });
    }

    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than zero",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        message: "Please provide valid dates. End date must be after start date",
      });
    }

    const storage = await ColdStorage.findOne({
      _id: storageId,
      status: "available",
    });

    if (!storage) {
      return res.status(404).json({
        message: "Cold storage is not available",
      });
    }

    const bookingQuantity = Number(quantity);

    if (bookingQuantity > storage.availableCapacity) {
      return res.status(400).json({
        message: "Requested quantity exceeds available storage capacity",
      });
    }

    const existingBooking = await StorageBooking.findOne({
      storage: storageId,
      farmer: req.user.id,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already have an active booking for this storage",
      });
    }

    const totalAmount = bookingQuantity * storage.pricePerUnit;

    const booking = await StorageBooking.create({
      storage: storage._id,
      farmer: req.user.id,
      owner: storage.owner,
      quantity: bookingQuantity,
      totalAmount,
      startDate: start,
      endDate: end,
      notes: notes || "",
    });

    // Notify the cold-storage owner.
    await createNotification({
      user: storage.owner,
      title: "New Storage Booking",
      message: `A farmer has requested ${bookingQuantity} ${storage.unit} of storage at ${storage.name}.`,
      type: "storage",
    });

    const populatedBooking = await StorageBooking.findById(booking._id)
      .populate(
        "storage",
        "name location capacity availableCapacity unit pricePerUnit temperature"
      )
      .populate("farmer", "name email phone location")
      .populate("owner", "name email phone location");

    return res.status(201).json({
      message: "Storage booking request created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create Storage Booking Error:", error.message);

    return res.status(500).json({
      message: "Server error while creating storage booking",
    });
  }
};

// GET FARMER BOOKINGS
const getFarmerBookings = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can view their storage bookings",
      });
    }

    const bookings = await StorageBooking.find({
      farmer: req.user.id,
    })
      .populate(
        "storage",
        "name location unit pricePerUnit temperature"
      )
      .populate("owner", "name email phone location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Farmer Bookings Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching bookings",
    });
  }
};

// GET OWNER BOOKINGS
const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "coldStorageOwner") {
      return res.status(403).json({
        message: "Only storage owners can view booking requests",
      });
    }

    const bookings = await StorageBooking.find({
      owner: req.user.id,
    })
      .populate(
        "storage",
        "name location capacity availableCapacity unit pricePerUnit"
      )
      .populate("farmer", "name email phone location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Owner Bookings Error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching booking requests",
    });
  }
};

// ACCEPT / REJECT BOOKING
const updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "coldStorageOwner") {
      return res.status(403).json({
        message: "Only storage owners can update bookings",
      });
    }

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await StorageBooking.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Storage booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Booking has already been processed",
      });
    }

    let storage;

    if (status === "accepted") {
      storage = await ColdStorage.findById(booking.storage);

      if (!storage) {
        return res.status(404).json({
          message: "Cold storage no longer exists",
        });
      }

      if (booking.quantity > storage.availableCapacity) {
        return res.status(400).json({
          message: "Insufficient storage capacity",
        });
      }

      storage.availableCapacity -= booking.quantity;

      if (storage.availableCapacity <= 0) {
        storage.availableCapacity = 0;
        storage.status = "full";
      }

      await storage.save();
    } else {
      storage = await ColdStorage.findById(booking.storage);
    }

    booking.status = status;
    await booking.save();

    // Notify the farmer about the decision.
    const storageName = storage?.name || "the requested cold storage";

    await createNotification({
      user: booking.farmer,
      title: status === "accepted"
        ? "Storage Booking Accepted"
        : "Storage Booking Rejected",
      message: status === "accepted"
        ? `Your booking at ${storageName} has been accepted.`
        : `Your booking at ${storageName} has been rejected.`,
      type: "storage",
    });

    const populatedBooking = await StorageBooking.findById(booking._id)
      .populate("storage", "name location unit pricePerUnit")
      .populate("farmer", "name email phone location")
      .populate("owner", "name email phone location");

    return res.status(200).json({
      message: `Storage booking ${status} successfully`,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error.message);

    return res.status(500).json({
      message: "Server error while updating booking",
    });
  }
};

// CANCEL BOOKING
const cancelStorageBooking = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can cancel bookings",
      });
    }

    const booking = await StorageBooking.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    }).populate("storage", "name");

    if (!booking) {
      return res.status(404).json({
        message: "Storage booking not found",
      });
    }

    if (!["pending", "accepted"].includes(booking.status)) {
      return res.status(400).json({
        message: "Booking cannot be cancelled",
      });
    }

    if (booking.status === "accepted") {
      const storage = await ColdStorage.findById(booking.storage._id);

      if (storage) {
        storage.availableCapacity += booking.quantity;

        if (storage.availableCapacity > 0) {
          storage.status = "available";
        }

        if (storage.availableCapacity > storage.capacity) {
          storage.availableCapacity = storage.capacity;
        }

        await storage.save();
      }
    }

    booking.status = "cancelled";
    await booking.save();

    await createNotification({
      user: booking.owner,
      title: "Storage Booking Cancelled",
      message: `A farmer has cancelled a booking at ${booking.storage?.name || "your cold storage"}.`,
      type: "storage",
    });

    return res.status(200).json({
      message: "Storage booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Storage Booking Error:", error.message);

    return res.status(500).json({
      message: "Server error while cancelling booking",
    });
  }
};

module.exports = {
  createStorageBooking,
  getFarmerBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelStorageBooking,
};
