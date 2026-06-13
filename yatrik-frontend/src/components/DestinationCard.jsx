import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function DestinationCard({
  destination,
  showWishlist = true,
  showRemove = false,
  onRemove = null,
}) {
  const [hover, setHover] = useState(false);
  const [saved, setSaved] = useState(false);

  const token = localStorage.getItem("token");

  // 🔍 Check saved status
  useEffect(() => {
    if (!token || !showWishlist) return;

    API.get("/saved/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const isSaved = res.data.some(
          (item) => item.id === destination.id
        );
        setSaved(isSaved);
      })
      .catch(console.log);
  }, [destination.id, token, showWishlist]);

  // ❤️ Toggle save / unsave
  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!showWishlist) return;

    try {
      if (!saved) {
        await API.post(
          `/saved/${destination.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await API.delete(`/saved/${destination.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setSaved(!saved);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        ...cardStyle,
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover
          ? "0 18px 40px rgba(0,0,0,0.18)"
          : "0 10px 25px rgba(0,0,0,0.10)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ❤️ or ❌ BUTTON AREA */}
      {showWishlist && (
        <button onClick={toggleSave} style={heartButton}>
          {saved ? "❤️" : "🤍"}
        </button>
      )}

      {showRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.(destination.id);
          }}
          style={removeButton}
        >
          ❌
        </button>
      )}

      {/* IMAGE */}
      <img
        src={`http://127.0.0.1:8000${destination.cover_image}`}
        alt={destination.name}
        style={{
          ...imageStyle,
          transform: hover ? "scale(1.08)" : "scale(1.02)",
        }}
      />

      {/* ALWAYS VISIBLE INFO */}
      <div style={bottomInfo}>
        <h3 style={titleSmall}>{destination.name}</h3>
        <p style={locationSmall}>📍 {destination.location}</p>
      </div>

      {/* HOVER OVERLAY */}
      <div
        style={{
          ...overlayStyle,
          opacity: hover ? 1 : 0,
        }}
      >
        <div
          style={{
            ...overlayContent,
            transform: hover ? "translateY(0)" : "translateY(18px)",
          }}
        >
          <p style={descStyle}>
            {destination.short_description?.slice(0, 95)}...
          </p>

          <Link
            to={`/destinations/${destination.slug}`}
            style={{ textDecoration: "none" }}
          >
            <button style={buttonStyle}>View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const cardStyle = {
  position: "relative",
  width: "100%",
  maxWidth: "320px",
  height: "420px",
  borderRadius: "18px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s ease",
};

/* ❤️ HEART BUTTON */
const heartButton = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 10,
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  background: "rgba(0,0,0,0.35)",
  color: "white",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/* BOTTOM INFO */
const bottomInfo = {
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: "14px",
  color: "white",
  background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
};

const titleSmall = {
  fontSize: "16px",
  fontWeight: "700",
  margin: 0,
};

const locationSmall = {
  fontSize: "12px",
  opacity: 0.85,
  margin: "4px 0 0 0",
};

/* OVERLAY */
const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.25))",
  display: "flex",
  alignItems: "flex-end",
  padding: "18px",
  transition: "opacity 0.35s ease",
  opacity: 0,
};

const overlayContent = {
  color: "white",
  transition: "transform 0.35s ease",
};

const descStyle = {
  fontSize: "13px",
  opacity: 0.9,
  marginBottom: "12px",
  lineHeight: "1.4",
};

const buttonStyle = {
  padding: "10px 14px",
  background: "#0F766E",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  width: "100%",
};

const removeButton = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 10,
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  background: "rgba(255,0,0,0.35)",
  color: "white",
  backdropFilter: "blur(6px)",
};