import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Login() {
  const { saveToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ fixed
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.code === 422) {
        // Validation errors
        setErrors(data.message);
      } else if (data.code === 404) {
        // General errors
        setErrors({ general: data.message });
      } else if (data.code === 200) {
        saveToken(data.token);
        navigate("/dashboard");
      } else {
        console.error("Other error:", data);
        setErrors({ general: "Unexpected error, try again later." });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setErrors({ general: "Network error, please try again." });
    }
  }

  useEffect(() => {
    if (errors.general) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [errors]);

  function handleChange(field, value) {
    setFormData({ ...formData, [field]: value });

    // Clear field-specific error when user types again
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Please login to continue
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* General errors */}
          {errors.general && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
