const ColdStorage = require("../models/ColdStorage");

// ADD COLD STORAGE
const addColdStorage = async (req, res) => {
  try {
    if (req.user.role !== "coldStorageOwner") {
      return res.status(403).json({
        message:
          "Only cold storage owners can add storage facilities",
      });
    }

    const {
      name,
      location,
      capacity,
      unit,
      pricePerUnit,
      temperature,
      description,
    } = req.body;

    if (
      !name ||
      !location ||
      !capacity ||
      !unit ||
      pricePerUnit === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all required storage details",
      });
    }

    const storage = await ColdStorage.create({
      owner: req.user.id,
      name,
      location,
      capacity,
      availableCapacity: capacity,
      unit,
      pricePerUnit,
      temperature: temperature || "",
      description: description || "",
    });

    res.status(201).json({
      message:
        "Cold storage added successfully",
      storage,
    });
  } catch (error) {
    console.error(
      "Add Cold Storage Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while adding cold storage",
    });
  }
};

// GET OWNER'S STORAGE
const getMyStorage = async (req, res) => {
  try {
    if (req.user.role !== "coldStorageOwner") {
      return res.status(403).json({
        message:
          "Only cold storage owners can view their storage",
      });
    }

    const storage = await ColdStorage.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: storage.length,
      storage,
    });
  } catch (error) {
    console.error(
      "Get My Storage Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching storage",
    });
  }
};

// GET ALL AVAILABLE STORAGE
const getAvailableStorage = async (
  req,
  res
) => {
  try {
    const storage = await ColdStorage.find({
      status: "available",
      availableCapacity: {
        $gt: 0,
      },
    })
      .populate(
        "owner",
        "name phone location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: storage.length,
      storage,
    });
  } catch (error) {
    console.error(
      "Get Available Storage Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching available storage",
    });
  }
};

// GET SINGLE STORAGE
const getStorageById = async (
  req,
  res
) => {
  try {
    const storage =
      await ColdStorage.findById(
        req.params.id
      ).populate(
        "owner",
        "name phone location"
      );

    if (!storage) {
      return res.status(404).json({
        message:
          "Cold storage not found",
      });
    }

    res.status(200).json(storage);
  } catch (error) {
    console.error(
      "Get Storage Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while fetching storage",
    });
  }
};

// UPDATE STORAGE
const updateColdStorage = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "coldStorageOwner") {
      return res.status(403).json({
        message:
          "Only cold storage owners can update storage",
      });
    }

    const storage =
      await ColdStorage.findOne({
        _id: req.params.id,
        owner: req.user.id,
      });

    if (!storage) {
      return res.status(404).json({
        message:
          "Cold storage not found",
      });
    }

    const {
      name,
      location,
      capacity,
      pricePerUnit,
      temperature,
      description,
      status,
    } = req.body;

    if (name !== undefined) {
      storage.name = name;
    }

    if (location !== undefined) {
      storage.location = location;
    }

    if (capacity !== undefined) {
      const usedCapacity =
        storage.capacity -
        storage.availableCapacity;

      if (capacity < usedCapacity) {
        return res.status(400).json({
          message:
            "Capacity cannot be less than currently occupied capacity",
        });
      }

      storage.capacity = capacity;

      storage.availableCapacity =
        capacity - usedCapacity;
    }

    if (pricePerUnit !== undefined) {
      storage.pricePerUnit =
        pricePerUnit;
    }

    if (temperature !== undefined) {
      storage.temperature =
        temperature;
    }

    if (description !== undefined) {
      storage.description =
        description;
    }

    if (status !== undefined) {
      storage.status = status;
    }

    if (storage.availableCapacity <= 0) {
      storage.status = "full";
    }

    await storage.save();

    res.status(200).json({
      message:
        "Cold storage updated successfully",
      storage,
    });
  } catch (error) {
    console.error(
      "Update Cold Storage Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while updating storage",
    });
  }
};

// DELETE STORAGE
const deleteColdStorage = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "coldStorageOwner") {
      return res.status(403).json({
        message:
          "Only cold storage owners can delete storage",
      });
    }

    const storage =
      await ColdStorage.findOne({
        _id: req.params.id,
        owner: req.user.id,
      });

    if (!storage) {
      return res.status(404).json({
        message:
          "Cold storage not found",
      });
    }

    await storage.deleteOne();

    res.status(200).json({
      message:
        "Cold storage deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Cold Storage Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while deleting storage",
    });
  }
};

module.exports = {
  addColdStorage,
  getMyStorage,
  getAvailableStorage,
  getStorageById,
  updateColdStorage,
  deleteColdStorage,
};