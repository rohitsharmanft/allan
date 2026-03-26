import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userIcon from "../../../assets/icons/userIcon.png";
import infoIcon from "../../../assets/icons/infoIcon.png";
import QuoteIcon from "../../../assets/icons/QuoteIcon.png";
import reviewIcon from "../../../assets/icons/reviewIcon.png";
import JobIcon from "../../../assets/icons/JobIcon.png";
import logoutIcon from "../../../assets/icons/logout.png";
import "./ClientSideBar.css";
import { AppContext } from "../../../contexts/AppContexts";
import { TfiMenuAlt } from "react-icons/tfi";

const ClientSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Account Details", icon: userIcon, path: "/client-profile" },
    {
      name: "Personal Information",
      icon: infoIcon,
      path: "/client-information",
    },
    { name: "Member Quote", icon: QuoteIcon, path: "/client-job-listing" },
    { name: "Reviews", icon: reviewIcon, path: "/client-reviews" },
    { name: "Jobs", icon: JobIcon, path: "/client-Job" },
    { name: "Projects", icon: JobIcon, path: "/client-Project" },
    {
      name: "Assigned Jobs or Projects",
      icon: QuoteIcon,
      path: "/assigned-job-listing",
    },
  ];

  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) {
      setActive(current.name);
      localStorage.setItem("activeMenu", current.name);
    } else {
      const savedActive = localStorage.getItem("activeMenu");
      if (savedActive) {
        setActive(savedActive);
      }
    }
  }, [location.pathname]);

  const handleClick = (path, name) => {
    setActive(name);
    localStorage.setItem("activeMenu", name);
    navigate(path);
    setIsOpen(false);
  };

  const { setUser, setUserType } = useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("activeMenu");
    setUserType("");
    setUser("");
    navigate("/login");
  };

  return (
    <>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <TfiMenuAlt />
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={active === item.name ? "active" : ""}
              onClick={() => handleClick(item.path, item.name)}
            >
              <img src={item.icon} alt={item.name} className="menu-img" />
              <span>{item.name}</span>
            </li>
          ))}
          <li
            className="logout"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <img src={logoutIcon} alt="Logout" className="menu-img" />
            <span className="logout-text">Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ClientSideBar;
