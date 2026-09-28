import React, { useState } from "react";
import { searchRooms } from "../api";

export default function Hero({ onBook }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!checkIn || !checkOut) {
      setMessage("Please select check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setMessage("Check-out date must be after check-in date.");
      return;
    }

    try {
      setLoading(true);

      const data = await searchRooms(checkIn, checkOut, guests);

      // ⭐ ADD THIS
      window.__grandHavenSearch = {
        checkIn,
        checkOut,
        guests,
      };

      // ⭐ ADD THIS
      window.dispatchEvent(
        new Event("grand-haven-room-search")
      );

      if (!data?.rooms?.length) {
        setMessage("No rooms are available for these dates.");
        return;
      }

      setMessage(
        `${data.rooms.length} room type${
          data.rooms.length > 1 ? "s" : ""
        } available.`
      );

      setTimeout(() => {
        document.getElementById("rooms")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Unable to search rooms. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=90')",
        }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl text-white">
          <p className="uppercase tracking-[0.35em] text-sm text-brasslight mb-5">
            Luxury • Comfort • Hospitality
          </p>

          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
            Your Stay,
            <br />
            <span className="text-brasslight">
              Beautifully Remembered.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed mb-10">
            Experience refined hospitality, elegant rooms and warm Indian
            service at The Grand Haven, New Delhi.
          </p>
        </div>

        {/* SEARCH BOX */}
        <form
          onSubmit={handleSearch}
          className="mt-10 bg-white rounded-2xl shadow-2xl p-4 md:p-5 max-w-6xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Check In */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                Check-in
              </label>

              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brass"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                Check-out
              </label>

              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brass"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                Guests
              </label>

              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brass"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-forestlight transition disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search Rooms"}
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm font-medium text-forest">
              {message}
            </p>
          )}
        </form>

        {/* BOOK NOW */}
        <button
          onClick={() => onBook()}
          className="mt-6 border border-white/50 text-white px-7 py-3 rounded-full hover:bg-white hover:text-forest transition"
        >
          Book Your Stay →
        </button>
      </div>
    </section>
  );
}