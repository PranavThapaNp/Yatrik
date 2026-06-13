import { useState, useEffect } from "react";
import API from "../api/axios";
import "../styles/itinerary.css";

export default function Itinerary() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    destination_slug: "",
    days: 3,
    travel_style: "budget",
  });

  useEffect(() => {
    API.get("/destinations/")
      .then((res) => setDestinations(res.data))
      .catch(console.log);
  }, []);

  const generate = async () => {
    try {
      setLoading(true);

      const res = await API.post("/itinerary/generate", form);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="itinerary-page">

      {/* LEFT PANEL (FORM) */}
      <div className="itinerary-left">

        <h1>AI Itinerary Generator</h1>
        <p>Create your perfect Nepal travel plan in seconds</p>

        <div className="form-card">

          {/* DESTINATION */}
          <label>Destination</label>
          <select
            value={form.destination_slug}
            onChange={(e) =>
              setForm({ ...form, destination_slug: e.target.value })
            }
          >
            <option value="">Select Destination</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>

          {/* DAYS */}
          <label>Days</label>
          <input
            type="number"
            min={1}
            max={30}
            value={form.days}
            onChange={(e) =>
              setForm({ ...form, days: Number(e.target.value) })
            }
          />

          {/* STYLE */}
          <label>Travel Style</label>
          <select
            value={form.travel_style}
            onChange={(e) =>
              setForm({ ...form, travel_style: e.target.value })
            }
          >
            <option value="budget">Budget</option>
            <option value="relaxed">Relaxed</option>
            <option value="adventure">Adventure</option>
          </select>

          {/* BUTTON */}
          <button onClick={generate}>
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL (RESULTS) */}
      <div className="itinerary-right">

        {!result ? (
          <div className="empty-state">
            <h2>✨ Your itinerary will appear here</h2>
            <p>Select a destination and generate your plan</p>
          </div>
        ) : (
          <div className="result-card">

            <h2>{result.destination}</h2>

            <p className="meta">
              {result.travel_style} • {result.days} days
            </p>

            <div className="budget">
              <h3>Budget Estimate</h3>
              <p>
                {result.estimated_budget.currency}{" "}
                {result.estimated_budget.min_amount} -{" "}
                {result.estimated_budget.max_amount}
              </p>
            </div>

            {result.warning && (
              <div className="warning">
                ⚠ {result.warning}
              </div>
            )}

            <hr />

            {/* ITINERARY */}
            {result.itinerary.map((day) => (
              <div key={day.day} className="day-card">
                <h3>Day {day.day}: {day.title}</h3>

                {day.schedule.map((a, i) => (
                  <p key={i}>
                    <b>{a.time}</b> — {a.activity}
                  </p>
                ))}
              </div>
            ))}

            {/* TIPS */}
            <div className="tips">
              <h3>Travel Tips</h3>
              <ul>
                {result.travel_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}