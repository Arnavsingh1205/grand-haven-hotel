import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// AUTH STORAGE
// ==========================================

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("grandHavenUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem("grandHavenToken");
};

export const saveAuth = (data) => {
  if (data?.token) {
    localStorage.setItem("grandHavenToken", data.token);
  }

  if (data?.user) {
    localStorage.setItem(
      "grandHavenUser",
      JSON.stringify(data.user)
    );
  }
};

export const logout = () => {
  localStorage.removeItem("grandHavenToken");
  localStorage.removeItem("grandHavenUser");
};

export const isLoggedIn = () => {
  return Boolean(getStoredToken() && getStoredUser());
};

// ==========================================
// AXIOS INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Backend currently accepts x-user-id
    // Handle both MongoDB _id and auth response id
    const userId = user?._id || user?.id;

    if (userId) {
      config.headers["x-user-id"] = userId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// AUTH
// ==========================================

export const signup = async (payload) => {
  const response = await api.post("/auth/signup", payload);

  saveAuth(response.data);

  return response.data;
};

export const login = async (payload) => {
  const response = await api.post("/auth/login", payload);

  saveAuth(response.data);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// ==========================================
// ROOMS
// ==========================================

export const getRooms = async () => {
  const response = await api.get("/rooms");

  return response.data;
};

export const searchRooms = async (
  checkIn,
  checkOut,
  guests = 1
) => {
  const response = await api.get("/rooms/search", {
    params: {
      checkIn,
      checkOut,
      guests,
    },
  });

  return response.data;
};

export const getRoom = async (slug) => {
  const response = await api.get(`/rooms/${slug}`);

  return response.data;
};

export const getRoomAvailability = async (
  slug,
  checkIn,
  checkOut
) => {
  const response = await api.get(
    `/rooms/${slug}/availability`,
    {
      params: {
        checkIn,
        checkOut,
      },
    }
  );

  return response.data;
};

// ==========================================
// BOOKINGS
// ==========================================

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", payload);

  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");

  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(
    `/bookings/${bookingId}/cancel`
  );

  return response.data;
};

// ==========================================
// REVIEWS
// ==========================================

export const getReviews = async () => {
  const response = await api.get("/reviews");

  return response.data;
};

export const createReview = async (payload) => {
  const response = await api.post("/reviews", payload);

  return response.data;
};

// ==========================================
// OWNER
// ==========================================

export const getAllBookings = async () => {
  const response = await api.get("/bookings/all");

  return response.data;
};

export const updateBookingStatus = async (
  bookingId,
  status
) => {
  const response = await api.patch(
    `/bookings/${bookingId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const getAllReviews = async () => {
  const response = await api.get("/reviews/all");

  return response.data;
};

export const updateReviewStatus = async (
  reviewId,
  isApproved
) => {
  const response = await api.patch(
    `/reviews/${reviewId}/status`,
    {
      isApproved,
    }
  );

  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};

// ==========================================
// OWNER ROOM MANAGEMENT
// ==========================================

export const getAllRoomsForOwner = async () => {
  const response = await api.get("/rooms/owner/all");

  return response.data;
};

export const createRoom = async (payload) => {
  const response = await api.post("/rooms", payload);

  return response.data;
};

export const updateRoom = async (roomId, payload) => {
  const response = await api.patch(
    `/rooms/${roomId}`,
    payload
  );

  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await api.delete(
    `/rooms/${roomId}`
  );

  return response.data;
};

export default api;