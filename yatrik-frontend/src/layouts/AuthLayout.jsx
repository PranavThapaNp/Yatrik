import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
      <Outlet />
    </div>
  );
}