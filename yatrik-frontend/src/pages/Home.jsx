import { useEffect, useState } from "react";
import { searchDestinations, getPopularDestinations } from "../api/homeApi";
import { Link } from "react-router-dom";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);

  // Load popular treks once
  useEffect(() => {
    getPopularDestinations()
      .then((res) => setPopular(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Debounced search
  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchDestinations(search);
        setResults(res.data);
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div style={{ padding: "20px" }}>
      {/* HERO SECTION */}
      <section style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1>Explore Nepal with Yatrik 🌄</h1>
        <p>
          Discover breathtaking treks, vibrant cities, wildlife adventures and
          unforgettable experiences across Nepal.
        </p>
      </section>

      {/* SEARCH SECTION */}
      <section
        style={{
          marginBottom: "50px",
          maxWidth: "600px",
          marginInline: "auto",
          position: "relative",
        }}
      >
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
          }}
        />

        {/* Search Results */}
        {results.length > 0 && (
          <div
            style={{
              border: "1px solid #ddd",
              marginTop: "5px",
              background: "#fff",
              textAlign: "left",
            }}
          >
            {results.map((item) => (
              <Link
                key={item.id}
                to={`/destinations/${item.slug}`}
                style={{
                  display: "block",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <strong>{item.name}</strong>
                <br />
                <small>{item.location}</small>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* POPULAR TREKS */}
      <section style={{ marginBottom: "50px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>🔥 Popular Treks</h2>

          <Link to="/destinations">
            <button>View All</button>
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {popular.slice(0, 4).map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                width: "250px",
              }}
            >
              {item.cover_image && (
                <img
                  src={`http://127.0.0.1:8000${item.cover_image}`}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              )}

              <h3>{item.name}</h3>

              <p>{item.short_description}</p>

              <Link to={`/destinations/${item.slug}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE YATRIK */}
      <section style={{ marginBottom: "50px" }}>
        <h2>Why Choose Yatrik?</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3>🤖 AI Itineraries</h3>
            <p>Generate personalized travel plans in seconds.</p>
          </div>

          <div>
            <h3>🧠 Smart Recommendations</h3>
            <p>Machine learning suggests destinations you'll love.</p>
          </div>

          <div>
            <h3>❤️ Save Trips</h3>
            <p>Bookmark your favorite destinations for later.</p>
          </div>

          <div>
            <h3>🇳🇵 Nepal Focused</h3>
            <p>Built specifically for exploring Nepal's beauty.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: "20px",
          textAlign: "center",
        }}
      >
        <h3>Yatrik</h3>

        <p>Explore Nepal Smarter.</p>

        <p>© 2026 Yatrik. All rights reserved.</p>
      </footer>
    </div>
  );
}