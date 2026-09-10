import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Explore from "./pages/Explore";
import PropertyDetails from "./pages/PropertyDetails";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import MyBookings from "./components/dashboard/MyBookings";
import ProfileSettings from "./components/dashboard/ProfileSettings";
import SavedStays from "./components/dashboard/SavedStays";
import AccountSettings from "./components/dashboard/AccountSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Booking flow: search → details → reserve → pay → confirmation */}
      <Route path="/explore" element={<Explore />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/destination/:id" element={<DestinationDetail />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmation"
        element={
          <ProtectedRoute>
            <Confirmation />
          </ProtectedRoute>
        }
      />

      {/* Dashboard is one protected parent route; DashboardLayout renders the
          sidebar + topbar once, and <Outlet /> inside it swaps the matching
          child page below — that's what the nested routes below do. */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="wishlist" element={<SavedStays />} />
        <Route path="settings" element={<AccountSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
