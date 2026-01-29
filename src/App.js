import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Layout & Pages
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import SewaAlat from "./pages/SewaAlat";
import DetailAlat from "./pages/DetailAlat";
import Riwayat from "./pages/Riwayat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Utama dengan Sidebar */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/category"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />

        <Route
          path="/detail/:id"
          element={
            <Layout>
              <DetailAlat />
            </Layout>
          }
        />

        <Route
          path="/sewa-alat"
          element={
            <Layout>
              <SewaAlat />
            </Layout>
          }
        />

        <Route
          path="/riwayat"
          element={
            <Layout>
              <Riwayat />
            </Layout>
          }
        />

        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
