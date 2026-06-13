export default function DestinationFilter({
  destinationType,
  setDestinationType,
}) {
  const filters = [
    { label: "🏔 Treks", value: "trek" },
    { label: "🏙 Cities", value: "city" },
    { label: "🌿 Nature", value: "nature" },
    { label: "🦁 Wildlife", value: "wildlife" },
  ];

  return (
    <div style={containerStyle}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setDestinationType(filter.value)}
          style={{
            ...buttonStyle,
            background:
              destinationType === filter.value ? "#0F766E" : "#fff",
            color:
              destinationType === filter.value ? "#fff" : "#111827",
            border:
              destinationType === filter.value
                ? "1px solid #0F766E"
                : "1px solid #e5e7eb",
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const containerStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.2s ease",
  outline: "none",
};