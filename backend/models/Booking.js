const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    roomName: {
      type: String,
      required: true
    },

    guestName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    checkIn: {
      type: Date,
      required: true
    },

    checkOut: {
      type: Date,
      required: true
    },

    guests: {
      type: Number,
      required: true,
      default: 1
    },

    specialRequest: {
      type: String,
      default: ""
    },

    totalNights: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);