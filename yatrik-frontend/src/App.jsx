import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Itinerary from "./pages/Itinerary";
import ExploreDestinations from "./pages/ExploreDestinations";
import DestinationDetail from "./pages/DestinationDetail";
import SavedTrips from "./pages/SavedTrips";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN APP (WITH NAVBAR) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/destinations" element={<ExploreDestinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedTrips />
              </ProtectedRoute>
            }
          />
          

          {/* PROTECTED ROUTES INSIDE MAIN LAYOUT */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* AUTH PAGES (NO NAVBAR) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;