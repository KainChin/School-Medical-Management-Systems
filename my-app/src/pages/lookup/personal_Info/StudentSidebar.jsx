import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoImg from "../../../image/hinhanh/logoproject.png";

export default function StudentSidebar({ tabRoutes }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand-box">
        <img src={LogoImg} alt="Logo" className="brand-icon" />
        <div className="brand-text">
          <h1>SchoMed</h1>
          <p>School Medical</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {Object.entries(tabRoutes).map(([path, label]) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={location.pathname === path ? "active" : ""}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
