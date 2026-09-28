import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import RoomModal from "./RoomModal";
import { getRooms, searchRooms } from "../api";
import { fallbackRooms } from "../fallbackData";

export default function RoomsSection({ onBook }) {
  const [rooms, setRooms] = useState(fallbackRooms);
  const [loading, setLoading] = useState(true);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  // Load all rooms when page opens
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);

      const data = await getRooms();

      if (Array.isArray(data) && data.length > 0) {
        setRooms(data);
      }
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for search from Hero.jsx
  useEffect(() => {
    const handleRoomSearch = async () => {
      const searchData = window.__grandHavenSearch;

      if (!searchData) return;

      const { checkIn, checkOut, guests } = searchData;

      try {
        setLoading(true);

        const data = await searchRooms(
          checkIn,
          checkOut,
          guests
        );

        if (data?.rooms) {
          setRooms(data.rooms);

          setSearchInfo({
            checkIn,
            checkOut,
            guests,
            count: data.rooms.length,
          });
        } else {
          setRooms([]);

          setSearchInfo({
            checkIn,
            checkOut,
            guests,
            count: 0,
          });
        }
      } catch (error) {
        console.error("Room search failed:", error);

        setRooms([]);

        setSearchInfo({
          checkIn,
          checkOut,
          guests,
          count: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener(
      "grand-haven-room-search",
      handleRoomSearch
    );

    return () => {
      window.removeEventListener(
        "grand-haven-room-search",
        handleRoomSearch
      );
    };
  }, []);

  // Book room
  const handleBookFromModal = (room) => {
    setViewingRoom(null);
    onBook(room);
  };

  // Show all rooms again
  const handleShowAllRooms = async () => {
    setSearchInfo(null);

    window.__grandHavenSearch = null;

    await loadRooms();
  };

  return (
    <section
      id="rooms"
      className="bg-stone/40 py-20"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">

          <p className="uppercase tracking-[0.3em] text-sm text-brass font-semibold mb-3">
            Stay With Us
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-forest mb-5">
            Rooms & Suites
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Choose from our thoughtfully designed rooms and suites,
            created for comfort, privacy and a memorable stay.
          </p>

        </div>

        {/* SEARCH RESULTS INFO */}
        {searchInfo && (
          <div className="mb-8 bg-white rounded-2xl border border-stone shadow-sm p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="text-sm text-gray-500">
                  Search results
                </p>

                <p className="font-semibold text-forest text-lg">
                  {searchInfo.count} room type
                  {searchInfo.count !== 1 ? "s" : ""} available
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {searchInfo.checkIn} →{" "}
                  {searchInfo.checkOut} •{" "}
                  {searchInfo.guests} guest
                  {searchInfo.guests !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={handleShowAllRooms}
                className="border border-forest text-forest px-5 py-2.5 rounded-full hover:bg-forest hover:text-white transition"
              >
                Show All Rooms
              </button>

            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-16">

            <div className="inline-block w-10 h-10 border-4 border-stone border-t-forest rounded-full animate-spin" />

            <p className="mt-4 text-gray-500">
              Finding available rooms...
            </p>

          </div>
        ) : rooms.length === 0 ? (

          /* NO ROOMS */
          <div className="bg-white rounded-2xl p-12 text-center border border-stone">

            <div className="text-5xl mb-4">
              🏨
            </div>

            <h3 className="font-serif text-2xl text-forest mb-2">
              No rooms available
            </h3>

            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find an available room for your
              selected dates and number of guests.
              Please try different dates.
            </p>

            {searchInfo && (
              <button
                onClick={handleShowAllRooms}
                className="mt-6 bg-forest text-white px-6 py-3 rounded-full hover:bg-forestlight transition"
              >
                View All Rooms
              </button>
            )}

          </div>
        ) : (

          /* ROOMS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {rooms.map((room) => (
              <RoomCard
                key={room._id || room.slug}
                room={room}
                onView={() => setViewingRoom(room)}
                onBook={() => onBook(room)}
              />
            ))}

          </div>
        )}

      </div>

      {/* ROOM MODAL */}
      {viewingRoom && (
        <RoomModal
          room={viewingRoom}
          onClose={() => setViewingRoom(null)}
          onBook={handleBookFromModal}
        />
      )}

    </section>
  );
}