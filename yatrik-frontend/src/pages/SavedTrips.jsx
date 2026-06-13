import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import DestinationCard from "../components/DestinationCard";

export default function SavedTrips() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.get("/saved/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSaved(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ❌ REMOVE FROM SAVED
  const removeSaved = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/saved/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // instant UI update
      setSaved((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={page}>
      <h1 style={title}>Saved Trips ❤️</h1>
      <p style={subtitle}>Your wishlist destinations</p>

      {/* LOADING SKELETON */}
      {loading && (
        <div style={grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={skeletonCard} />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && saved.length === 0 && (
        <div style={empty}>
          <img
            src="https://illustrations.popsy.co/gray/map-travel.svg"
            alt="empty"
            style={{ width: "260px", marginBottom: "20px" }}
          />

          <h2>No Saved Trips Yet</h2>
          <p>Start exploring and save your favorite destinations ❤️</p>

          <Link to="/explore">
            <button style={btn}>Explore Destinations</button>
          </Link>
        </div>
      )}

      {/* GRID */}
      {!loading && saved.length > 0 && (
        <div style={grid}>
          {saved.map((item) => (
            <DestinationCard
              key={item.id}
              destination={item}
              showWishlist={false}
              showRemove={true}
              onRemove={removeSaved}
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

const title = {
  fontSize: "32px",
  fontWeight: "800",
};

const subtitle = {
  color: "gray",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
};

/* SKELETON */
const skeletonCard = {
  height: "320px",
  borderRadius: "16px",
  background: "linear-gradient(90deg,#eee,#f5f5f5,#eee)",
  backgroundSize: "200% 100%",
  animation: "pulse 1.5s infinite",
};

/* EMPTY */
const empty = {
  textAlign: "center",
  marginTop: "60px",
};

/* BUTTON */
const btn = {
  marginTop: "15px",
  padding: "10px 16px",
  background: "#0f766e",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};