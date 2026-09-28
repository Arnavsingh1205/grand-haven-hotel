import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-ink text-ivory">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <a href="#home" className="inline-block">
              <h3 className="font-display text-3xl font-semibold mb-2 hover:text-brasslight transition">
                The Grand Haven
              </h3>

              <p className="text-brasslight text-xs tracking-[0.25em] uppercase">
                Hotel & Resort
              </p>
            </a>

            <p className="text-ivory/60 text-sm leading-relaxed mt-6 max-w-xs">
              A refined boutique hotel in the heart of New Delhi, offering
              thoughtful hospitality, elegant rooms, and memorable stays.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-sm hover:bg-brass hover:border-brass transition"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-sm hover:bg-brass hover:border-brass transition"
              >
                f
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-sm hover:bg-brass hover:border-brass transition"
              >
                in
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brasslight text-sm tracking-[0.2em] uppercase mb-5">
              Contact
            </h4>

            <ul className="text-ivory/70 text-sm space-y-4">

              {/* Address */}
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Connaught+Place+New+Delhi+Delhi+110001+India"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brasslight transition leading-relaxed"
                >
                  📍 Connaught Place,
                  <br />
                  New Delhi, Delhi 110001,
                  <br />
                  India
                </a>
              </li>

              {/* Phone */}
              <li>
                <a
                  href="tel:+917903466266"
                  className="hover:text-brasslight transition"
                >
                  📞 +91 7903466266
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:stay@thegrandhaven.example"
                  className="hover:text-brasslight transition break-all"
                >
                  ✉️ stay@thegrandhaven.example
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-brasslight text-sm tracking-[0.2em] uppercase mb-5">
              Explore
            </h4>

            <ul className="text-ivory/70 text-sm space-y-3">

              <li>
                <a
                  href="#home"
                  className="hover:text-brasslight transition"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#rooms"
                  className="hover:text-brasslight transition"
                >
                  Rooms & Suites
                </a>
              </li>

              <li>
                <a
                  href="#amenities"
                  className="hover:text-brasslight transition"
                >
                  Amenities
                </a>
              </li>

              <li>
                <a
                  href="#reviews"
                  className="hover:text-brasslight transition"
                >
                  Guest Reviews
                </a>
              </li>

              <li>
                <a
                  href="#booking"
                  className="hover:text-brasslight transition"
                >
                  Book Your Stay
                </a>
              </li>
            </ul>
          </div>

          {/* Hotel Information */}
          <div>
            <h4 className="text-brasslight text-sm tracking-[0.2em] uppercase mb-5">
              Hotel Information
            </h4>

            <div className="text-ivory/70 text-sm space-y-4">
              <div>
                <p className="text-ivory font-medium mb-1">
                  Front Desk
                </p>

                <p>
                  Open 24 hours,
                  <br />
                  every day of the year.
                </p>
              </div>

              <div>
                <p className="text-ivory font-medium mb-1">
                  Check-in
                </p>

                <p>From 12:00 PM</p>
              </div>

              <div>
                <p className="text-ivory font-medium mb-1">
                  Check-out
                </p>

                <p>By 11:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-ivory/40 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} The Grand Haven. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-ivory/40">
            <a
              href="#"
              className="hover:text-brasslight transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-brasslight transition"
            >
              Terms & Conditions
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}