import React, { useState } from "react";
import { login, signup } from "../api";

export default function AuthModal({
  mode = "login",
  role = "guest",
  onClose,
  onSuccess,
}) {
  const [authMode, setAuthMode] = useState(mode);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({
    state: "idle",
    message: "",
  });

  const isSignup = authMode === "signup";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && form.password !== form.confirmPassword) {
      setStatus({
        state: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    if (form.password.length < 6) {
      setStatus({
        state: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    setStatus({
      state: "loading",
      message: "",
    });

    try {
      let data;

      if (isSignup) {
        data = await signup({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role,
        });
      } else {
        data = await login({
          email: form.email,
          password: form.password,
          role,
        });
      }

      setStatus({
        state: "success",
        message: isSignup
          ? "Account created successfully!"
          : "Login successful!",
      });

      setTimeout(() => {
        onSuccess?.(data);
        onClose?.();
      }, 500);
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-ivory rounded-lg shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-2xl text-ink/50 hover:text-ink"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <p className="text-brass text-sm uppercase tracking-[0.2em] mb-2">
            The Grand Haven
          </p>

          <h2 className="font-display text-3xl text-ink">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-sm text-ink/60 mt-2">
            {role === "owner" ? "Owner Account" : "Guest Account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm text-ink/70 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full border border-stone bg-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
                />
              </div>

              <div>
                <label className="block text-sm text-ink/70 mb-1">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 00000 00000"
                  className="w-full border border-stone bg-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-ink/70 mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-stone bg-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>

          <div>
            <label className="block text-sm text-ink/70 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full border border-stone bg-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm text-ink/70 mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full border border-stone bg-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass"
              />
            </div>
          )}

          {/* Status */}
          {status.state === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
              {status.message}
            </div>
          )}

          {status.state === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md">
              {status.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status.state === "loading"}
            className="w-full bg-forest hover:bg-forestlight disabled:opacity-60 text-ivory py-3 rounded-md font-medium transition-colors"
          >
            {status.state === "loading"
              ? "Please wait..."
              : isSignup
              ? `Create ${role === "owner" ? "Owner" : "Guest"} Account`
              : `Login as ${role === "owner" ? "Owner" : "Guest"}`}
          </button>
        </form>

        {/* Switch Login / Signup */}
        <div className="text-center mt-6 text-sm text-ink/60">
          {isSignup ? "Already have an account?" : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setAuthMode(isSignup ? "login" : "signup");
              setStatus({
                state: "idle",
                message: "",
              });
            }}
            className="ml-2 text-brass hover:text-brasslight font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </div>

        {/* Role Info */}
        <div className="mt-5 pt-5 border-t border-stone text-center">
          <p className="text-xs text-ink/50">
            You are signing in as{" "}
            <span className="font-semibold text-ink">
              {role === "owner" ? "Hotel Owner" : "Guest"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}