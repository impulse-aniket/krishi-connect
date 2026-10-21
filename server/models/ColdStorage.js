const mongoose = require("mongoose");

const coldStorageSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCapacity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["kg", "quintal", "ton"],
      required: true,
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    temperature: {
      type: String,
      trim: true,
      default: "",
    },

    latitude: {
  type: Number,
},

longitude: {
  type: Number,
},

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["available", "full", "inactive"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const ColdStorage = mongoose.model(
  "ColdStorage",
  coldStorageSchema
);

module.exports = ColdStorage;