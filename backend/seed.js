require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Room = require("./models/Room");
const Review = require("./models/Review");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/grandhaven";

// =====================================================
// ROOMS
// =====================================================

const rooms = [
  {
    slug: "single",
    name: "Single Room",
    tagline: "Comfortable and quiet, made for the solo traveller",

    description:
      "A calm and beautifully appointed room designed for guests travelling alone or on business. Enjoy a comfortable single bed, dedicated work desk and elegant bathroom in a warm modern interior.",

    price: 3499,

    capacity: 1,

    bedType: "1 Single Bed",

    size: "180 sq.ft",

    amenities: [
      "Free Wi-Fi",
      "Work Desk",
      "Air Conditioning",
      "Rain Shower",
      "Smart TV",
      "Tea/Coffee Maker",
    ],

    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85",
    ],

    totalRooms: 12,

    // Room is available for booking
    isActive: true,
  },

  {
    slug: "deluxe",
    name: "Deluxe Room",
    tagline: "More space, more comfort, a view worth waking up to",

    description:
      "Our Deluxe Rooms offer generous space, a king-sized bed, elegant furnishings and a relaxing atmosphere. Perfect for couples and travellers who prefer extra comfort during their stay.",

    price: 6499,

    capacity: 2,

    bedType: "1 King Bed",

    size: "320 sq.ft",

    amenities: [
      "Free Wi-Fi",
      "Private Balcony",
      "Soaking Tub",
      "Minibar",
      "Garden View",
      "24-hr Room Service",
    ],

    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=85",
    ],

    totalRooms: 8,

    // Room is available for booking
    isActive: true,
  },

  {
    slug: "couple",
    name: "Couple Suite",
    tagline: "An intimate suite designed for two",

    description:
      "The Couple Suite combines a spacious king bed, elegant lounge area and luxurious bathroom for a memorable stay. Perfect for anniversaries, honeymoons and romantic getaways.",

    price: 8999,

    capacity: 2,

    bedType: "1 King Bed + Lounge Nook",

    size: "400 sq.ft",

    amenities: [
      "Free Wi-Fi",
      "Private Jacuzzi",
      "Welcome Hamper",
      "Candle-lit Lounge",
      "Turn-down Service",
      "Late Checkout",
    ],

    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    ],

    totalRooms: 6,

    // Room is available for booking
    isActive: true,
  },
];

// =====================================================
// REVIEWS
// =====================================================

const reviews = [
  {
    name: "Ananya Sharma",
    location: "Mumbai, India",
    rating: 5,
    comment:
      "Stayed in the Couple Suite for our anniversary and it was a wonderful experience. The room was beautiful, clean and extremely comfortable.",
    roomStayed: "Couple Suite",
  },

  {
    name: "Rohit Verma",
    location: "Delhi, India",
    rating: 5,
    comment:
      "I travel for work regularly and the Single Room was quiet, clean and very comfortable. The staff were also very helpful.",
    roomStayed: "Single Room",
  },

  {
    name: "Priya Nair",
    location: "Bengaluru, India",
    rating: 4,
    comment:
      "The Deluxe Room was spacious and beautifully designed. The bed was comfortable and the overall hotel atmosphere was excellent.",
    roomStayed: "Deluxe Room",
  },

  {
    name: "James Whitfield",
    location: "London, UK",
    rating: 5,
    comment:
      "A beautiful boutique hotel with excellent attention to detail. The room was elegant, comfortable and very well maintained.",
    roomStayed: "Deluxe Room",
  },

  {
    name: "Sneha Kulkarni",
    location: "Pune, India",
    rating: 5,
    comment:
      "Booked the Couple Suite for a weekend getaway and absolutely loved the experience. Everything felt premium and thoughtfully arranged.",
    roomStayed: "Couple Suite",
  },

  {
    name: "Arjun Mehta",
    location: "Ahmedabad, India",
    rating: 4,
    comment:
      "Great option for a business trip. The room was clean, the Wi-Fi was fast and the work desk was very useful.",
    roomStayed: "Single Room",
  },
];

// =====================================================
// SEED FUNCTION
// =====================================================

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected.");
    console.log("Clearing old data...");

    await User.deleteMany({});
    await Room.deleteMany({});
    await Review.deleteMany({});

    // -------------------------------------------------
    // CREATE DEMO OWNER
    // -------------------------------------------------

    const ownerPassword = await bcrypt.hash(
      "Owner@123",
      12
    );

    await User.create({
      name: "Grand Haven Owner",
      email: "owner@grandhaven.com",
      phone: "9876543210",
      password: ownerPassword,
      role: "owner",
      isActive: true,
    });

    // -------------------------------------------------
    // CREATE ROOMS
    // -------------------------------------------------

    await Room.insertMany(rooms);

    // -------------------------------------------------
    // CREATE REVIEWS
    // -------------------------------------------------

    await Review.insertMany(reviews);

    console.log("");
    console.log("====================================");
    console.log("     THE GRAND HAVEN DATABASE");
    console.log("====================================");
    console.log("");
    console.log(`Rooms created: ${rooms.length}`);
    console.log(`Reviews created: ${reviews.length}`);
    console.log("Owner account created: YES");
    console.log("");
    console.log("OWNER LOGIN");
    console.log("Email: owner@grandhaven.com");
    console.log("Password: Owner@123");
    console.log("");
    console.log("All rooms active: YES");
    console.log("====================================");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("SEEDING FAILED");
    console.error(error);
    process.exit(1);
  }
}

seed();