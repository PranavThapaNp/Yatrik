import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", display: "flex", gap: "10px" }}>
      <Link to="/">Home</Link>
      <Link to="/itinerary">Itinerary</Link>
      <Link to="/destinations">Explore Destinations</Link>
      <Link to="/saved">Saved Trips</Link>
      <Link to="/dashboard">Dashboard</Link>


      {!token ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}