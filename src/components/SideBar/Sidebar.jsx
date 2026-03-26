import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt2, HiX } from "react-icons/hi"; // Added Icons
import "./Sidebar.css";
import dashboardIcon from "../../assets/Icon/dashboard-icon.png";
import profileIcon from "../../assets/Icon/blog2.png";
import memberIcon from "../../assets/Icon/member.png";
import blogIcon from "../../assets/Icon/blog.png";
import reviewIcon from "../../assets/Icon/review.png";
import jobIcon from "../../assets/Icon/job.png";
import notificationIcon from "../../assets/Icon/notification.png";
import skillsIcon from "../../assets/Icon/skill.png";
import profileUpdateIcon from "../../assets/Icon/profile_update.png"
import logoutIcon from "../../assets/Icon/SignOut.png";
import { API_URL } from "../../api";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../contexts/AuthContext";
import { Modal } from "antd";
import GradientButton from "../../common/GradientButton/GradientButton";
import { toast } from "react-toastify";
import categoryIcon from "../../assets/options-lines.png"
import User from '../../assets/user.png'

const Sidebar = () => {
  const { user,  Count, token } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();



  const onCancel = () => { setShow(false) };
  const onClick = () => { setShow(true) };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const onConfirm = () => {
    localStorage.removeItem("accessToken")
    toast.success("Logged out successfully")

    setShow(false)
    navigate('/')
  }

  const menuItems = [
    { name: "Profile", icon: profileIcon, path: "/profile" },
    { name: "Dashboard", icon: dashboardIcon, path: "/dashboard" },
    { name: "Manage Members", icon: memberIcon, path: "/manage-members" },
    { name: "Manage Clients", icon: memberIcon, path: "/manage-clients" },
    { name: "Blog", icon: blogIcon, path: "/blog" },
    { name: "Reviews", icon: reviewIcon, path: "/reviews" },
    { name: "Job", icon: jobIcon, path: "/job" },
    { name: "Project", icon: jobIcon, path: "/project" },
    { name: "Category", icon: categoryIcon, path: "/category" },
    { name: "Skills", icon: skillsIcon, path: "/skills" },
    { name: "Profile update Requests", icon: profileUpdateIcon, path: "/profile-update-requests" },
    { name: "Advisory", icon: profileUpdateIcon, path: "/advisory" },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === "/profile") {
      return (
        currentPath === "/profile" ||
        currentPath === "/edit-profile" ||
        currentPath === "/change-password"
      );
    }
    if (path === "/dashboard" && currentPath === "/dashboard") return true;

    if (
      path === "/manage-members" &&
      (currentPath.startsWith("/manage-members") ||
        currentPath.startsWith("/view-profile"))
    ) {
      return true;
    }
    if (
      path === "/manage-clients" &&
      (currentPath.startsWith("/manage-clients") ||
        currentPath.startsWith("/client-profile"))
    ) {
      return true;
    }
    if (path === "/blog") {
      return (
        currentPath === "/blog" ||
        currentPath === "/add-blog" ||
        currentPath === "/blog-detail" ||
        currentPath === "/edit-detail"
      );
    }

    if (
      path === "/advisory" &&
      (currentPath.startsWith("/advisory") ||
        currentPath.startsWith("/edit-advisory"))
    ) {
      return true;
    }


    if (path === "/advisory") {
      return (
        currentPath === "/advisory" ||
        currentPath === "/add-advisory"
        // currentPath === "/create-category" 

      );
    }


    if (path === "/reviews" && currentPath.startsWith("/reviews")) return true;
    if (path === "/reviews") {
      return (
        currentPath === "/reviews" ||
        currentPath === "/unpublished" ||
        currentPath === "/published" ||
        currentPath === "/view-reviews"
      );
    }


    if (path === "/job") {
      return (
        currentPath === "/job" ||
        currentPath === "/view-job" ||
        currentPath === "/job-details"

      );
    }

    if (path === "/project") {
      return (
        currentPath === "/project" ||
        currentPath === "/view-project" ||
        currentPath === "/project-details"

      );
    }



    if (path === "/category") {
      return (
        currentPath === "/category" ||
        currentPath === "/update-category" ||
        currentPath === "/create-category"

      );
    }


    if (path === "/skills") {
      return (
        currentPath === "/skills" ||
        currentPath === "/create-skills"
        // currentPath === "/create-category" 

      );
    }

    if (path === "/profile-update-requests" && currentPath.startsWith("/profile-update-requests")) return true;

    if (path === "/notifications" && currentPath === "/notifications") return true;

    if (path === "/contact-us-requests" && currentPath === "/contact-us-requests") return true;

    return false;
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button className="mobile-toggle-btn" onClick={toggleMobileMenu}>
        <HiMenuAlt2 size={24} />

      </button>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu}></div>
      )}

      <div className={`admin-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Close Button for Mobile Sidebar */}
        <button className="mobile-close-btn" onClick={closeMobileMenu}>
          <HiX size={24} />
        </button>

        <div className="admin-profile">
          <div className="admin-logo">
            <img
              src={user?.image ? user.image : User}
              alt="Admin"
              className="admin-avatar"
            />
          </div>
          <div className="admin">
            <p className="admin-role">{user?.role}</p>
            <h4 className="admin-name">{user?.fullName}</h4>
          </div>
        </div>
        <div className="sidebar-divider"></div>
        <div className="menu-section">
          <p className="menu-title">DASHBOARD MENU</p>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleNavigation(item.path)}
              >
                <img src={item.icon} alt="" className="menu-icon" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="other-section">
          <p className="menu_title">OTHER</p>

          <div
            className={`menu-item ${isActive("/notifications") ? "active" : ""}`}
            onClick={() => handleNavigation("/notifications")}
          >
            <img src={notificationIcon} alt="" className="menu-icon" />
            <span>Notification</span>
            {Count?.unreadNotificationCount > 0 && (
              <span className="notification-badge">{Count.unreadNotificationCount}</span>
            )}
          </div>

          <div
            className={`menu-item ${isActive("/contact-us-requests") ? "active" : ""}`}
            onClick={() => handleNavigation("/contact-us-requests")}
          >
            <img src={notificationIcon} alt="" className="menu-icon" />
            <span>Contact Us Requests</span>
          </div>

          <div className="menu-item logout" onClick={() => {
            onClick();
            closeMobileMenu();
          }}>
            <img src={logoutIcon} alt="" className="menu-icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      <Modal
        open={show}
        onCancel={onCancel}
        footer={null}
        centered
        closable={false}
        className="delete-modal"
      >
        <h3 className="delete-text">Are you sure you want to log out?</h3>

        <div className="delete-actions">
          <GradientButton className="btn-yes" onClick={onConfirm} text={"Yes"}>
          </GradientButton>
          <GradientButton className="btn-no" onClick={onCancel} text={" No"}>
          </GradientButton>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;