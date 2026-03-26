import React, { useState } from "react";
import "./ClientNavBar.css";
import logo from "../../../assets/images/logo.png";
import profile from '../../../assets/icons/profile.png'
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import GradientButton from "../../../Components/Common/GradientButton";
import { useContext } from "react";
import { AppContext } from "../../../contexts/AppContexts";
import LoadingCard from "../../../Components/Common/LoadingCard/LoadingCard";
import TopBar from "../../../Components/Common/Header/TopBar";
import Avatar from "../../../assets/images/user.png"

export default function ClientNavBar() {
  const { user, loadingProfile ,userType} = useContext(AppContext);
  console.log('ssssss', loadingProfile)

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some((path) => location.pathname === path);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setOpenDropdown(null);
  };
  if (loadingProfile) return (<><LoadingCard /></>)
  return (
    <>
     <div className="container__">
      
    <nav className="client-navbar">
      <div className="client-navbar-logo" onClick={() => handleNavigate("/")}>
        <img src={logo} alt="Logo" />
      </div>

      <button className="client-menu-toggle" onClick={() => setMenuOpen((p) => !p)}>
        {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
      </button>

      <ul className={`client-navbar-links ${menuOpen ? "client-active" : ""}`}>
        <li
          className={isActive("/") ? "client-active" : ""}
          onClick={() => handleNavigate("/")}
        >
          Home
        </li>

        <li
          className={isActive("/about-us") ? "client-active" : ""}
          onClick={() => handleNavigate("/about-us")}
        >
          About
        </li>

        {/* HOW IT WORKS */}
        <li
          className={`client-dropdown ${openDropdown === "how" ? "client-open" : ""
            } ${isParentActive(["/how-it-works"]) ? "client-active" : ""}`}
          onClick={() => toggleDropdown("how")}
        >
          <div className="client-dropdown-header">
            How It Works <IoChevronDownOutline className="client-down-icon" />
          </div>
          <ul className="client-dropdown-menu">
            <li
              className={isActive("/how-it-works") ? "client-active" : ""}
              onClick={() => handleNavigate("/how-it-works")}
            >
              Overview
            </li>
            <li onClick={() => handleNavigate("/how-it-works#skills")}>Skills & Trades</li>
            <li onClick={() => handleNavigate("/how-it-works#clients")}>Clients & Employers</li>
          </ul>
        </li>

        {/* MEMBER RESOURCES */}
        <li
          className={`client-dropdown ${openDropdown === "member" ? "client-open" : ""
            } ${isParentActive([
              "/login",
              "/member-advice-center",
              "/member-resource-login",
            ])
              ? "client-active"
              : ""}`}
          onClick={() => toggleDropdown("member")}
        >
          <div className="client-dropdown-header">
            Member Resources <IoChevronDownOutline className="client-down-icon" />
          </div>
          <ul className="client-dropdown-menu">
            <li
              className={isActive("/login") ? "client-active" : ""}
              onClick={() => handleNavigate("/login")}
            >
              Sign Up
            </li>
            <li
              className={isActive("/member-advice-center") ? "client-active" : ""}
              onClick={() => handleNavigate("/member-advice-center")}
            >
              Advice Center
            </li>
            <li
              className={isActive("/member-resource-login") ? "client-active" : ""}
              onClick={() => handleNavigate("/member-resource-login")}
            >
              Login
            </li>
          </ul>
        </li>

        {/* CLIENT RESOURCES */}
        <li
          className={`client-dropdown ${openDropdown === "client" ? "client-open" : ""
            } ${isParentActive([
              "/client-advice-center",
              "/signup",
              "/leave-review",
              "/faqs-member",
              "/faqs-client",
            ])
              ? "client-active"
              : ""}`}
          onClick={() => toggleDropdown("client")}
        >
          <div className="client-dropdown-header">
            Client Resources <IoChevronDownOutline className="client-down-icon" />
          </div>
          <ul className="client-dropdown-menu">
            <li
              className={isActive("/client-advice-center") ? "client-active" : ""}
              onClick={() => handleNavigate("/client-advice-center")}
            >
              Advice Center
            </li>
            <li
              className={isActive("/signup") ? "client-active" : ""}
              onClick={() => handleNavigate("/signup")}
            >
              Sign Up For Reviews
            </li>
            <li
              className={isActive("/leave-review") ? "client-active" : ""}
              onClick={() => handleNavigate("/leave-review")}
            >
              Leave A Review
            </li>
            <li
              className={isActive("/faqs-member") ? "client-active" : ""}
              onClick={() => handleNavigate("/faqs-member")}
            >
              Member FAQs
            </li>
            <li
              className={isActive("/faqs-client") ? "client-active" : ""}
              onClick={() => handleNavigate("/faqs-client")}
            >
              Client FAQs
            </li>
          </ul>
        </li>

        <li
          className={isActive("/job") ? "client-active" : ""}
          onClick={() => handleNavigate("/job")}
        >
          Jobs
        </li>

        <li
          className={isActive("/faqs") ? "client-active" : ""}
          onClick={() => handleNavigate("/faqs-client")}
        >
          FAQs
        </li>
      </ul>

      {userType ?
        <div className="navbar-profile" onClick={() => { userType === "member" ? navigate('/profile') : navigate('/client-profile') }}>
          <div className='profile-name'>
            <h3>{userType}</h3>
          </div>
          <div className='profile-image'>
            <img src={user?.image||Avatar}></img>
          </div>
        </div>
        :
        <div className="navbar-login">
          <GradientButton text="Login" onClick={() => navigate("/login")} />
        </div>

      }
    </nav>
    </div>
    </>
  );
}
