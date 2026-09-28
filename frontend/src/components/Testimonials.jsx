import React, { useEffect, useState } from "react";
import { createReview, getReviews } from "../api";

const fallbackReviews = [
  {
    name: "Ananya Sharma",
    location: "Mumbai, India",
    rating: 5,
    comment:
      "Stayed in the Couple Suite for our anniversary and it was a wonderful experience. The room was beautiful, clean and extremely comfortable.",
    roomStayed: "Couple Suite",
  },
  {
    name: "Rohit Verma",
    location: "Delhi, India",
    rating: 5,
    comment:
      "I travel for work regularly and the Single Room was quiet, clean and very comfortable. The staff were also very helpful.",
    roomStayed: "Single Room",
  },
  {
    name: "Priya Nair",
    location: "Bengaluru, India",
    rating: 4,
    comment:
      "The Deluxe Room was spacious and beautifully designed. The bed was comfortable and the overall hotel atmosphere was excellent.",
    roomStayed: "Deluxe Room",
  },
  {
    name: "James Whitfield",
    location: "London, UK",
    rating: 5,
    comment:
      "A beautiful boutique hotel with excellent attention to detail. The room was elegant, comfortable and very well maintained.",
    roomStayed: "Deluxe Room",
  },
  {
    name: "Sneha Kulkarni",
    location: "Pune, India",
    rating: 5,
    comment:
      "Booked the Couple Suite for a weekend getaway and absolutely loved the experience. Everything felt premium and thoughtfully arranged.",
    roomStayed: "Couple Suite",
  },
  {
    name: "Arjun Mehta",
    location: "Ahmedabad, India",
    rating: 4,
    comment:
      "Great option for a business trip. The room was clean, the Wi-Fi was fast and the work desk was very useful.",
    roomStayed: "Single Room",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex gap-1 text-brass text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 5,
    comment: "",
    roomStayed: "Single Room",
  });

  const [submitStatus, setSubmitStatus] = useState({
    state: "idle",
    message: "",
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getReviews();

      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Unable to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setSubmitStatus({
        state: "error",
        message: "Please enter your name.",
      });
      return;
    }

    if (!form.comment.trim()) {
      setSubmitStatus({
        state: "error",
        message: "Please write your review.",
      });
      return;
    }

    setSubmitStatus({
      state: "loading",
      message: "",
    });

    try {
      const data = await createReview({
        name: form.name.trim(),
        location: form.location.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
        roomStayed: form.roomStayed,
      });

      setSubmitStatus({
        state: "success",
        message: "Your review has been submitted successfully.",
      });

      setForm({
        name: "",
        location: "",
        rating: 5,
        comment: "",
        roomStayed: "Single Room",
      });

      if (data?.review) {
        setReviews((current) => [data.review, ...current]);
      } else {
        await loadReviews();
      }

      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus({
          state: "idle",
          message: "",
        });
      }, 1500);
    } catch (error) {
      console.error("Review submission error:", error);

      setSubmitStatus({
        state: "error",
        message:
          error?.response?.data?.message ||
          "Unable to submit your review right now.",
      });
    }
  };

  return (
    <section id="reviews" className="bg-ivory">
      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-brass text-xs uppercase tracking-[0.3em] mb-4">
              Guest Reviews
            </p>

            <h2 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
              What Our Guests Say
            </h2>

            <p className="mt-5 text-ink/60 leading-relaxed">
              Real experiences from guests who stayed at The Grand Haven.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm((current) => !current);
              setSubmitStatus({
                state: "idle",
                message: "",
              });
            }}
            className="bg-forest text-white px-6 py-3 rounded-sm font-medium hover:bg-forestlight transition"
          >
            {showForm ? "Close Review" : "✍ Write a Review"}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="bg-white border border-ink/10 rounded-xl p-7 md:p-9 mb-12 shadow-sm">
            <div className="max-w-2xl">
              <p className="text-brass text-xs uppercase tracking-[0.25em] mb-2">
                Share Your Experience
              </p>

              <h3 className="font-display text-3xl text-ink mb-7">
                Write a Review
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="review-name"
                      className="block text-sm text-ink/70 mb-2"
                    >
                      Your Name
                    </label>

                    <input
                      id="review-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="review-location"
                      className="block text-sm text-ink/70 mb-2"
                    >
                      Location
                    </label>

                    <input
                      id="review-location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Delhi, India"
                      className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className="text-sm text-ink/70 mb-2">
                    Your Rating
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            rating: star,
                          }))
                        }
                        className={`text-2xl transition ${
                          star <= form.rating
                            ? "text-brass"
                            : "text-stone"
                        }`}
                        aria-label={`${star} star`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room */}
                <div>
                  <label
                    htmlFor="review-room"
                    className="block text-sm text-ink/70 mb-2"
                  >
                    Room Stayed
                  </label>

                  <select
                    id="review-room"
                    name="roomStayed"
                    value={form.roomStayed}
                    onChange={handleChange}
                    className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-brass"
                  >
                    <option value="Single Room">
                      Single Room
                    </option>
                    <option value="Deluxe Room">
                      Deluxe Room
                    </option>
                    <option value="Couple Suite">
                      Couple Suite
                    </option>
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="review-comment"
                    className="block text-sm text-ink/70 mb-2"
                  >
                    Your Review
                  </label>

                  <textarea
                    id="review-comment"
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your stay..."
                    className="w-full border border-stone bg-white px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>

                {submitStatus.state === "success" && (
                  <p className="text-green-700 text-sm">
                    {submitStatus.message}
                  </p>
                )}

                {submitStatus.state === "error" && (
                  <p className="text-red-600 text-sm">
                    {submitStatus.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitStatus.state === "loading"}
                  className="bg-brass text-ink px-8 py-3 rounded-sm font-medium hover:bg-brasslight disabled:opacity-60 transition"
                >
                  {submitStatus.state === "loading"
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center text-ink/50 mb-8">
            Loading reviews...
          </p>
        )}

        {/* Review Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {reviews.map((review, index) => (
            <article
              key={review._id || `${review.name}-${index}`}
              className="bg-white border border-ink/10 rounded-xl p-7 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-forest text-brasslight flex items-center justify-center font-display font-semibold">
                  {getInitials(review.name)}
                </div>

                <div>
                  <h3 className="font-semibold text-ink">
                    {review.name}
                  </h3>

                  <p className="text-xs text-ink/50 mt-1">
                    {review.location || "Guest"}
                  </p>
                </div>
              </div>

              <Stars rating={review.rating} />

              <p className="text-ink/70 leading-relaxed mt-5">
                “{review.comment}”
              </p>

              {review.roomStayed && (
                <div className="mt-6 pt-4 border-t border-ink/10">
                  <p className="text-[11px] text-ink/40 uppercase tracking-[0.15em]">
                    Stayed in
                  </p>

                  <p className="text-sm text-forest font-medium mt-1">
                    {review.roomStayed}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Rating */}
        <div className="mt-14 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-brass text-lg">
              ★★★★★
            </span>

            <span className="text-ink font-semibold">
              4.7 / 5
            </span>
          </div>

          <p className="text-xs text-ink/45 mt-2">
            Based on guest experiences at The Grand Haven
          </p>
        </div>
      </div>
    </section>
  );
}