const express = require("express");

const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

const router = express.Router();

// --------------------------------------------------
// Helper: get authenticated user
// --------------------------------------------------

async function getUserFromRequest(req) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return null;
    }

    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// --------------------------------------------------
// Helper: validate dates
// --------------------------------------------------

function getDates(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return null;
  }

  if (end <= start) {
    return null;
  }

  return {
    start,
    end,
  };
}

// --------------------------------------------------
// CREATE BOOKING
//
// POST /api/bookings
// --------------------------------------------------

router.post("/", async (req, res) => {
  try {
    // ------------------------------------------------
    // Check login
    // ------------------------------------------------

    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login before making a booking.",
      });
    }

    // ------------------------------------------------
    // Get request data
    // ------------------------------------------------

    const {
      roomSlug,
      roomId,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      specialRequest = "",
    } = req.body;

    // ------------------------------------------------
    // Find room
    //
    // Frontend can send either:
    // roomSlug OR roomId
    // ------------------------------------------------

    let room = null;

    if (roomSlug) {
      room = await Room.findOne({
        slug: roomSlug,
        isActive: true,
      });
    }

    if (!room && roomId) {
      room = await Room.findOne({
        _id: roomId,
        isActive: true,
      });
    }

    // ------------------------------------------------
    // Room not found
    // ------------------------------------------------

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Selected room was not found.",
      });
    }

    // ------------------------------------------------
    // Required fields
    // ------------------------------------------------

    if (
      !guestName ||
      !email ||
      !phone ||
      !checkIn ||
      !checkOut ||
      guests === undefined ||
      guests === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required booking details.",
      });
    }

    // ------------------------------------------------
    // Clean guest information
    // ------------------------------------------------

    const cleanGuestName = String(guestName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();

    if (
      !cleanGuestName ||
      !cleanEmail ||
      !cleanPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required booking details.",
      });
    }

    // ------------------------------------------------
    // Validate dates
    // ------------------------------------------------

    const dates = getDates(checkIn, checkOut);

    if (!dates) {
      return res.status(400).json({
        success: false,
        message:
          "Please select valid check-in and check-out dates.",
      });
    }

    const { start, end } = dates;

    // ------------------------------------------------
    // Validate guests
    // ------------------------------------------------

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Number of guests must be at least 1.",
      });
    }

    // ------------------------------------------------
    // Check room capacity
    // ------------------------------------------------

    if (guestCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room allows a maximum of ${
          room.capacity
        } guest${room.capacity > 1 ? "s" : ""}.`,
      });
    }

    // ------------------------------------------------
    // Check overlapping bookings
    // ------------------------------------------------

    const overlappingBookings =
      await Booking.countDocuments({
        room: room._id,
        status: "confirmed",
        checkIn: {
          $lt: end,
        },
        checkOut: {
          $gt: start,
        },
      });

    // ------------------------------------------------
    // Check available rooms
    // ------------------------------------------------

    if (overlappingBookings >= room.totalRooms) {
      return res.status(409).json({
        success: false,
        message:
          "Sorry, this room is not available for the selected dates.",
      });
    }

    // ------------------------------------------------
    // Calculate total nights
    // ------------------------------------------------

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const totalNights = Math.ceil(
      (end - start) / millisecondsPerDay
    );

    // ------------------------------------------------
    // Calculate total amount
    // ------------------------------------------------

    const totalAmount =
      totalNights * Number(room.price);

    // ------------------------------------------------
    // Create booking
    // ------------------------------------------------

    const booking = await Booking.create({
      user: user._id,

      room: room._id,

      roomName: room.name,

      guestName: cleanGuestName,

      email: cleanEmail,

      phone: cleanPhone,

      checkIn: start,

      checkOut: end,

      guests: guestCount,

      totalNights,

      pricePerNight: Number(room.price),

      totalAmount,

      specialRequest: String(
        specialRequest || ""
      ).trim(),

      status: "confirmed",
    });

    // ------------------------------------------------
    // Success
    // ------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully.",
      booking,
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to complete booking.",
    });
  }
});

// --------------------------------------------------
// GET MY BOOKINGS
//
// GET /api/bookings/my
// --------------------------------------------------

router.get("/my", async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login.",
      });
    }

    const bookings = await Booking.find({
      user: user._id,
    })
      .populate("room")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get my bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings.",
    });
  }
});

// --------------------------------------------------
// CANCEL MY BOOKING
//
// PATCH /api/bookings/:id/cancel
// --------------------------------------------------

router.patch("/:id/cancel", async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "This booking is already cancelled.",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.json({
      success: true,
      message:
        "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to cancel booking.",
    });
  }
});

// --------------------------------------------------
// OWNER: GET ALL BOOKINGS
//
// GET /api/bookings/all
// --------------------------------------------------

router.get("/all", async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner access required.",
      });
    }

    const bookings = await Booking.find()
      .populate(
        "user",
        "name email phone role"
      )
      .populate("room")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get all bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load all bookings.",
    });
  }
});

// --------------------------------------------------
// OWNER: UPDATE BOOKING STATUS
//
// PATCH /api/bookings/:id/status
// --------------------------------------------------

router.patch("/:id/status", async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner access required.",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "confirmed",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.status = status;

    await booking.save();

    return res.json({
      success: true,
      message:
        "Booking status updated.",
      booking,
    });
  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update booking status.",
    });
  }
});

module.exports = router;