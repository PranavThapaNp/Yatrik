import { useEffect, useState } from "react";
import {
  searchDestinations,
  getPopularDestinations,
} from "../api/homeApi";
import { Link } from "react-router-dom";
import DestinationCard from "../components/DestinationCard";
import DestinationFilter from "../components/DestinationFilter";
import "../styles/home.css";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [destinationType, setDestinationType] = useState("trek"); // default category

  // Load default category (trek) on first render
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await searchDestinations("", destinationType);
        setPopular(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchInitial();
  }, []);

  // CATEGORY FILTER (backend-driven)
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const res = await searchDestinations("", destinationType);
        setPopular(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFiltered();
  }, [destinationType]);

  // SEARCH (debounced backend search)
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
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Explore Nepal with Yatrik 🌄</h1>
          <p>
            Discover treks, cities, wildlife & unforgettable journeys.
          </p>

          {/* SEARCH */}
          <div className="search-wrapper">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
            />

            {results.length > 0 && (
              <div className="search-dropdown">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    to={`/destinations/${item.slug}`}
                    className="search-item"
                  >
                    <strong>{item.name}</strong>
                    <span>{item.location}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FILTER (NO "ALL" OPTION) */}
      <section className="filter-section">
        <h2>Explore Categories</h2>

        <DestinationFilter
          destinationType={destinationType}
          setDestinationType={setDestinationType}
        />
      </section>

      {/* DESTINATIONS */}
      <section className="popular-section">
        <div className="section-header">
          <h2>🔥 Destinations</h2>

          <Link to="/destinations" className="view-all">
            View All →
          </Link>
        </div>

        <div className="card-grid">
          {popular.slice(0, 4).map((item) => (
            <DestinationCard key={item.id} destination={item} />
          ))}
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="why-section">
        <h2>Why Choose Yatrik?</h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>🤖 AI Itineraries</h3>
            <p>Generate fully personalized travel plans in seconds based on your style and budget.</p>
          </div>

          <div className="why-card">
            <h3>🧠 Smart Recommendations</h3>
            <p>Discover destinations ranked using intelligent preference-based suggestions.</p>
          </div>

          <div className="why-card">
            <h3>❤️ Save Trips</h3>
            <p>Bookmark your favorite places and build your dream travel list easily.</p>
          </div>

          <div className="why-card">
            <h3>🇳🇵 Nepal Focused</h3>
            <p>Built specifically to explore Nepal’s mountains, cities, and hidden gems.</p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="about-section">
        <h2>About Yatrik</h2>
        <p>
          Yatrik is a Nepal-focused travel platform designed to help travelers
          discover the beauty of Nepal through smart recommendations, curated
          destinations, and AI-powered itineraries.
          <br /><br />
          Whether you're planning treks in the Himalayas, exploring vibrant cities,
          or searching for hidden natural gems, Yatrik makes travel planning simple,
          intelligent, and personalized.
        </p>
      </section>  

      {/* FOOTER */}
      <footer className="footer">
        <h3>Yatrik</h3>
        <p>Explore Nepal Smarter.</p>
      </footer>
    </div>
  );
}