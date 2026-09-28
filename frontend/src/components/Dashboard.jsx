import React, { useEffect, useState } from "react";

import {
  cancelBooking,
  getAllBookings,
  getAllReviews,
  getMyBookings,
  updateBookingStatus,
  updateReviewStatus,
  deleteReview,
  getStoredUser,
  logout,
  getAllRoomsForOwner,
  updateRoom,
} from "../api";

// ==========================================
// HELPERS
// ==========================================

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

// ==========================================
// GUEST DASHBOARD
// ==========================================

function GuestDashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);

      const data = await getMyBookings();

      setBookings(data.bookings || data || []);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await cancelBooking(bookingId);

      setMessage("Booking cancelled successfully.");

      await loadBookings();
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to cancel the booking."
      );
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-16 px-5">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-forest text-ivory rounded-xl p-7 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <p className="text-brasslight text-sm uppercase tracking-widest">
                Guest Dashboard
              </p>

              <h1 className="font-display text-3xl sm:text-4xl mt-2">
                Welcome, {user?.name}
              </h1>

              <p className="text-ivory/70 mt-2">
                Manage your stays and bookings.
              </p>
            </div>

            <button
              onClick={onLogout}
              className="border border-ivory/30 hover:bg-white/10 px-5 py-2.5 rounded-md text-sm"
            >
              Logout
            </button>

          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 bg-white border border-stone rounded-lg p-4 text-sm">
            {message}
          </div>
        )}

        {/* BOOKINGS */}

        <section>

          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-brass text-sm uppercase tracking-widest">
                My stays
              </p>

              <h2 className="font-display text-3xl text-ink mt-1">
                My Bookings
              </h2>
            </div>

            <span className="text-sm text-ink/50">
              {bookings.length} booking
              {bookings.length !== 1 ? "s" : ""}
            </span>

          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-stone p-8 text-center">
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone p-10 text-center">

              <div className="text-4xl mb-4">
                🏨
              </div>

              <h3 className="font-display text-2xl text-ink">
                No bookings yet
              </h3>

              <p className="text-ink/60 mt-2">
                Your hotel bookings will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-5">

              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white border border-stone rounded-xl p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>
                      <h3 className="font-display text-2xl text-ink">
                        {booking.roomName}
                      </h3>

                      <p className="text-sm text-ink/50 mt-1">
                        Booking ID: {booking._id}
                      </p>
                    </div>

                    <StatusBadge
                      status={booking.status}
                    />

                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 pt-5 border-t border-stone">

                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/40">
                        Check-in
                      </p>

                      <p className="mt-1 font-medium">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/40">
                        Check-out
                      </p>

                      <p className="mt-1 font-medium">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/40">
                        Guests
                      </p>

                      <p className="mt-1 font-medium">
                        {booking.guests}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/40">
                        Total
                      </p>

                      <p className="mt-1 font-medium text-brass">
                        ₹
                        {Number(
                          booking.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                  </div>

                  {booking.status === "confirmed" && (
                    <div className="mt-5">

                      <button
                        onClick={() =>
                          handleCancel(
                            booking._id
                          )
                        }
                        className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-sm"
                      >
                        Cancel Booking
                      </button>

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>
      </div>
    </div>
  );
}

// ==========================================
// OWNER DASHBOARD
// ==========================================

function OwnerDashboard({ user, onLogout }) {

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const [message, setMessage] = useState("");

  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        bookingData,
        reviewData,
      ] = await Promise.all([
        getAllBookings(),
        getAllReviews(),
      ]);

      setBookings(
        bookingData.bookings ||
          bookingData ||
          []
      );

      setReviews(
        reviewData.reviews ||
          reviewData ||
          []
      );

    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to load owner dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD ROOMS
  // ========================================

  const loadRooms = async () => {
    try {
      setRoomsLoading(true);

      const data =
        await getAllRoomsForOwner();

      setRooms(data.rooms || []);

    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to load rooms."
      );
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadRooms();
  }, []);

  // ========================================
  // UPDATE ROOM
  // ========================================

  const handleRoomChange = (
    roomId,
    field,
    value
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        room._id === roomId
          ? {
              ...room,
              [field]: value,
            }
          : room
      )
    );
  };

  const handleSaveRoom = async (room) => {
    try {

      const updatedRoom = {
        price: Number(room.price),
        capacity: Number(room.capacity),
        totalRooms: Number(
          room.totalRooms
        ),
        isActive: Boolean(
          room.isActive
        ),
      };

      const data = await updateRoom(
        room._id,
        updatedRoom
      );

      setRooms((prev) =>
        prev.map((item) =>
          item._id === room._id
            ? data.room
            : item
        )
      );

      setMessage(
        `${room.name} updated successfully.`
      );

    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to update room."
      );
    }
  };

  // ========================================
  // BOOKING STATUS
  // ========================================

  const handleBookingStatus = async (
    id,
    status
  ) => {
    try {

      await updateBookingStatus(
        id,
        status
      );

      setMessage(
        `Booking marked as ${status}.`
      );

      await loadData();

    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to update booking."
      );
    }
  };

  // ========================================
  // REVIEW STATUS
  // ========================================

  const handleReviewStatus = async (
    id,
    isApproved
  ) => {
    try {

      await updateReviewStatus(
        id,
        isApproved
      );

      setMessage(
        isApproved
          ? "Review approved."
          : "Review hidden."
      );

      await loadData();

    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to update review."
      );
    }
  };

  // ========================================
  // DELETE REVIEW
  // ========================================

  const handleDeleteReview = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Delete this review permanently?"
      );

    if (!confirmed) return;

    try {

      await deleteReview(id);

      setMessage(
        "Review deleted successfully."
      );

      await loadData();

    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to delete review."
      );
    }
  };

  // ========================================
  // STATISTICS
  // ========================================

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "confirmed"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "cancelled"
    ).length;

  const totalRevenue =
    bookings
      .filter(
        (booking) =>
          booking.status !== "cancelled"
      )
      .reduce(
        (sum, booking) =>
          sum +
          Number(
            booking.totalAmount || 0
          ),
        0
      );

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-16 px-5">

      <div className="max-w-7xl mx-auto">

        {/* ====================================
            OWNER HEADER
        ===================================== */}

        <div className="bg-forest text-ivory rounded-xl p-7 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>

              <p className="text-brasslight text-sm uppercase tracking-widest">
                Owner Dashboard
              </p>

              <h1 className="font-display text-3xl sm:text-4xl mt-2">
                Welcome, {user?.name}
              </h1>

              <p className="text-ivory/70 mt-2">
                Manage your hotel,
                bookings and reviews.
              </p>

            </div>

            <button
              onClick={onLogout}
              className="border border-ivory/30 hover:bg-white/10 px-5 py-2.5 rounded-md text-sm"
            >
              Logout
            </button>

          </div>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 bg-white border border-stone rounded-lg p-4 text-sm">
            {message}
          </div>
        )}

        {/* ====================================
            STATISTICS
        ===================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          <div className="bg-white border border-stone rounded-xl p-6">
            <p className="text-sm text-ink/50">
              Total Bookings
            </p>

            <p className="font-display text-3xl mt-2">
              {bookings.length}
            </p>
          </div>

          <div className="bg-white border border-stone rounded-xl p-6">
            <p className="text-sm text-ink/50">
              Confirmed
            </p>

            <p className="font-display text-3xl mt-2 text-green-600">
              {confirmedBookings}
            </p>
          </div>

          <div className="bg-white border border-stone rounded-xl p-6">
            <p className="text-sm text-ink/50">
              Cancelled
            </p>

            <p className="font-display text-3xl mt-2 text-red-500">
              {cancelledBookings}
            </p>
          </div>

          <div className="bg-white border border-stone rounded-xl p-6">
            <p className="text-sm text-ink/50">
              Revenue
            </p>

            <p className="font-display text-2xl mt-2 text-brass">
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

        </div>

        {/* ====================================
            ROOM MANAGEMENT
        ===================================== */}

        <section className="mb-12">

          <div className="mb-6">

            <p className="text-brass text-sm uppercase tracking-widest">
              Hotel Management
            </p>

            <h2 className="font-display text-3xl text-ink mt-1">
              Room Management
            </h2>

            <p className="text-ink/60 mt-2">
              Update room pricing, capacity,
              inventory and availability.
            </p>

          </div>

          {roomsLoading ? (
            <div className="bg-white border border-stone rounded-xl p-8 text-center">
              Loading rooms...
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white border border-stone rounded-xl p-8 text-center">
              No rooms found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {rooms.map((room) => (

                <div
                  key={room._id}
                  className="bg-white border border-stone rounded-xl overflow-hidden"
                >

                  {/* IMAGE */}

                  {room.images?.[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-3 mb-5">

                      <div>
                        <h3 className="font-display text-2xl text-ink">
                          {room.name}
                        </h3>

                        <p className="text-sm text-ink/50 mt-1">
                          {room.slug}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {room.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {/* PRICE */}

                    <div className="mb-4">

                      <label className="block text-xs uppercase tracking-wider text-ink/40 mb-2">
                        Price / Night
                      </label>

                      <div className="flex items-center">

                        <span className="border border-stone border-r-0 px-3 py-2 bg-stone/30">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={room.price}
                          onChange={(e) =>
                            handleRoomChange(
                              room._id,
                              "price",
                              e.target.value
                            )
                          }
                          className="w-full border border-stone px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
                        />

                      </div>
                    </div>

                    {/* CAPACITY */}

                    <div className="mb-4">

                      <label className="block text-xs uppercase tracking-wider text-ink/40 mb-2">
                        Guest Capacity
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={room.capacity}
                        onChange={(e) =>
                          handleRoomChange(
                            room._id,
                            "capacity",
                            e.target.value
                          )
                        }
                        className="w-full border border-stone px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
                      />

                    </div>

                    {/* TOTAL ROOMS */}

                    <div className="mb-5">

                      <label className="block text-xs uppercase tracking-wider text-ink/40 mb-2">
                        Total Rooms
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={room.totalRooms}
                        onChange={(e) =>
                          handleRoomChange(
                            room._id,
                            "totalRooms",
                            e.target.value
                          )
                        }
                        className="w-full border border-stone px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
                      />

                    </div>

                    {/* ACTIVE */}

                    <label className="flex items-center gap-3 mb-5 cursor-pointer">

                      <input
                        type="checkbox"
                        checked={Boolean(
                          room.isActive
                        )}
                        onChange={(e) =>
                          handleRoomChange(
                            room._id,
                            "isActive",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 accent-green-700"
                      />

                      <span className="text-sm text-ink">
                        Room is available for booking
                      </span>

                    </label>

                    {/* SAVE */}

                    <button
                      onClick={() =>
                        handleSaveRoom(room)
                      }
                      className="w-full bg-forest hover:bg-forestlight text-ivory py-3 rounded-md text-sm font-medium transition-colors"
                    >
                      Save Changes
                    </button>

                  </div>
                </div>

              ))}

            </div>
          )}

        </section>

        {/* ====================================
            BOOKING MANAGEMENT
        ===================================== */}

        <section className="mb-12">

          <h2 className="font-display text-3xl text-ink mb-5">
            Booking Management
          </h2>

          {loading ? (
            <div className="bg-white border border-stone rounded-xl p-8 text-center">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white border border-stone rounded-xl p-8 text-center">
              No bookings found.
            </div>
          ) : (
            <div className="bg-white border border-stone rounded-xl overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-stone/40">

                    <tr>

                      <th className="text-left px-5 py-4">
                        Guest
                      </th>

                      <th className="text-left px-5 py-4">
                        Room
                      </th>

                      <th className="text-left px-5 py-4">
                        Stay
                      </th>

                      <th className="text-left px-5 py-4">
                        Amount
                      </th>

                      <th className="text-left px-5 py-4">
                        Status
                      </th>

                      <th className="text-left px-5 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {bookings.map(
                      (booking) => (

                        <tr
                          key={booking._id}
                          className="border-t border-stone"
                        >

                          <td className="px-5 py-4">

                            <p className="font-medium">
                              {booking.guestName}
                            </p>

                            <p className="text-xs text-ink/50">
                              {booking.email}
                            </p>

                          </td>

                          <td className="px-5 py-4">
                            {booking.roomName}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            {formatDate(
                              booking.checkIn
                            )}

                            <br />

                            <span className="text-ink/40">
                              to
                            </span>

                            <br />

                            {formatDate(
                              booking.checkOut
                            )}
                          </td>

                          <td className="px-5 py-4 text-brass font-medium">
                            ₹
                            {Number(
                              booking.totalAmount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <StatusBadge
                              status={
                                booking.status
                              }
                            />

                          </td>

                          <td className="px-5 py-4">

                            {booking.status ===
                              "confirmed" && (
                              <button
                                onClick={() =>
                                  handleBookingStatus(
                                    booking._id,
                                    "completed"
                                  )
                                }
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Complete
                              </button>
                            )}

                            {booking.status ===
                              "completed" && (
                              <span className="text-green-600 text-xs">
                                Completed
                              </span>
                            )}

                            {booking.status ===
                              "cancelled" && (
                              <span className="text-ink/40 text-xs">
                                Cancelled
                              </span>
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </section>

        {/* ====================================
            REVIEW MANAGEMENT
        ===================================== */}

        <section>

          <h2 className="font-display text-3xl text-ink mb-5">
            Review Management
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white border border-stone rounded-xl p-8 text-center">
              No reviews found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">

              {reviews.map((review) => (

                <div
                  key={review._id}
                  className="bg-white border border-stone rounded-xl p-6"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="font-medium text-ink">
                        {review.name}
                      </h3>

                      <p className="text-xs text-ink/50 mt-1">
                        {review.location}
                      </p>
                    </div>

                    <span className="text-brass">
                      {"★".repeat(
                        review.rating
                      )}
                    </span>

                  </div>

                  <p className="text-sm text-ink/70 leading-relaxed mt-4">
                    "{review.comment}"
                  </p>

                  <div className="flex gap-3 mt-5 pt-4 border-t border-stone">

                    {!review.isApproved ? (
                      <button
                        onClick={() =>
                          handleReviewStatus(
                            review._id,
                            true
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-xs"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleReviewStatus(
                            review._id,
                            false
                          )
                        }
                        className="border border-stone px-4 py-2 rounded-md text-xs"
                      >
                        Hide
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDeleteReview(
                          review._id
                        )
                      }
                      className="border border-red-200 text-red-600 px-4 py-2 rounded-md text-xs"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD
// ==========================================

export default function Dashboard({
  onLogout,
}) {

  const user = getStoredUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-5">

        <div className="text-center">

          <h1 className="font-display text-3xl text-ink">
            Please login first
          </h1>

          <p className="text-ink/60 mt-2">
            Login to access your dashboard.
          </p>

        </div>

      </div>
    );
  }

  if (user.role === "owner") {
    return (
      <OwnerDashboard
        user={user}
        onLogout={onLogout || logout}
      />
    );
  }

  return (
    <GuestDashboard
      user={user}
      onLogout={onLogout || logout}
    />
  );
}