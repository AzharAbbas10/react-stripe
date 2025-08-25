import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(Cookies.get("access_token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await fetch("api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.code === 200) {
            const data = await res.json();
            setUser(data);
          } else if (res.code === 401) {
            clearToken();
            setUser(null);
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
          setUser(null);
        }
      };

      getUser();
    }
  }, [token]);

  const saveToken = (newToken) => {
    Cookies.set("access_token", newToken, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    setToken(newToken);
  };

  const clearToken = () => {
    Cookies.remove("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ token, saveToken, clearToken, user }}>
      {children}
    </AppContext.Provider>
  );
}
