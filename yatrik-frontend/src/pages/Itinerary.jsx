import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Itinerary() {

  const [destinations, setDestinations] = useState([]);

  const [form, setForm] = useState({
    destination_slug: "",
    days: 3,
    travel_style: "budget"
  });

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  useEffect(() => {

    API.get("/destinations/")
      .then(res => setDestinations(res.data))
      .catch(console.log);

  }, []);

  const generate = async () => {

    try {

      setLoading(true);

      const res = await API.post(
        "/itinerary/generate",
        form
      );

      setResult(res.data);

    }

    catch (err) {

      alert(err.response?.data?.detail || "Generation failed");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div style={{ maxWidth: "900px", margin: "40px auto" }}>

      <h1>AI Itinerary Generator</h1>

      <br />

      <select
        value={form.destination_slug}
        onChange={(e) =>
          setForm({
            ...form,
            destination_slug: e.target.value
          })
        }
      >

        <option value="">Select Destination</option>

        {destinations.map((d) => (

          <option key={d.id} value={d.slug}>

            {d.name}

          </option>

        ))}

      </select>

      <br />
      <br />

      <input

        type="number"

        value={form.days}

        min={1}

        max={30}

        onChange={(e) =>
          setForm({
            ...form,
            days: Number(e.target.value)
          })
        }

      />

      <br />
      <br />

      <select

        value={form.travel_style}

        onChange={(e) =>
          setForm({
            ...form,
            travel_style: e.target.value
          })
        }

      >

        <option value="budget">Budget</option>

        <option value="relaxed">Relaxed</option>

        <option value="adventure">Adventure</option>

      </select>

      <br />
      <br />

      <button onClick={generate}>

        {loading ? "Generating..." : "Generate Itinerary"}

      </button>

      <hr />

      {result && (

        <>

          <h2>{result.destination}</h2>

          <p>

            {result.travel_style} | {result.days} days

          </p>

          <h3>

            Budget

          </h3>

          <p>

            {result.estimated_budget.currency}

            {" "}

            {result.estimated_budget.min_amount}

            -

            {result.estimated_budget.max_amount}

          </p>

          {result.warning && (

            <p>

              <b>

                {result.warning}

              </b>

            </p>

          )}

          <hr />

          {result.itinerary.map(day => (

            <div key={day.day}>

              <h3>

                Day {day.day}

              </h3>

              <h4>

                {day.title}

              </h4>

              {day.schedule.map((a, i) => (

                <p key={i}>

                  <b>

                    {a.time}

                  </b>

                  {" : "}

                  {a.activity}

                </p>

              ))}

              <br />

            </div>

          ))}

          <h3>

            Travel Tips

          </h3>

          <ul>

            {result.travel_tips.map((tip, i) => (

              <li key={i}>

                {tip}

              </li>

            ))}

          </ul>

        </>

      )}

    </div>

  );

}