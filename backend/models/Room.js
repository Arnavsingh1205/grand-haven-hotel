const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    tagline: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    bedType: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    totalRooms: {
      type: Number,
      default: 10,
    },

    // Room active/inactive status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);