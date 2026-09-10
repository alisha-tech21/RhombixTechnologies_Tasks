import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/me")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error("Failed to load bookings:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Welcome, {user?.name}</h1>
      <p>{user?.email}</p>

      <h2 style={{ marginTop: "32px" }}>My Bookings</h2>
      {loading && <p>Loading...</p>}
      {!loading && bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <p>
            <strong>Booking ref:</strong> {b.bookingRef}
          </p>
          <p>
            <strong>Property:</strong> {b.propertyId?.name || b.dealId?.title}
          </p>
          <p>
            <strong>Dates:</strong> {new Date(b.checkIn).toLocaleDateString()} —{" "}
            {new Date(b.checkOut).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {b.status}
          </p>
          <p>
            <strong>Total:</strong> ${b.priceSummary.total}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
