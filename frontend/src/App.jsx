import React, { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import RoomsSection from "./components/RoomsSection";
import Amenities from "./components/Amenities";
import Testimonials from "./components/Testimonials";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleBook = (room = null) => {
    setShowDashboard(false);
    setSelectedRoom(room);

    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleDashboard = () => {
    setShowDashboard(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleHome = () => {
    setShowDashboard(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Navbar
        onBook={handleBook}
        onDashboard={handleDashboard}
        onHome={handleHome}
      />

      {showDashboard ? (
        <Dashboard
          onLogout={() => {
            setShowDashboard(false);
          }}
        />
      ) : (
        <>
          <main>
            <Hero onBook={handleBook} />

            <About />

            <RoomsSection onBook={handleBook} />

            <Amenities />

            <Testimonials />

            <BookingForm selectedRoom={selectedRoom} />
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}