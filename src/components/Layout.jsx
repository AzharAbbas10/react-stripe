import { Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Layout() {
  const { clearToken, token, user } = useContext(AppContext);

  async function logout(e) {
    e.preventDefault();

    try {
      const res = await fetch("api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check HTTP status code, not JSON "code"
      if (res.status === 200) {
        clearToken();
      } else {
        console.error("Logout failed:", res.status);
        clearToken(); // still clear locally
      }
    } catch (error) {
      console.error("Logout request failed:", error);
      clearToken();
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="h-20 px-6 flex items-center justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
        <div className="text-2xl font-extrabold text-white tracking-wide">
          Hello <span className="text-yellow-300">World</span>
        </div>

        <div className="flex items-center space-x-4 text-white">
          <span className="font-medium">Hi, {user?.name || "Guest"}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <footer className="p-4 text-center">Footer</footer>
    </div>
  );
}
