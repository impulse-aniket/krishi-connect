const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["kg", "quintal", "ton"],
      required: true,
    },

    expectedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    harvestDate: {
      type: Date,
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

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model("Crop", cropSchema);

module.exports = Crop;