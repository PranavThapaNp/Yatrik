import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDestinationDetail } from "../api/destinationsApi"; // FIXED

export default function DestinationDetail() {
  const { slug } = useParams();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);

        const res = await getDestinationDetail(slug); // FIXED

        setDestination(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load destination");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;
  if (error) return <h2 style={{ padding: 20 }}>{error}</h2>;
  if (!destination) return <h2 style={{ padding: 20 }}>Not found</h2>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Link to="/explore">
        <button>⬅ Back</button>
      </Link>

      <h1>{destination.name}</h1>

      <p style={{ color: "gray" }}>
        {destination.location} • {destination.destination_type}
      </p>

      <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
        {destination.images?.map((img) => (
          <img
            key={img.id}
            src={`http://127.0.0.1:8000${img.image_url}`}
            alt={destination.name}
            style={{ width: "300px", height: "200px", objectFit: "cover" }}
          />
        ))}
      </div>

      <h2>About</h2>
      <p>{destination.full_description}</p>
    </div>
  );
}