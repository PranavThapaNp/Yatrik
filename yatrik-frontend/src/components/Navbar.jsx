import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navStyle}>
      {/* LEFT: BRAND */}
      <div style={leftStyle}>
        <Link to="/" style={brandStyle}>
          YATRIK
        </Link>

        <div style={linksStyle}>
          <Link style={link(isActive("/"))} to="/">
            Home
          </Link>

          <Link style={link(isActive("/itinerary"))} to="/itinerary">
            Itinerary
          </Link>

          <Link
            style={link(isActive("/destinations"))}
            to="/destinations"
          >
            Explore
          </Link>

          <Link style={link(isActive("/saved"))} to="/saved">
            Saved
          </Link>

          <Link style={link(isActive("/dashboard"))} to="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>

      {/* RIGHT: AUTH */}
      <div style={rightStyle}>
        {!token ? (
          <>
            <Link style={loginBtn} to="/login">
              Login
            </Link>

            <Link style={signupBtn} to="/register">
              Sign Up
            </Link>
          </>
        ) : (
          <button style={logoutBtn} onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

/* ---------------- STYLES ---------------- */

const navStyle = {
  height: "70px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 40px",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const leftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "40px",
};

const brandStyle = {
  fontSize: "20px",
  fontWeight: "800",
  color: "#0F766E",
  textDecoration: "none",
  letterSpacing: "1px",
};

const linksStyle = {
  display: "flex",
  gap: "25px",
};

const link = (active) => ({
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "500",
  color: active ? "#0F766E" : "#374151",
  borderBottom: active ? "2px solid #0F766E" : "2px solid transparent",
  paddingBottom: "4px",
});

const rightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const loginBtn = {
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  color: "#0F766E",
  padding: "8px 14px",
};

const signupBtn = {
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  background: "#0F766E",
  color: "white",
  padding: "8px 14px",
  borderRadius: "8px",
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};