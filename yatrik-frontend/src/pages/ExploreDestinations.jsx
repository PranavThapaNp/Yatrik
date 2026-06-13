import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchDestinations } from "../api/homeApi";
import DestinationCard from "../components/DestinationCard";
import "../styles/explore.css";

export default function ExploreDestinations() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch data (search + filter backend driven)
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
    }, 350);

    return () => clearTimeout(timer);
  }, [search, type]);

  return (
    <div className="explore-page">

      {/* HEADER */}
      <div className="explore-header">
        <h1>Explore Destinations 🌍</h1>
        <p>
          Discover treks, cities, wildlife & nature experiences across Nepal
        </p>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="explore-bar">

        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="trek">🏔 Trek</option>
          <option value="city">🏙 City</option>
          <option value="nature">🌿 Nature</option>
          <option value="wildlife">🦁 Wildlife</option>
        </select>

      </div>

      {/* LOADING */}
      {loading && <p className="loading">Loading destinations...</p>}

      {/* GRID (NOW USING YOUR CARD) */}
      <div className="explore-grid">
        {results.map((item) => (
          <DestinationCard key={item.id} destination={item} />
        ))}
      </div>

    </div>
  );
}