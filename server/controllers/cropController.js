const Crop = require("../models/Crop");

// ADD CROP
const addCrop = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message:
          "Only farmers can add crop listings",
      });
    }

    const {
      cropName,
      quantity,
      unit,
      expectedPrice,
      harvestDate,
      location,
      description,
    } = req.body;

    if (
      !cropName ||
      !quantity ||
      !unit ||
      !expectedPrice ||
      !harvestDate ||
      !location
    ) {
      return res.status(400).json({
        message:
          "Please provide all required crop details",
      });
    }

    const crop = await Crop.create({
      farmer: req.user.id,
      cropName,
      quantity,
      unit,
      expectedPrice,
      harvestDate,
      location,
      description,
    });

    res.status(201).json({
      message:
        "Crop listed successfully",
      crop,
    });

  } catch (error) {
    console.error(
      "Add Crop Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while adding crop",
    });
  }
};

// GET MY CROPS
const getMyCrops = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message:
          "Only farmers can view their crop listings",
      });
    }

    const crops = await Crop.find({
      farmer: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: crops.length,
      crops,
    });

  } catch (error) {
    console.error(
      "Get Crops Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching crops",
    });
  }
};

// GET SINGLE CROP FOR FARMER
const getCropById = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message:
          "Only farmers can access this crop endpoint",
      });
    }

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!crop) {
      return res.status(404).json({
        message:
          "Crop not found",
      });
    }

    res.status(200).json(crop);

  } catch (error) {
    console.error(
      "Get Crop Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching crop",
    });
  }
};

// GET ALL AVAILABLE CROPS
const getAvailableCrops = async (
  req,
  res
) => {
  try {
    const crops = await Crop.find({
      status: "available",
    })
      .populate(
        "farmer",
        "name location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: crops.length,
      crops,
    });

  } catch (error) {
    console.error(
      "Get Available Crops Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching available crops",
    });
  }
};

// GET CROP DETAILS FOR BUYER
const getCropForBuyer = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message:
          "Only buyers can use this endpoint",
      });
    }

    const crop = await Crop.findOne({
      _id: req.params.id,
      status: "available",
    }).populate(
      "farmer",
      "name location phone"
    );

    if (!crop) {
      return res.status(404).json({
        message:
          "Available crop not found",
      });
    }

    res.status(200).json(crop);

  } catch (error) {
    console.error(
      "Get Buyer Crop Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching crop",
    });
  }
};

// UPDATE CROP
const updateCrop = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message:
          "Only farmers can update crops",
      });
    }

    const {
      cropName,
      quantity,
      unit,
      expectedPrice,
      harvestDate,
      location,
      description,
      status,
    } = req.body;

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!crop) {
      return res.status(404).json({
        message:
          "Crop not found",
      });
    }

    if (cropName !== undefined)
      crop.cropName = cropName;

    if (quantity !== undefined)
      crop.quantity = quantity;

    if (unit !== undefined)
      crop.unit = unit;

    if (expectedPrice !== undefined)
      crop.expectedPrice =
        expectedPrice;

    if (harvestDate !== undefined)
      crop.harvestDate =
        harvestDate;

    if (location !== undefined)
      crop.location = location;

    if (description !== undefined)
      crop.description =
        description;

    if (status !== undefined)
      crop.status = status;

    const updatedCrop =
      await crop.save();

    res.status(200).json({
      message:
        "Crop updated successfully",
      crop: updatedCrop,
    });

  } catch (error) {
    console.error(
      "Update Crop Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while updating crop",
    });
  }
};

// DELETE CROP
const deleteCrop = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        message:
          "Only farmers can delete crops",
      });
    }

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!crop) {
      return res.status(404).json({
        message:
          "Crop not found",
      });
    }

    await crop.deleteOne();

    res.status(200).json({
      message:
        "Crop deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Crop Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while deleting crop",
    });
  }
};

module.exports = {
  addCrop,
  getMyCrops,
  getCropById,
  getAvailableCrops,
  getCropForBuyer,
  updateCrop,
  deleteCrop,
};