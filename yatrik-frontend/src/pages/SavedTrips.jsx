import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function SavedTrips() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await API.get("/saved/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Saved Trips:", res.data);
        setSaved(res.data);
      } catch (err) {
        console.log("Error loading saved trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading saved trips...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Saved Trips ❤️</h1>

      {saved.length === 0 ? (
        <p>No saved trips yet. Start exploring destinations!</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {saved.map((item) => (
            <div
              key={item.id}
              style={{
                width: "250px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* IMAGE */}
              {item.cover_image && (
                <img
                  src={`http://127.0.0.1:8000${item.cover_image}`}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* CONTENT */}
              <div style={{ padding: "10px" }}>
                <h3>{item.name}</h3>
                <p style={{ fontSize: "14px", color: "gray" }}>
                  {item.location}
                </p>
                <p style={{ fontSize: "13px" }}>
                  {item.short_description}
                </p>

                <Link to={`/destinations/${item.slug}`}>
                  <button style={{ marginTop: "10px" }}>
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}