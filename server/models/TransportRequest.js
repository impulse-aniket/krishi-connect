const mongoose = require("mongoose");

const transportRequestSchema =
  new mongoose.Schema(
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },

      farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null,
      },

      pickupLocation: {
        type: String,
        required: true,
        trim: true,
      },

      deliveryLocation: {
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

      requestedDate: {
        type: Date,
        required: true,
      },

      transportCost: {
        type: Number,
        default: 0,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "accepted",
          "rejected",
          "cancelled",
          "completed",
        ],
        default: "pending",
      },

      deliveryStatus: {
        type: String,
        enum: [
          "not_started",
          "pickup_pending",
          "picked_up",
          "in_transit",
          "delivered",
        ],
        default: "not_started",
      },

      notes: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const TransportRequest =
  mongoose.model(
    "TransportRequest",
    transportRequestSchema
  );

module.exports = TransportRequest;