import React, { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { getStoredUser, logout } from "../api";

export default function Navbar({ onBook, onDashboard, onHome }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [role, setRole] = useState("guest");

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setUser(storedUser);
      setRole(storedUser.role || "guest");
    }
  }, []);

  // -----------------------------
  // AUTH
  // -----------------------------

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
    setMobileOpen(false);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthOpen(true);
    setMobileOpen(false);
  };

  const handleAuthSuccess = (data) => {
    if (data?.user) {
      setUser(data.user);
      setRole(data.user.role || "guest");

      // Login/Signup ke baad Dashboard open
      setTimeout(() => {
        setAuthOpen(false);
        onDashboard?.();
      }, 600);
    }
  };

  const handleLogout = () => {
    logout();

    setUser(null);
    setRole("guest");
    setMobileOpen(false);

    // Logout ke baad home
    onHome?.();
  };

  // -----------------------------
  // NAVIGATION
  // -----------------------------

  const handleBookClick = () => {
    setMobileOpen(false);
    onBook?.();
  };

  const handleDashboardClick = () => {
    setMobileOpen(false);
    onDashboard?.();
  };

  const handleHomeClick = () => {
    setMobileOpen(false);
    onHome?.();
  };

  const scrollToSection = (id) => {
    setMobileOpen(false);

    // Agar dashboard open hai to App ka onHome use hoga
    onHome?.();

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <>
      {/* =========================================
          NAVBAR
      ========================================== */}

      <header className="fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-stone">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="h-20 flex items-center justify-between">

            {/* =====================================
                LOGO
            ====================================== */}

            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-forest text-brass flex items-center justify-center font-display text-lg">
                GH
              </div>

              <div className="text-left">
                <p className="font-display text-xl text-ink leading-none">
                  The Grand Haven
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">
                  Luxury Hotel
                </p>
              </div>
            </button>

            {/* =====================================
                DESKTOP NAVIGATION
            ====================================== */}

            <nav className="hidden lg:flex items-center gap-7">

              <button
                onClick={handleHomeClick}
                className="text-sm text-ink/70 hover:text-brass transition-colors"
              >
                Home
              </button>

              <button
                onClick={() => scrollToSection("rooms")}
                className="text-sm text-ink/70 hover:text-brass transition-colors"
              >
                Rooms
              </button>

              <button
                onClick={() => scrollToSection("amenities")}
                className="text-sm text-ink/70 hover:text-brass transition-colors"
              >
                Amenities
              </button>

              <button
                onClick={() => scrollToSection("reviews")}
                className="text-sm text-ink/70 hover:text-brass transition-colors"
              >
                Reviews
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="text-sm text-ink/70 hover:text-brass transition-colors"
              >
                Contact
              </button>

              {/* Dashboard only after login */}
              {user && (
                <button
                  onClick={handleDashboardClick}
                  className="text-sm text-ink/70 hover:text-brass transition-colors"
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* =====================================
                RIGHT SIDE
            ====================================== */}

            <div className="hidden lg:flex items-center gap-3">

              {/* ROLE SELECTOR */}

              {!user && (
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none bg-white border border-stone rounded-md pl-3 pr-8 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brass cursor-pointer"
                  >
                    <option value="guest">Guest</option>
                    <option value="owner">Owner</option>
                  </select>

                  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-ink/50">
                    ▼
                  </span>
                </div>
              )}

              {/* =================================
                  NOT LOGGED IN
              ================================== */}

              {!user ? (
                <>
                  <button
                    onClick={openLogin}
                    className="text-sm text-ink/70 hover:text-brass transition-colors px-2"
                  >
                    Login
                  </button>

                  <button
                    onClick={openSignup}
                    className="text-sm text-ink/70 hover:text-brass transition-colors px-2"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                /* =================================
                   LOGGED IN
                ================================== */

                <div className="flex items-center gap-3">

                  <button
                    onClick={handleDashboardClick}
                    className="text-left"
                  >
                    <p className="text-sm font-medium text-ink hover:text-brass">
                      {user.name}
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-ink/50">
                      {user.role === "owner" ? "Owner" : "Guest"}
                    </p>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* BOOK BUTTON */}

              <button
                onClick={handleBookClick}
                className="bg-forest hover:bg-forestlight text-ivory px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Book Your Stay
              </button>
            </div>

            {/* =====================================
                MOBILE MENU BUTTON
            ====================================== */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-ink transition-transform ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />

              <span
                className={`w-6 h-0.5 bg-ink transition-opacity ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`w-6 h-0.5 bg-ink transition-transform ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>

          {/* =========================================
              MOBILE MENU
          ========================================== */}

          {mobileOpen && (
            <div className="lg:hidden border-t border-stone py-5">

              <nav className="flex flex-col gap-4">

                <button
                  onClick={handleHomeClick}
                  className="text-left text-ink/80 hover:text-brass"
                >
                  Home
                </button>

                <button
                  onClick={() => scrollToSection("rooms")}
                  className="text-left text-ink/80 hover:text-brass"
                >
                  Rooms
                </button>

                <button
                  onClick={() => scrollToSection("amenities")}
                  className="text-left text-ink/80 hover:text-brass"
                >
                  Amenities
                </button>

                <button
                  onClick={() => scrollToSection("reviews")}
                  className="text-left text-ink/80 hover:text-brass"
                >
                  Reviews
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-ink/80 hover:text-brass"
                >
                  Contact
                </button>

                {/* MOBILE DASHBOARD */}

                {user && (
                  <button
                    onClick={handleDashboardClick}
                    className="text-left text-ink/80 hover:text-brass"
                  >
                    Dashboard
                  </button>
                )}

                {/* =================================
                    ACCOUNT TYPE
                ================================== */}

                {!user && (
                  <div className="pt-2">

                    <p className="text-xs uppercase tracking-wider text-ink/40 mb-2">
                      Account Type
                    </p>

                    <div className="flex gap-2">

                      <button
                        onClick={() => setRole("guest")}
                        className={`px-4 py-2 rounded-md text-sm border ${
                          role === "guest"
                            ? "bg-forest text-ivory border-forest"
                            : "border-stone text-ink"
                        }`}
                      >
                        Guest
                      </button>

                      <button
                        onClick={() => setRole("owner")}
                        className={`px-4 py-2 rounded-md text-sm border ${
                          role === "owner"
                            ? "bg-forest text-ivory border-forest"
                            : "border-stone text-ink"
                        }`}
                      >
                        Owner
                      </button>

                    </div>
                  </div>
                )}

                {/* =================================
                    LOGIN / SIGNUP
                ================================== */}

                {!user ? (
                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={openLogin}
                      className="flex-1 border border-stone py-2.5 rounded-md text-sm"
                    >
                      Login
                    </button>

                    <button
                      onClick={openSignup}
                      className="flex-1 bg-forest text-ivory py-2.5 rounded-md text-sm"
                    >
                      Sign Up
                    </button>

                  </div>
                ) : (
                  /* =================================
                     MOBILE LOGGED USER
                  ================================== */

                  <div className="pt-2">

                    <p className="font-medium text-ink">
                      {user.name}
                    </p>

                    <p className="text-xs text-ink/50 mt-1">
                      Logged in as{" "}
                      {user.role === "owner" ? "Owner" : "Guest"}
                    </p>

                    <button
                      onClick={handleLogout}
                      className="mt-3 text-sm text-red-500"
                    >
                      Logout
                    </button>

                  </div>
                )}

                {/* BOOK */}

                <button
                  onClick={handleBookClick}
                  className="w-full bg-brass hover:bg-brasslight text-ink py-3 rounded-md font-medium"
                >
                  Book Your Stay
                </button>

              </nav>
            </div>
          )}
        </div>
      </header>

      {/* =========================================
          AUTH MODAL
      ========================================== */}

      {authOpen && (
        <AuthModal
          mode={authMode}
          role={role}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}