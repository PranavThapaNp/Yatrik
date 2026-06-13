import { useEffect, useState } from "react";
import API from "../api/axios";
import DestinationCard from "../components/DestinationCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await API.get("/dashboard/");
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <h2 style={loadingStyle}>Loading dashboard...</h2>;

  if (!data) return <h2 style={loadingStyle}>No data found</h2>;

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h1>Welcome, {data.user.username} 👋</h1>
        <p>Your travel dashboard</p>
      </div>

      {/* STATS SECTION (future expansion ready) */}
      <div style={statsGrid}>
        <div style={statCard}>
          <h3>{data.saved_destinations.length}</h3>
          <p>Saved Trips</p>
        </div>

        <div style={statCard}>
          <h3>🇳🇵</h3>
          <p>Nepal Explorer</p>
        </div>

        <div style={statCard}>
          <h3>✨</h3>
          <p>AI Recommendations</p>
        </div>
      </div>

      {/* SAVED DESTINATIONS */}
      <h2 style={{ marginTop: "40px" }}>Your Saved Destinations ❤️</h2>

      {data.saved_destinations.length === 0 ? (
        <p style={{ color: "gray", marginTop: "10px" }}>
          You haven’t saved any destinations yet.
        </p>
      ) : (
        <div style={grid}>
          {data.saved_destinations.map((item) => (
            <DestinationCard
              key={item.id}
              destination={item}
              showWishlist={false}
              showRemove={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: "40px 120px",
  fontFamily: "Inter",
  background: "#f8fafc",
  minHeight: "100vh",
};

const header = {
  marginBottom: "20px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginTop: "20px",
};

const statCard = {
  background: "white",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "600",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
  marginTop: "20px",
};

const loadingStyle = {
  padding: "40px",
  textAlign: "center",
};