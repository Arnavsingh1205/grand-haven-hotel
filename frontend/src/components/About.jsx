import React from "react";

export default function About() {
  return (
    <section id="about" className="bg-ivory">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
              alt="The Grand Haven hotel"
              className="w-full h-[420px] object-cover"
            />

            <div className="absolute -bottom-6 -right-6 bg-forest text-ivory px-7 py-6">
              <p className="font-display text-3xl">Since 2014</p>
              <p className="text-sm text-ivory/70 mt-1">
                Hospitality with heart
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-brass text-sm tracking-[0.2em] uppercase mb-4">
              About The Grand Haven
            </p>

            <h2 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-6">
              A quiet place to feel at home.
            </h2>

            <p className="text-ink/70 leading-relaxed mb-5">
              The Grand Haven is designed for travelers who appreciate
              thoughtful spaces, warm hospitality, and a peaceful stay.
            </p>

            <p className="text-ink/70 leading-relaxed mb-8">
              From comfortable rooms to personalized service, every detail
              is created to make your stay simple, relaxing, and memorable.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="font-display text-xl text-ink">
                  Central
                </p>
                <p className="text-sm text-ink/60 mt-1">
                  But calm
                </p>
              </div>

              <div>
                <p className="font-display text-xl text-ink">
                  Home-style
                </p>
                <p className="text-sm text-ink/60 mt-1">
                  Breakfast
                </p>
              </div>

              <div>
                <p className="font-display text-xl text-ink">
                  Personal
                </p>
                <p className="text-sm text-ink/60 mt-1">
                  Service
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}