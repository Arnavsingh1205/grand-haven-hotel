
// Used only as a safety net so the page still renders something
// if the backend / MongoDB isn't running yet. Once your backend
// is up and seeded, the app fetches live data from the API instead.
 
export const fallbackRooms = [
  {
    _id: "fallback-single",
    slug: "single",
    name: "Single Room",
    tagline: "Comfortable and quiet, made for the solo traveller",
    description:
      "A calm, well-appointed room designed for guests travelling alone or on business. Enjoy a plush single bed, a dedicated work desk and a walk-in rain shower.",
    price: 3499,
    capacity: 1,
    bedType: "1 Single Bed",
    size: "180 sq.ft",
    amenities: ["Free Wi-Fi", "Work Desk", "Air Conditioning", "Rain Shower", "Smart TV", "Tea/Coffee Maker"],
    images: [
      "https://picsum.photos/seed/grandhaven-single-1/900/650",
      "https://picsum.photos/seed/grandhaven-single-2/900/650",
      "https://picsum.photos/seed/grandhaven-single-3/900/650",
      "https://picsum.photos/seed/grandhaven-single-4/900/650",
    ],
  },
  {
    _id: "fallback-deluxe",
    slug: "deluxe",
    name: "Deluxe Room",
    tagline: "More space, more comfort, a view worth waking up to",
    description:
      "Our Deluxe Rooms open onto a private balcony overlooking the gardens. Sink into a king-sized bed and unwind in the soaking tub.",
    price: 6499,
    capacity: 2,
    bedType: "1 King Bed",
    size: "320 sq.ft",
    amenities: ["Free Wi-Fi", "Private Balcony", "Soaking Tub", "Minibar", "Garden View", "24-hr Room Service"],
    images: [
      "https://picsum.photos/seed/grandhaven-deluxe-1/900/650",
      "https://picsum.photos/seed/grandhaven-deluxe-2/900/650",
      "https://picsum.photos/seed/grandhaven-deluxe-3/900/650",
      "https://picsum.photos/seed/grandhaven-deluxe-4/900/650",
    ],
  },
  {
    _id: "fallback-couple",
    slug: "couple",
    name: "Couple Suite",
    tagline: "An intimate suite designed for two",
    description:
      "The Couple Suite pairs a candle-lit lounge nook with a spacious king bed and a private jacuzzi for two.",
    price: 8999,
    capacity: 2,
    bedType: "1 King Bed + Lounge Nook",
    size: "400 sq.ft",
    amenities: ["Free Wi-Fi", "Private Jacuzzi", "Welcome Hamper", "Candle-lit Lounge", "Turn-down Service", "Late Checkout"],
    images: [
      "https://picsum.photos/seed/grandhaven-couple-1/900/650",
      "https://picsum.photos/seed/grandhaven-couple-2/900/650",
      "https://picsum.photos/seed/grandhaven-couple-3/900/650",
      "https://picsum.photos/seed/grandhaven-couple-4/900/650",
    ],
  },
];
 
export const fallbackReviews = [
  { _id: "r1", name: "Ananya Sharma", location: "Mumbai, India", rating: 5, roomStayed: "Couple Suite", comment: "Stayed in the Couple Suite for our anniversary and it was magical. The jacuzzi and the welcome hamper made the whole trip memorable." },
  { _id: "r2", name: "Rohit Verma", location: "Delhi, India", rating: 5, roomStayed: "Single Room", comment: "I travel for work every month and the Single Room here is the most comfortable one I've used. Quiet, clean, and the staff remembered my name." },
  { _id: "r3", name: "Priya Nair", location: "Bengaluru, India", rating: 4, roomStayed: "Deluxe Room", comment: "The Deluxe Room's balcony view of the garden was worth every rupee. Breakfast on the balcony became our morning ritual." },
  { _id: "r4", name: "James Whitfield", location: "London, UK", rating: 5, roomStayed: "Deluxe Room", comment: "Genuinely one of the best boutique hotels I've stayed at. The attention to detail in the Deluxe Room felt properly thought through." },
  { _id: "r5", name: "Sneha Kulkarni", location: "Pune, India", rating: 5, roomStayed: "Couple Suite", comment: "Booked the Couple Suite for a weekend getaway and it exceeded expectations. The candle-lit lounge nook is such a lovely detail." },
  { _id: "r6", name: "Arjun Mehta", location: "Ahmedabad, India", rating: 4, roomStayed: "Single Room", comment: "Good value single room for solo business trips. Fast Wi-Fi and a proper desk, plus the rain shower is great after a long day." },
];