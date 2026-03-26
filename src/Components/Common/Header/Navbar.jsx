import React, { useContext, useState, useMemo, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../../assets/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import GradientButton from "../GradientButton";
import { AppContext } from "../../../contexts/AppContexts";
import Avatar from "../../../assets/images/user.png"
// Base menu structure
const BaseMenu = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about-us" },

  {
    label: "How It Works",
    key: "how",
    paths: ["/how-it-works"],
    children: [
      { label: "Overview", path: "/how-it-works" },
      { label: "Skills & Trades", path: "/how-it-works#skills", hash: true },
      { label: "Clients & Employers", path: "/how-it-works#clients", hash: true },
    ],
  },

  {
    label: "Member Resources",
    key: "member",
    paths: ["/login", "/member-advice-center", "/signUp-member"],
    children: [
      { label: "Sign Up", path: "/signUp-member" },
      { label: "Advice Center", path: "/member-advice-center" },
      { label: "Login", path: "/login" },
    ],
  },

  {
    label: "Client Resources",
    key: "client",
    paths: [
      "/client-advice-center",
      "/signup",
      "/leave-review",
    ],
    children: [
      { label: "Advice Center", path: "/client-advice-center" },
      { label: "Sign Up For Reviews", path: "/signup" },
      { label: "Login For A Review", path: "/login" },
    ],
  },

  { label: "Jobs", path: "/job" },
  { label: "Projects", path: "/project" },
  { label: "FAQs", path: "/faqs-client" },
];

export default function Navbar() {
  const { user, userType } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const isProfile = user?.isProfile;
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => setOpenDropdown((prev) => (prev === name ? null : name));

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some((p) => location.pathname === p);

  // Dynamically filter menu based on userType
  const Menu = useMemo(() => {
    return BaseMenu.map((item) => {
      if (item.key === "member" && userType === "member") {
        // Hide Sign Up and Login for logged-in members
        return {
          ...item,
          children: item.children.filter(
            (child) => !["Sign Up", "Login"].includes(child.label)
          ),
        };
      }

      if (item.key === "client" && userType === "client") {
        // Hide Sign Up For Reviews and Login For A Review for logged-in clients
        return {
          ...item,
          children: item.children.filter(
            (child) => !["Sign Up For Reviews", "Login For A Review"].includes(child.label)
          ),
        };
      }

      return item;
    }).filter((item) => {
      // Optional: hide entire dropdown if no children left
      return !item.children || item.children.length > 0;
    });
  }, [userType]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-logo" onClick={() => {
        navigate("/");
        setMenuOpen(false);
        setOpenDropdown(null);
      }}>
        <img src={logo} alt="Logo" />
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)}>
        {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
      </button>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {Menu.map((item) => {
          if (!item.children) {
            return (
              <li
                key={item.label}
                className={isActive(item.path) ? "active" : ""}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                  setOpenDropdown(null);
                }}
              >
                {item.label}
              </li>
            );
          }

          return (
            <li
              key={item.key}
              onClick={() => toggleDropdown(item.key)}
              className={`dropdown 
                ${openDropdown === item.key ? "open" : ""}
                ${isParentActive(item.paths) ? "active" : ""}`}
            >
              <div className="dropdown-header">
                {item.label} <IoChevronDownOutline className="down-icon" />
              </div>

              <ul className="dropdown-menu">
                {item.children.map((child) => (
                  <li
                    key={child.label}
                    className={isActive(child.path) ? "active" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(child.path + (child.hash ? child.path.split("#")[1] : ""));
                      setMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    {child.label}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      {userType ? (
        <div
          className="navbar-profile"
          onClick={() => {
            setMenuOpen(false);
            setOpenDropdown(null);
            userType === "member"
              ? isProfile
                ? navigate("/profile")
                : navigate("/create-another-profile")
              : navigate("/client-profile");
          }}
        >
          <div className="profile-name">
            <h3>{user?.fullName || userType.charAt(0).toUpperCase() + userType.slice(1)}</h3>
          </div>
          <div className="profile-image">
            <img src={user?.image || Avatar} alt="Profile" />
          </div>
        </div>
      ) : (
        <div className="navbar-login">
          <GradientButton className="nb" text="Login" onClick={() => {
            navigate("/login");
            setMenuOpen(false);
            setOpenDropdown(null);
          }} />
        </div>
      )}
    </nav>
  );
}   