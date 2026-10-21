const Vehicle = require("../models/Vehicle");

// ADD VEHICLE
const addVehicle = async (req, res) => {
  try {
    if (
      req.user.role !==
      "transportProvider"
    ) {
      return res.status(403).json({
        message:
          "Only transport providers can add vehicles",
      });
    }

    const {
      vehicleNumber,
      vehicleType,
      capacity,
      unit,
      location,
    } = req.body;

    if (
      !vehicleNumber ||
      !vehicleType ||
      !capacity ||
      !unit ||
      !location
    ) {
      return res.status(400).json({
        message:
          "Please provide all vehicle details",
      });
    }

    const existingVehicle =
      await Vehicle.findOne({
        vehicleNumber:
          vehicleNumber.toUpperCase(),
      });

    if (existingVehicle) {
      return res.status(400).json({
        message:
          "Vehicle number already exists",
      });
    }

    const vehicle =
      await Vehicle.create({
        provider: req.user.id,
        vehicleNumber,
        vehicleType,
        capacity,
        unit,
        location,
      });

    res.status(201).json({
      message:
        "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Add Vehicle Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while adding vehicle",
    });
  }
};

// GET MY VEHICLES
const getMyVehicles = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !==
      "transportProvider"
    ) {
      return res.status(403).json({
        message:
          "Only transport providers can view vehicles",
      });
    }

    const vehicles =
      await Vehicle.find({
        provider: req.user.id,
      }).sort({ createdAt: -1 });

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error(
      "Get Vehicles Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching vehicles",
    });
  }
};

// GET AVAILABLE VEHICLES
const getAvailableVehicles = async (
  req,
  res
) => {
  try {
    const vehicles =
      await Vehicle.find({
        status: "available",
      })
        .populate(
          "provider",
          "name phone location"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error(
      "Get Available Vehicles Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching available vehicles",
    });
  }
};

// UPDATE VEHICLE
const updateVehicle = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !==
      "transportProvider"
    ) {
      return res.status(403).json({
        message:
          "Only transport providers can update vehicles",
      });
    }

    const vehicle =
      await Vehicle.findOne({
        _id: req.params.id,
        provider: req.user.id,
      });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const {
      vehicleType,
      capacity,
      unit,
      location,
      status,
    } = req.body;

    if (vehicleType !== undefined) {
      vehicle.vehicleType =
        vehicleType;
    }

    if (capacity !== undefined) {
      vehicle.capacity = capacity;
    }

    if (unit !== undefined) {
      vehicle.unit = unit;
    }

    if (location !== undefined) {
      vehicle.location = location;
    }

    if (status !== undefined) {
      vehicle.status = status;
    }

    await vehicle.save();

    res.status(200).json({
      message:
        "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Update Vehicle Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while updating vehicle",
    });
  }
};

// DELETE VEHICLE
const deleteVehicle = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !==
      "transportProvider"
    ) {
      return res.status(403).json({
        message:
          "Only transport providers can delete vehicles",
      });
    }

    const vehicle =
      await Vehicle.findOne({
        _id: req.params.id,
        provider: req.user.id,
      });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (vehicle.status === "busy") {
      return res.status(400).json({
        message:
          "Busy vehicle cannot be deleted",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      message:
        "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Vehicle Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while deleting vehicle",
    });
  }
};

module.exports = {
  addVehicle,
  getMyVehicles,
  getAvailableVehicles,
  updateVehicle,
  deleteVehicle,
};