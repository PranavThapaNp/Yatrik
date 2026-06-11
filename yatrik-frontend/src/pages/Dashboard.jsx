import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>Welcome {data.user.username}</h1>

      <h2>Saved Destinations</h2>
      {data.saved_destinations.map((d) => (
        <p key={d.id}>{d.name}</p>
      ))}
    </div>
  );
}