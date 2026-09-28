const express = require("express");
const mongoose = require("mongoose");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// OWNER CHECK
// ==========================================

async function requireOwner(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Owner login required.",
      });
    }

    const user = await User.findById(userId);

    if (!user || user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner access required.",
      });
    }

    req.owner = user;
    next();
  } catch (error) {
    next(error);
  }
}

// ==========================================
// GET ALL ACTIVE ROOMS
// ==========================================

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find({
      isActive: true,
    }).sort({
      price: 1,
    });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// SEARCH AVAILABLE ROOMS
// ==========================================

router.get("/search", async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests = 1 } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required.",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const guestCount = Number(guests);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates.",
      });
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Guests must be at least 1.",
      });
    }

    const rooms = await Room.find({
      isActive: true,
      capacity: { $gte: guestCount },
    }).sort({
      price: 1,
    });

    const availableRooms = [];

    for (const room of rooms) {
      const overlappingBookings = await Booking.countDocuments({
        room: room._id,
        status: "confirmed",
        checkIn: { $lt: end },
        checkOut: { $gt: start },
      });

      if (overlappingBookings < room.totalRooms) {
        availableRooms.push({
          ...room.toObject(),
          availableRooms:
            room.totalRooms - overlappingBookings,
        });
      }
    }

    // IMPORTANT:
    // Frontend expects { success, rooms }
    res.json({
      success: true,
      rooms: availableRooms,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// OWNER: GET ALL ROOMS
// ==========================================

router.get("/owner/all", requireOwner, async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({
      price: 1,
    });

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// OWNER: CREATE ROOM
// ==========================================

router.post("/", requireOwner, async (req, res, next) => {
  try {
    const {
      slug,
      name,
      tagline,
      description,
      price,
      capacity,
      bedType,
      size,
      amenities,
      images,
      totalRooms,
      isActive = true,
    } = req.body;

    if (
      !slug ||
      !name ||
      price === undefined ||
      capacity === undefined ||
      totalRooms === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Slug, name, price, capacity and total rooms are required.",
      });
    }

    const existingRoom = await Room.findOne({ slug });

    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "A room with this slug already exists.",
      });
    }

    const room = await Room.create({
      slug,
      name,
      tagline: tagline || "",
      description: description || "",
      price: Number(price),
      capacity: Number(capacity),
      bedType: bedType || "",
      size: size || "",
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
      totalRooms: Number(totalRooms),
      isActive: Boolean(isActive),
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully.",
      room,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// OWNER: UPDATE ROOM
// ==========================================

router.patch("/:id", requireOwner, async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "tagline",
      "description",
      "price",
      "capacity",
      "bedType",
      "size",
      "amenities",
      "images",
      "totalRooms",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.capacity !== undefined) {
      updates.capacity = Number(updates.capacity);
    }

    if (updates.totalRooms !== undefined) {
      updates.totalRooms = Number(updates.totalRooms);
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    res.json({
      success: true,
      message: "Room updated successfully.",
      room,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// OWNER: DELETE ROOM
// ==========================================

router.delete("/:id", requireOwner, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Soft delete instead of permanently deleting
    room.isActive = false;

    await room.save();

    res.json({
      success: true,
      message: "Room deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// GET ROOM BY SLUG
// ==========================================

router.get("/:slug", async (req, res, next) => {
  try {
    const room = await Room.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ROOM AVAILABILITY
// ==========================================

router.get(
  "/:slug/availability",
  async (req, res, next) => {
    try {
      const { checkIn, checkOut } = req.query;

      if (!checkIn || !checkOut) {
        return res.status(400).json({
          success: false,
          message:
            "Check-in and check-out dates are required.",
        });
      }

      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking dates.",
        });
      }

      const room = await Room.findOne({
        slug: req.params.slug,
        isActive: true,
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found.",
        });
      }

      const overlappingBookings =
        await Booking.countDocuments({
          room: room._id,
          status: "confirmed",
          checkIn: { $lt: end },
          checkOut: { $gt: start },
        });

      const availableRooms =
        room.totalRooms - overlappingBookings;

      res.json({
        success: true,
        available: availableRooms > 0,
        availableRooms: Math.max(availableRooms, 0),
        totalRooms: room.totalRooms,
        message:
          availableRooms > 0
            ? `${availableRooms} room(s) available.`
            : "No rooms available for these dates.",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;