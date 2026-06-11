export default function DestinationFilter({
  destinationType,
  setDestinationType,
}) {
  return (
    <select
      value={destinationType}
      onChange={(e) => setDestinationType(e.target.value)}
      style={{
        padding: "10px",
        width: "200px",
      }}
    >
      <option value="">All</option>
      <option value="trek">Treks</option>
      <option value="city">Cities</option>
      <option value="nature">Nature</option>
      <option value="wildlife">Wildlife</option>
    </select>
  );
}