import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDestinationDetail } from "../api/destinationsApi";

export default function DestinationDetail() {
  const { slug } = useParams();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await getDestinationDetail(slug);

        if (!ignore) {
          setDestination(res.data);
          setIndex(0); // reset image index on change
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;
  if (!destination) return <h2 style={{ padding: 20 }}>Not found</h2>;

  // normalize images
  const images =
    destination?.images?.map((img) =>
      typeof img === "string" ? img : img.image_url
    ) || [];

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={page}>
      {/* BACK */}
      <Link to="/explore">
        <button style={backBtn}>← Back</button>
      </Link>

      {/* TITLE */}
      <h1 style={title}>{destination.name}</h1>

      <p style={meta}>
        📍 {destination.location} • {destination.destination_type}
      </p>

      {/* LAYOUT */}
      <div style={layout}>
        {/* IMAGE SECTION */}
        <div style={imageBox}>
          <img
            src={`http://127.0.0.1:8000${images[index]}`}
            alt={destination.name}
            style={image}
          />

          {/* CONTROLS */}
          <div style={controls}>
            <button onClick={prevImage} style={btn}>
              ← Prev
            </button>

            <span style={counter}>
              {index + 1} / {images.length}
            </span>

            <button onClick={nextImage} style={btn}>
              Next →
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={content}>
          <h2>About</h2>
          <p>{destination.full_description}</p>

          <div style={grid}>
            <div>
              <b>Best Time</b>
              <p>{destination.best_time_to_visit}</p>
            </div>
            <div>
              <b>Weather</b>
              <p>{destination.weather}</p>
            </div>
            <div>
              <b>Altitude</b>
              <p>{destination.altitude}</p>
            </div>
            <div>
              <b>Recommended</b>
              <p>{destination.recommended_days} days</p>
            </div>
          </div>

          <h3>Highlights</h3>
          <ul>
            {destination.highlights?.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          <h3>Activities</h3>
          <ul>
            {destination.activities?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "20px",
  fontFamily: "Inter",
};

const backBtn = {
  padding: "8px 12px",
  border: "none",
  background: "#eee",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "10px",
};

const title = {
  fontSize: "36px",
  fontWeight: "800",
};

const meta = {
  color: "gray",
  marginBottom: "20px",
};

const layout = {
  display: "flex",
  gap: "30px",
};

const imageBox = {
  flex: 1,
  position: "relative",
};

const image = {
  width: "100%",
  height: "680px",
  objectFit: "cover",
  borderRadius: "16px",
};

const controls = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
};

const btn = {
  padding: "8px 12px",
  border: "none",
  background: "#0f766e",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
};

const counter = {
  fontWeight: "600",
};

const content = {
  flex: 1.2,
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  marginTop: "10px",
};