import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

function App() {
  const { user } = useContext(AppContext);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user?.name ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user?.name ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user?.name ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Private Dashboard with Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
