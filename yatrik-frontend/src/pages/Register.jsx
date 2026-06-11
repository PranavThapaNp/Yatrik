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
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="username" onChange={handleChange} />
        <input name="email" placeholder="email" onChange={handleChange} />
        <input name="phone" placeholder="phone" onChange={handleChange} />
        <input name="password" placeholder="password" type="password" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>

      {/* 👇 ADD THIS */}
      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}