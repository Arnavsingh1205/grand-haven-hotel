const express = require("express");

const Review = require("../models/Review");
const User = require("../models/User");

const router = express.Router();

// --------------------------------------------------
// Helper: get user from request
// --------------------------------------------------

async function getUserFromRequest(req) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return null;
  }

  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

// --------------------------------------------------
// GET ALL REVIEWS
//
// GET /api/reviews
// --------------------------------------------------

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({
      isApproved: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(50);

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
});

// --------------------------------------------------
// CREATE REVIEW
//
// POST /api/reviews
// --------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login before submitting a review.",
      });
    }

    const {
      rating,
      comment,
      roomStayed = "",
      location = "",
    } = req.body;

    // -----------------------------
    // Validate rating
    // -----------------------------

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // -----------------------------
    // Validate comment
    // -----------------------------

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please write a review of at least 5 characters.",
      });
    }

    // -----------------------------
    // Prevent empty room value
    // -----------------------------

    const review = await Review.create({
      user: user._id,

      name: user.name,

      location: location.trim(),

      rating: numericRating,

      comment: comment.trim(),

      roomStayed: roomStayed.trim(),

      isApproved: true,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
});

// --------------------------------------------------
// OWNER: GET ALL REVIEWS
//
// GET /api/reviews/all
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

    const reviews = await Review.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
});

// --------------------------------------------------
// OWNER: APPROVE / HIDE REVIEW
//
// PATCH /api/reviews/:id/status
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

    const {
      isApproved,
    } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isApproved must be true or false.",
      });
    }

    const review = await Review.findById(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.isApproved = isApproved;

    await review.save();

    res.json({
      success: true,
      message: isApproved
        ? "Review approved."
        : "Review hidden.",
      review,
    });
  } catch (error) {
    console.error(
      "Review status update error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update review.",
    });
  }
});

// --------------------------------------------------
// OWNER: DELETE REVIEW
//
// DELETE /api/reviews/:id
// --------------------------------------------------

router.delete("/:id", async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner access required.",
      });
    }

    const review = await Review.findByIdAndDelete(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete review.",
    });
  }
});

module.exports = router;