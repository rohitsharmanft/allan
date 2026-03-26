import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

import userIcon from "../../assets/icons/userIcon.png";
import infoIcon from "../../assets/icons/infoIcon.png";
import MemberIcon from "../../assets/icons/MemberIcon.png";
import reviewIcon from "../../assets/icons/reviewIcon.png";
import subscriptionIcon from "../../assets/icons/JobIcon.png";
import jobIcon from "../../assets/icons/subscriptionIcon.png";
import logoutIcon from "../../assets/icons/logout.png";
import { AppContext } from "../../contexts/AppContexts";
import { TfiMenuAlt } from "react-icons/tfi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Account Details", icon: userIcon, path: "/profile" },
    { name: "My Profile", icon: MemberIcon, path: "/member-profile" },
    { name: "Reviews", icon: reviewIcon, path: "/member-review" },
    { name: "Manage Subscription", icon: subscriptionIcon, path: "/manage-subscription", },
    { name: "My Jobs", icon: jobIcon, path: "/member-jobs" },
    { name: "My Projects", icon: jobIcon, path: "/member-projects" },
  ];

  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) {
      setActive(current.name);
      localStorage.setItem("memberActiveMenu", current.name);
    } else {
      const savedActive = localStorage.getItem("memberActiveMenu");
      if (savedActive) {
        setActive(savedActive);
      }
    }
  }, [location.pathname]);

  const handleClick = (path, name) => {
    setActive(name);
    localStorage.setItem("memberActiveMenu", name);
    setIsOpen(false);
    navigate(path);
  };
  const { setUser, setUserType } = useContext(AppContext);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("memberActiveMenu");
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
        </ul>

        <div
          className="logout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <img src={logoutIcon} alt="Logout" className="menu-img" />
          <span className="logout-text">Logout</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
