import React from "react";

export default function RoomCard({ room, onView, onBook }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone/60 hover:shadow-xl transition-shadow duration-300">
      
      {/* Room Image */}
      <div className="h-64 overflow-hidden">
        <img
          src={room.images?.[0]}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Room Details */}
      <div className="p-6">
        <p className="text-brass text-sm tracking-wide mb-2">
          {room.tagline}
        </p>

        <h3 className="font-display text-2xl text-ink mb-3">
          {room.name}
        </h3>

        <p className="text-ink/65 text-sm leading-relaxed mb-5">
          {room.description}
        </p>

        {/* Room Info */}
        <div className="grid grid-cols-2 gap-3 text-sm text-ink/70 mb-6">
          <div>
            <span className="font-semibold">Guests:</span>{" "}
            {room.capacity}
          </div>

          <div>
            <span className="font-semibold">Bed:</span>{" "}
            {room.bedType}
          </div>

          <div>
            <span className="font-semibold">Size:</span>{" "}
            {room.size}
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="font-display text-2xl text-forest">
            ₹{room.price?.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-ink/50"> / night</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onView(room)}
            className="flex-1 border border-forest text-forest px-4 py-3 rounded-xl hover:bg-forest hover:text-white transition"
          >
            View Room
          </button>

          <button
            onClick={() => onBook(room)}
            className="flex-1 bg-forest text-white px-4 py-3 rounded-xl hover:bg-forestlight transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}