import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import logo from "../../../assets/images/logo.png";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import './Navbar1.css'
import profile from '../../../assets/icons/profile.png'

const Navbar1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const isActive = (path) => location.pathname === path;

  const isParentActive = (paths) => paths.some((path) => location.pathname === path);

  return (
    <nav className="navbar1">
     
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" />
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
      </button>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li className={isActive("/") ? "active" : ""} onClick={() => navigate("/")}>
          Home
        </li>

        <li
          className={isActive("/about-us") ? "active" : ""}
          onClick={() => navigate("/about-us")}
        >
          About
        </li>

        <li
          className={`dropdown ${
            openDropdown === "how" ? "open" : ""
          } ${isParentActive(["/how-it-works"]) ? "active" : ""}`}
          onClick={() => toggleDropdown("how")}
        >
          <div className="dropdown-header">
            How It Works <IoChevronDownOutline className="down-icon" />
          </div>
          <ul className="dropdown-menu">
            <li
              className={isActive("/how-it-works") ? "active" : ""}
              onClick={() => navigate("/how-it-works")}
            >
              Overview
            </li>
            <li onClick={() => navigate("/how-it-works#skills")}>Skills & Trades</li>
            <li onClick={() => navigate("/how-it-works#clients")}>
              Clients & Employers
            </li>
          </ul>
        </li>

        <li
          className={`dropdown ${
            openDropdown === "member" ? "open" : ""
          } ${isParentActive([
            "/login",
            "/member-advice-center",
            "/member-resource-login",
          ])
            ? "active"
            : ""}`}
          onClick={() => toggleDropdown("member")}
        >
          <div className="dropdown-header">
            Member Resources <IoChevronDownOutline className="down-icon" />
          </div>
          <ul className="dropdown-menu">
            <li
              className={isActive("/login") ? "active" : ""}
              onClick={() => navigate("/login")}
            >
              Sign Up
            </li>
            <li
              className={isActive("/member-advice-center") ? "active" : ""}
              onClick={() => navigate("/member-advice-center")}
            >
              Advice Center
            </li>
            <li
              className={isActive("/member-resource-login") ? "active" : ""}
              onClick={() => navigate("/member-resource-login")}
            >
              Login
            </li>
          </ul>
        </li>

        <li
          className={`dropdown ${
            openDropdown === "client" ? "open" : ""
          } ${isParentActive([
            "/client-advice-center",
            "/signup",
            "/leave-review",
            "/faqs-member",
            "/faqs-client",
          ])
            ? "active"
            : ""}`}
          onClick={() => toggleDropdown("client")}
        >
          <div className="dropdown-header">
            Client Resources <IoChevronDownOutline className="down-icon" />
          </div>
          <ul className="dropdown-menu">
            <li
              className={isActive("/client-advice-center") ? "active" : ""}
              onClick={() => navigate("/client-advice-center")}
            >
              Advice Center
            </li>
            <li
              className={isActive("/signup") ? "active" : ""}
              onClick={() => navigate("/signup")}
            >
              Sign Up For Reviews
            </li>
            <li
              className={isActive("/leave-review") ? "active" : ""}
              onClick={() => navigate("/leave-review")}
            >
              Leave A Review
            </li>
            <li
              className={isActive("/faqs-member") ? "active" : ""}
              onClick={() => navigate("/faqs-member")}
            >
              Member FAQs
            </li>
            <li
              className={isActive("/faqs-client") ? "active" : ""}
              onClick={() => navigate("/faqs-client")}
            >
              Client FAQs
            </li>
          </ul>
        </li>

        <li
          className={isActive("/job") ? "active" : ""}
          onClick={() => navigate("/job")}
        >
          Jobs
        </li>

        <li
          className={isActive("/faqs") ? "active" : ""}
          onClick={() => navigate("/faqs-client")}
        >
          FAQs
        </li>
      </ul>

      <div className="navbar-profile">
        <div className='profile-name'>
            <h2>John Anderson</h2>
            <h3>Client</h3>
        </div>
        <div className='profile-image'>
            <img src={profile}></img>
        </div>
      </div>
    </nav>
  );
}

export default Navbar1
