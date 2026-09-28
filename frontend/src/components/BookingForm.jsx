import React, { useEffect, useMemo, useState } from "react";
import {
  createBooking,
  getRooms,
  getRoomAvailability,
  getStoredUser,
} from "../api";

const today = new Date().toISOString().split("T")[0];

export default function BookingForm({ selectedRoom, onDone }) {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    roomSlug: "",
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequest: "",
  });

  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [status, setStatus] = useState({
    state: "idle",
    message: "",
  });

  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {
    const loadUser = () => {
      const storedUser = getStoredUser();

      if (!storedUser) {
        setUser(null);
        return;
      }

      setUser(storedUser);

      setForm((prev) => ({
        ...prev,
        guestName: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
      }));
    };

    loadUser();
  }, []);

  // ==========================================
  // LOAD ROOMS
  // ==========================================

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);

        const data = await getRooms();

        console.log("ROOMS FROM API:", data);

        if (Array.isArray(data) && data.length > 0) {
          setRooms(data);

          setForm((prev) => ({
            ...prev,
            roomSlug:
              selectedRoom?.slug ||
              prev.roomSlug ||
              data[0]?.slug ||
              "",
          }));
        } else {
          setRooms([]);

          setStatus({
            state: "error",
            message: "No rooms are available.",
          });
        }
      } catch (error) {
        console.error("LOAD ROOMS ERROR:", error);

        setStatus({
          state: "error",
          message:
            error?.response?.data?.message ||
            "Unable to load rooms.",
        });
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [selectedRoom]);

  // ==========================================
  // SELECTED ROOM
  // ==========================================

  useEffect(() => {
    if (!selectedRoom?.slug) return;

    setForm((prev) => ({
      ...prev,
      roomSlug: selectedRoom.slug,
    }));
  }, [selectedRoom]);

  // ==========================================
  // ACTIVE ROOM
  // ==========================================

  const activeRoom = useMemo(() => {
    return (
      rooms.find((room) => room.slug === form.roomSlug) ||
      rooms.find((room) => room.slug === selectedRoom?.slug) ||
      selectedRoom ||
      rooms[0] ||
      null
    );
  }, [rooms, form.roomSlug, selectedRoom]);

  // ==========================================
  // NIGHTS
  // ==========================================

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) {
      return 0;
    }

    const start = new Date(`${form.checkIn}T00:00:00`);
    const end = new Date(`${form.checkOut}T00:00:00`);

    const difference =
      (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24);

    return difference > 0 ? difference : 0;
  }, [form.checkIn, form.checkOut]);

  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    nights * Number(activeRoom?.price || 0);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "guests"
          ? Number(value)
          : value,
    }));

    if (
      name === "roomSlug" ||
      name === "checkIn" ||
      name === "checkOut" ||
      name === "guests"
    ) {
      setAvailability(null);
    }

    setStatus({
      state: "idle",
      message: "",
    });
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateBooking = () => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      return "Please login as a guest before making a booking.";
    }

    if (currentUser.role !== "guest") {
      return "Only guest accounts can make hotel bookings.";
    }

    if (!activeRoom) {
      return "Please select a room.";
    }

    const guestName = (
      form.guestName ||
      currentUser.name ||
      ""
    ).trim();

    const email = (
      form.email ||
      currentUser.email ||
      ""
    ).trim();

    const phone = (
      form.phone ||
      currentUser.phone ||
      ""
    ).trim();

    if (!guestName) {
      return "Please enter your full name.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!phone) {
      return "Please enter your phone number.";
    }

    if (!form.checkIn) {
      return "Please select your check-in date.";
    }

    if (!form.checkOut) {
      return "Please select your check-out date.";
    }

    if (nights <= 0) {
      return "Check-out date must be after check-in date.";
    }

    if (!form.roomSlug) {
      return "Please select a room.";
    }

    const guestCount = Number(form.guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return "Please enter at least 1 guest.";
    }

    if (
      guestCount >
      Number(activeRoom.capacity)
    ) {
      return `Maximum ${activeRoom.capacity} guest${
        activeRoom.capacity > 1 ? "s" : ""
      } allowed for this room.`;
    }

    return null;
  };

  // ==========================================
  // CHECK AVAILABILITY
  // ==========================================

  const handleCheckAvailability = async () => {
    setStatus({
      state: "idle",
      message: "",
    });

    if (!form.checkIn || !form.checkOut) {
      setStatus({
        state: "error",
        message:
          "Please select check-in and check-out dates.",
      });
      return;
    }

    if (nights <= 0) {
      setStatus({
        state: "error",
        message:
          "Check-out date must be after check-in date.",
      });
      return;
    }

    if (!activeRoom) {
      setStatus({
        state: "error",
        message: "Please select a room.",
      });
      return;
    }

    if (
      Number(form.guests) >
      Number(activeRoom.capacity)
    ) {
      setStatus({
        state: "error",
        message: `Maximum ${activeRoom.capacity} guest${
          activeRoom.capacity > 1 ? "s" : ""
        } allowed for this room.`,
      });
      return;
    }

    try {
      setCheckingAvailability(true);
      setAvailability(null);

      const data =
        await getRoomAvailability(
          activeRoom.slug,
          form.checkIn,
          form.checkOut
        );

      console.log(
        "AVAILABILITY RESPONSE:",
        data
      );

      setAvailability(data);

      if (data?.available) {
        setStatus({
          state: "success",
          message: `${activeRoom.name} is available for your selected dates.`,
        });
      } else {
        setStatus({
          state: "error",
          message:
            data?.message ||
            "This room is not available for the selected dates.",
        });
      }
    } catch (error) {
      console.error(
        "AVAILABILITY ERROR:",
        error
      );

      setStatus({
        state: "error",
        message:
          error?.response?.data?.message ||
          "Unable to check room availability.",
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  // ==========================================
  // CONFIRM BOOKING
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus({
      state: "idle",
      message: "",
    });

    const currentUser = getStoredUser();

    console.log(
      "===================================="
    );
    console.log("BOOKING STARTED");
    console.log(
      "===================================="
    );

    console.log("FORM DATA:", form);
    console.log("CURRENT USER:", currentUser);
    console.log("ACTIVE ROOM:", activeRoom);
    console.log("SELECTED ROOM:", selectedRoom);

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    const validationError =
      validateBooking();

    if (validationError) {
      console.error(
        "VALIDATION ERROR:",
        validationError
      );

      setStatus({
        state: "error",
        message: validationError,
      });

      return;
    }

    // ------------------------------------------
    // USER DATA
    // ------------------------------------------

    const guestName = (
      form.guestName ||
      currentUser.name ||
      ""
    ).trim();

    const email = (
      form.email ||
      currentUser.email ||
      ""
    ).trim();

    const phone = (
      form.phone ||
      currentUser.phone ||
      ""
    ).trim();

    const roomSlug =
      form.roomSlug ||
      activeRoom?.slug ||
      selectedRoom?.slug ||
      "";

    const guests = Number(form.guests);

    // ------------------------------------------
    // FINAL PAYLOAD
    // ------------------------------------------

    const bookingPayload = {
      roomSlug,
      guestName,
      email,
      phone,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests,
      specialRequest:
        form.specialRequest?.trim() || "",
    };

    console.log(
      "===================================="
    );
    console.log("FINAL BOOKING PAYLOAD");
    console.log(
      "===================================="
    );
    console.log(bookingPayload);

    // ------------------------------------------
    // CHECK AVAILABILITY AGAIN
    // ------------------------------------------

    try {
      setCheckingAvailability(true);

      const availableData =
        await getRoomAvailability(
          roomSlug,
          form.checkIn,
          form.checkOut
        );

      console.log(
        "FINAL AVAILABILITY:",
        availableData
      );

      setAvailability(availableData);

      if (!availableData?.available) {
        setStatus({
          state: "error",
          message:
            availableData?.message ||
            "This room is no longer available for these dates.",
        });

        return;
      }

      // ----------------------------------------
      // CREATE BOOKING
      // ----------------------------------------

      setStatus({
        state: "loading",
        message: "Confirming your booking...",
      });

      console.log(
        "SENDING BOOKING TO BACKEND..."
      );

      const response =
        await createBooking(
          bookingPayload
        );

      console.log(
        "===================================="
      );
      console.log("BOOKING SUCCESS");
      console.log(
        "===================================="
      );
      console.log(
        "SERVER RESPONSE:",
        response
      );

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      setStatus({
        state: "success",
        message: `Booking confirmed for ${
          activeRoom.name
        } for ${nights} night${
          nights > 1 ? "s" : ""
        }.`,
      });

      setAvailability(null);

      // Keep guest information and room
      // but clear old dates/request
      setForm((prev) => ({
        ...prev,
        guestName,
        email,
        phone,
        roomSlug,
        checkIn: "",
        checkOut: "",
        guests,
        specialRequest: "",
      }));

      // Send booking to parent
      if (onDone) {
        onDone(
          response?.booking ||
            response
        );
      }
    } catch (error) {
      console.error(
        "===================================="
      );
      console.error("BOOKING ERROR");
      console.error(
        "===================================="
      );

      console.error(
        "ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      console.error(
        "HTTP STATUS:",
        error?.response?.status
      );

      setStatus({
        state: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Couldn't complete the booking. Please try again.",
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section
      id="booking"
      className="bg-ivory"
    >
      <div className="max-w-5xl mx-auto px-6 py-24">

        {/* HEADER */}

        <div className="max-w-lg mb-12">
          <p className="text-brass text-sm tracking-wide mb-3">
            Reserve your stay
          </p>

          <h2 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
            Check availability and book directly.
          </h2>

          <p className="text-ink/60 mt-4">
            Login as a guest to complete your reservation.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 gap-10"
        >

          {/* LEFT */}

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">

            {/* ROOM */}

            <div className="sm:col-span-2">
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="roomSlug"
              >
                Room type
              </label>

              <select
                id="roomSlug"
                name="roomSlug"
                value={form.roomSlug}
                onChange={handleChange}
                disabled={loadingRooms}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
              >
                {loadingRooms ? (
                  <option value="">
                    Loading rooms...
                  </option>
                ) : rooms.length === 0 ? (
                  <option value="">
                    No rooms available
                  </option>
                ) : (
                  rooms.map((room) => (
                    <option
                      key={room.slug}
                      value={room.slug}
                    >
                      {room.name} — ₹
                      {Number(
                        room.price
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      / night
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* NAME */}

            <div>
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="guestName"
              >
                Full name
              </label>

              <input
                id="guestName"
                name="guestName"
                type="text"
                value={form.guestName}
                onChange={handleChange}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
                placeholder="Your name"
              />
            </div>

            {/* PHONE */}

            <div>
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="phone"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
                placeholder="+91 00000 00000"
              />
            </div>

            {/* EMAIL */}

            <div className="sm:col-span-2">
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="email"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* CHECK IN */}

            <div>
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="checkIn"
              >
                Check-in
              </label>

              <input
                id="checkIn"
                name="checkIn"
                type="date"
                min={today}
                value={form.checkIn}
                onChange={handleChange}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
              />
            </div>

            {/* CHECK OUT */}

            <div>
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="checkOut"
              >
                Check-out
              </label>

              <input
                id="checkOut"
                name="checkOut"
                type="date"
                min={form.checkIn || today}
                value={form.checkOut}
                onChange={handleChange}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
              />
            </div>

            {/* GUESTS */}

            <div>
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="guests"
              >
                Guests
              </label>

              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max={activeRoom?.capacity || 1}
                value={form.guests}
                onChange={handleChange}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
              />

              {activeRoom && (
                <p className="text-xs text-ink/50 mt-1">
                  Maximum{" "}
                  {activeRoom.capacity} guest
                  {activeRoom.capacity > 1
                    ? "s"
                    : ""}
                </p>
              )}
            </div>

            {/* SPECIAL REQUEST */}

            <div className="sm:col-span-2">
              <label
                className="block text-sm text-ink/70 mb-2"
                htmlFor="specialRequest"
              >
                Special request{" "}
                <span className="text-ink/40">
                  (optional)
                </span>
              </label>

              <textarea
                id="specialRequest"
                name="specialRequest"
                value={form.specialRequest}
                onChange={handleChange}
                rows={3}
                className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none"
                placeholder="Early check-in, extra bed, dietary needs..."
              />
            </div>

            {/* AVAILABILITY */}

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={
                  handleCheckAvailability
                }
                disabled={
                  checkingAvailability
                }
                className="w-full border border-forest text-forest hover:bg-forest hover:text-ivory disabled:opacity-50 py-3 rounded-sm font-medium transition-colors"
              >
                {checkingAvailability
                  ? "Checking availability..."
                  : "Check Room Availability"}
              </button>
            </div>

            {/* AVAILABILITY RESULT */}

            {availability && (
              <div
                className={`sm:col-span-2 rounded-md p-4 text-sm ${
                  availability.available
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {availability.available
                  ? `✓ ${
                      activeRoom?.name
                    } is available for your selected dates.`
                  : availability.message ||
                    "Room is not available for these dates."}
              </div>
            )}

            {/* STATUS */}

            {status.state !== "idle" && (
              <div
                className={`sm:col-span-2 p-4 rounded-md text-sm ${
                  status.state === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : status.state === "loading"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {status.state === "success"
                  ? "✓ "
                  : status.state === "loading"
                  ? "⏳ "
                  : "⚠️ "}
                {status.message}
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}

          <div className="bg-forest text-ivory rounded-sm p-8 h-fit">

            <h3 className="font-display text-xl mb-6">
              Stay summary
            </h3>

            <div className="space-y-4 text-sm text-ivory/80">

              <div className="flex justify-between gap-4">
                <span>Room</span>

                <span className="text-ivory text-right">
                  {activeRoom?.name || "—"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Rate</span>

                <span className="text-ivory">
                  ₹
                  {Number(
                    activeRoom?.price || 0
                  ).toLocaleString(
                    "en-IN"
                  )}{" "}
                  / night
                </span>
              </div>

              <div className="flex justify-between">
                <span>Guests</span>

                <span className="text-ivory">
                  {form.guests}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Nights</span>

                <span className="text-ivory">
                  {nights || "—"}
                </span>
              </div>

              <div className="pt-4 border-t border-ivory/20 flex justify-between font-display text-lg">
                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>

            {/* CONFIRM */}

            <button
              type="submit"
              disabled={
                loadingRooms ||
                checkingAvailability ||
                status.state === "loading"
              }
              className="w-full mt-8 bg-brass hover:bg-brasslight disabled:opacity-60 text-ink py-3 rounded-sm font-medium transition-colors"
            >
              {status.state === "loading"
                ? "Confirming..."
                : "Confirm Booking"}
            </button>

            {/* USER */}

            {user ? (
              <p className="mt-4 text-xs text-ivory/60 text-center">
                Booking as {user.name}
              </p>
            ) : (
              <p className="mt-4 text-xs text-ivory/60 text-center">
                Please login as a guest before booking.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}