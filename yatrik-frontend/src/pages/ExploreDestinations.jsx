import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchDestinations } from "../api/homeApi";

export default function ExploreDestinations() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search + filter (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await searchDestinations(search, type);

        setResults(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, type]);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* HEADER */}
      <h1>Explore Destinations 🌍</h1>
      <p>Find treks, cities, wildlife & nature experiences in Nepal</p>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "12px" }}
        >
          <option value="">All</option>
          <option value="trek">Trek</option>
          <option value="city">City</option>
          <option value="nature">Nature</option>
          <option value="wildlife">Wildlife</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && <p>Loading destinations...</p>}

      {/* RESULTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {results.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {/* IMAGE */}
            {item.cover_image && (
              <img
                src={`http://127.0.0.1:8000${item.cover_image}`}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            )}

            {/* CONTENT */}
            <div style={{ padding: "15px" }}>
              <h3>{item.name}</h3>
              <p>{item.location}</p>
              <p style={{ fontSize: "14px", color: "#555" }}>
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
    </div>
  );
}