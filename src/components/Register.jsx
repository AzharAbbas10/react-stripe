import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formDate, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_passsword: "",
  });

  const [errors, setErrors] = useState({});

  async function handleRegister(e) {
    console.log(formDate);
    e.preventDefault();

    if (formDate.password !== formDate.confirm_passsword) {
      setErrors({ confirm_passsword: ["Passwords do not match"] });
      return;
    }

    if (formDate.password.length < 8) {
      setErrors({ password: ["Password must be at least 8 characters long"] });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formDate.password)) {
      setErrors({
        password: [
          "Password must include uppercase, lowercase, number, and special character",
        ],
      });
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formDate),
    });
    const data = await res.json();

    if (data.code === 422) {
      // Validation errors
      setErrors(data.message);
    } else if (data.code === 404) {
      // General errors
      setErrors({ general: data.message });
    } else if (data.code === 200) {
      Cookies.set("access_token", data.token, {
        expires: 7, // token will stay for 7 days
        secure: true, // only sent over HTTPS
        sameSite: "Strict", // prevent CSRF
      });
      // Success → navigate to dashboard
      navigate("/dashboard");
    } else {
      console.error("Other error:", data);
      setErrors({ general: "Unexpected error, try again later." });
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
    setFormData({ ...formDate, [field]: value });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account ✨
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Fill in the details below to get started
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formDate.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formDate.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
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
              value={formDate.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={formDate.confirm_passsword}
              onChange={(e) =>
                handleChange("confirm_passsword", e.target.value)
              }
              placeholder="Re-enter your password"
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirm_passsword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_passsword[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Extra links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
