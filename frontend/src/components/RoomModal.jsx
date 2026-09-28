import React, { useState } from "react";

export default function RoomModal({ room, onClose, onBook }) {
  const [currentImage, setCurrentImage] = useState(0);

  if (!room) {
    return null;
  }

  const images =
    room.images && room.images.length > 0
      ? room.images
      : ["https://picsum.photos/900/650?random=1"];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBook = () => {
    if (onBook) {
      onBook(room);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-ivory w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone">
          <div>
            <p className="text-brass text-sm uppercase tracking-[0.2em]">
              Room Details
            </p>

            <h2 className="font-display text-3xl text-ink">
              {room.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-stone text-ink hover:bg-stone transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Gallery */}
        <div className="relative">
          <img
            src={images[currentImage]}
            alt={room.name}
            className="w-full h-[280px] sm:h-[420px] object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white text-2xl hover:bg-black/80"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white text-2xl hover:bg-black/80"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 p-4 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image + index}
                onClick={() => setCurrentImage(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                  currentImage === index
                    ? "border-brass"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${room.name} ${index + 1}`}
                  className="w-20 h-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="p-6 sm:p-8">
          <p className="text-brass mb-2">
            {room.tagline}
          </p>

          <p className="text-ink/70 leading-relaxed mb-7">
            {room.description}
          </p>

          {/* Basic Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-stone/40 p-4 rounded-lg">
              <p className="text-xs text-ink/50 uppercase">Guests</p>
              <p className="font-semibold mt-1">
                {room.capacity}
              </p>
            </div>

            <div className="bg-stone/40 p-4 rounded-lg">
              <p className="text-xs text-ink/50 uppercase">Bed</p>
              <p className="font-semibold mt-1">
                {room.bedType}
              </p>
            </div>

            <div className="bg-stone/40 p-4 rounded-lg">
              <p className="text-xs text-ink/50 uppercase">Size</p>
              <p className="font-semibold mt-1">
                {room.size}
              </p>
            </div>

            <div className="bg-stone/40 p-4 rounded-lg">
              <p className="text-xs text-ink/50 uppercase">From</p>
              <p className="font-semibold mt-1 text-forest">
                ₹{room.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="mb-8">
              <h3 className="font-display text-2xl text-ink mb-4">
                Room Amenities
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-ink/70"
                  >
                    <span className="text-brass">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone">
            <div>
              <span className="font-display text-3xl text-forest">
                ₹{room.price?.toLocaleString("en-IN")}
              </span>

              <span className="text-ink/50 text-sm">
                {" "}
                / night
              </span>
            </div>

            <button
              onClick={handleBook}
              className="w-full sm:w-auto bg-forest text-white px-8 py-3.5 rounded-xl hover:bg-forestlight transition"
            >
              Book This Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}