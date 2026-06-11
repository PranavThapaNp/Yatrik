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
      alert("Login failed");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>

      {/* 👇 ADD THIS */}
      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}