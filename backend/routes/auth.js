const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "grand-haven-super-secret-key";

// -------------------------------------
// Create JWT Token
// -------------------------------------

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// -------------------------------------
// Signup
// POST /api/auth/signup
// -------------------------------------

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      phone = "",
      password,
      role = "guest",
    } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // Validate role
    const selectedRole = role.toLowerCase();

    if (!["guest", "owner"].includes(selectedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type.",
      });
    }

    // Basic password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: selectedRole,
    });

    // Generate token
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: `${selectedRole === "owner" ? "Owner" : "Guest"} account created successfully.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

// -------------------------------------
// Login
// POST /api/auth/login
// -------------------------------------

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
      role = "guest",
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const selectedRole = role.toLowerCase();

    if (!["guest", "owner"].includes(selectedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: selectedRole,
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password or account type.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password or account type.",
      });
    }

    // Generate token
    const token = createToken(user);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

// -------------------------------------
// Get Current User
// GET /api/auth/me
// -------------------------------------

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
});

module.exports = router;