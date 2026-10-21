const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    vehicleType: {
      type: String,
      enum: [
        "truck",
        "mini-truck",
        "tempo",
        "tractor",
        "other",
      ],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["kg", "quintal", "ton"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
  type: Number,
},

longitude: {
  type: Number,
},

    status: {
      type: String,
      enum: [
        "available",
        "busy",
        "inactive",
      ],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model(
  "Vehicle",
  vehicleSchema
);

module.exports = Vehicle;