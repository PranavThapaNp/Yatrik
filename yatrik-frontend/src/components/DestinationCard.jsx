import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <img
        src={`http://127.0.0.1:8000${destination.cover_image}`}
        alt={destination.name}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "15px" }}>
        <h3>{destination.name}</h3>

        <p>{destination.location}</p>

        <p>{destination.short_description}</p>

        <Link to={`/destinations/${destination.slug}`}>
          <button>View Details</button>
        </Link>
      </div>
    </div>
  );
}