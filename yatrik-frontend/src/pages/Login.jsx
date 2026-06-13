
import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
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
      {/* LEFT SIDE */}

      <div
        style={{
          flex: 6,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600')",
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
            background: "rgba(0,0,0,0.45)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              marginBottom: "20px",
              fontWeight: "700",
            }}
          >
            YATRIK
          </h1>

          <h2
            style={{
              fontSize: "42px",
              maxWidth: "600px",
              lineHeight: "1.2",
            }}
          >
            Explore Nepal Smarter.
          </h2>

          <p
            style={{
              marginTop: "25px",
              fontSize: "20px",
              maxWidth: "520px",
              opacity: 0.95,
            }}
          >
            AI-powered itinerary generation, destination recommendations,
            and unforgettable adventures across Nepal.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div
        style={{
          flex: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "white",
        }}
      >
        <div
          style={{
            width: "420px",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "40px",
              fontSize: "17px",
            }}
          >
            Login to continue your journey.
          </p>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            <div>
              <label
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                padding: "16px",
                background: "#0F766E",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              Sign In
            </button>
          </form>

          <p
            style={{
              marginTop: "30px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#0F766E",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

