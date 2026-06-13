import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        background: "#f5f7fa",
      }}
    >
      {/* LEFT SIDE (BRANDING) */}
      <div
        style={{
          flex: 6,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <h1 style={{ fontSize: "64px", marginBottom: "20px" }}>
            YATRIK
          </h1>

          <h2 style={{ fontSize: "42px", lineHeight: "1.2" }}>
            Start Your Journey Today
          </h2>

          <p style={{ marginTop: "20px", fontSize: "20px", maxWidth: "520px" }}>
            Join Yatrik and explore Nepal with AI-powered itineraries,
            smart recommendations, and personalized travel planning.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div
        style={{
          flex: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "white",
        }}
      >
        <div style={{ width: "420px" }}>
          <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
            Create Account
          </h1>

          <p style={{ color: "#6b7280", marginBottom: "30px" }}>
            Sign up to start exploring Nepal.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: "25px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0F766E",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "16px",
  background: "#0F766E",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "17px",
  fontWeight: "600",
};