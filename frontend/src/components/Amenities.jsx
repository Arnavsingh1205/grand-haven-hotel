import React from "react";

const amenities = [
  {
    title: "Swimming Pool",
    description:
      "Relax beside our beautifully maintained pool with a serene atmosphere.",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
    icon: "🏊",
  },
  {
    title: "Restaurant",
    description:
      "Enjoy fresh cuisine and carefully crafted dining with a variety of dishes.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85",
    icon: "🍽️",
  },
  {
    title: "Fitness Center",
    description:
      "Modern equipment for your daily workout and wellness routine.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85",
    icon: "💪",
  },
  {
    title: "Spa & Wellness",
    description:
      "Unwind with relaxing spa and wellness services for a rejuvenating experience.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
    icon: "🧖",
  },
  {
    title: "Free Parking",
    description:
      "Convenient and secure parking for our guests throughout their stay.",
    image:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=85",
    icon: "🚗",
  },
  {
    title: "High-Speed Wi-Fi",
    description:
      "Stay connected throughout your entire stay with reliable high-speed internet.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85",
    icon: "📶",
  },
];

export default function Amenities() {
  return (
    <section id="amenities" className="bg-ivory py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-brass uppercase tracking-[0.3em] text-sm mb-4">
            Our Amenities
          </p>

          <h2 className="font-display text-4xl md:text-5xl text-ink mb-5">
            Everything You Need for a Perfect Stay
          </h2>

          <div className="w-20 h-1 bg-brass mx-auto mb-6"></div>

          <p className="text-ink/65 text-lg leading-relaxed">
            From relaxing moments by the pool to productive mornings in our
            fitness center, The Grand Haven is designed around your comfort.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {amenities.map((amenity) => (
            <article
              key={amenity.title}
              className="group bg-white rounded-2xl overflow-hidden border border-stone/60 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={amenity.image}
                  alt={amenity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Icon */}
                <div className="absolute left-1/2 -bottom-7 -translate-x-1/2 w-14 h-14 rounded-full bg-forest border-4 border-brass flex items-center justify-center text-2xl shadow-lg">
                  {amenity.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center px-7 pt-12 pb-8">
                <h3 className="font-display text-2xl text-ink mb-3">
                  {amenity.title}
                </h3>

                <p className="text-ink/60 leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}