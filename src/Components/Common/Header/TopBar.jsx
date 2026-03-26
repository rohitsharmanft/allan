import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import React from "react";
import "./TopBar.css";
import { PiInstagramLogoFill } from "react-icons/pi";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { CgMail } from "react-icons/cg";
import { MdOutlinePhone } from "react-icons/md";
import { ImLinkedin } from "react-icons/im";

const TopBar = () => {
  const navigate = useNavigate();

  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@skills.com";
  };

  const handlePhone = () => {
    window.location.href = "tel:+27785759101";
  };

  const handleWhatsapp = () => {
    window.open(
      `https://wa.me/27785759101?text=${encodeURIComponent("I am interested in your services as advertised on Skills and Trades Africa website")}`,
      "_blank",
    );
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* <a className="topbar-item" href="mailto:support@skills.com" style={{color:"white"}}>
          <CgMail size={15} className="icon_" />
          <span>support@skills.com</span>
        </a> */}

        <div
          className="topbar-item"
          onClick={() => {
            window.open(
              `https://wa.me/27785759101?text=${encodeURIComponent("I am interested in your services as advertised on Skills and Trades Africa website")}`,
              "_blank",
            );
          }}
        >
          <MdOutlinePhone size={15} className="icon_" />
          <span>+27 78 575 9101</span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          onClick={() =>
            handleExternalLink("https://www.facebook.com/skillsandtradesafrica")
          }
        >
          <FaFacebookF size={15} />
        </button>
        <button
          onClick={() =>
            handleExternalLink(
              "https://www.instagram.com/skillsandtradesafrica",
            )
          }
        >
          <PiInstagramLogoFill size={15} />
        </button>
        <button
          onClick={() =>
            handleExternalLink(
              "https://www.linkedin.com/company/skillsandtrades/?originalSubdomain=za",
            )
          }
        >
          <ImLinkedin size={15} />
        </button>
        <button onClick={handleWhatsapp}>
          <TbBrandWhatsappFilled size={15} />
        </button>
        <button
          onClick={() =>
            handleExternalLink("https://www.youtube.com/@SkillsTradesAfrica")
          }
        >
          <FaYoutube size={15} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
