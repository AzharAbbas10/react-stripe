import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(Cookies.get("access_token") || null);

  const [user, setUser] = useState({});

  useEffect(() => {
  if (token) {
    const getUser = async () => {
      const res = await fetch("api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUser(data);
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
  };

  return (
    <AppContext.Provider value={{ token, saveToken, clearToken, user }}>
      {children}
    </AppContext.Provider>
  );
}
