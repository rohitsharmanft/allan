import React from 'react'
import './MemberTopBar.css'
import { MdEmail } from 'react-icons/md';
import { IoCallOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa";


const MemberTopBar = () => {
     const navigate = useNavigate();

  return (
   <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-item" onClick={() => navigate("/contact")}>
          <MdEmail className="icon_" />
          <span>support@skills.com</span>
        </div>

        <div className="topbar-item" onClick={() => navigate("/contact")}>
          <IoCallOutline className="icon_" />
          <span>+27 78 575 9101</span>
        </div>
      </div>

      <div className="topbar-right">
        <button onClick={() => navigate("/facebook")}><FaFacebookF /></button>
        <button onClick={() => navigate("/instagram")}><FaInstagram /></button>
        <button onClick={() => navigate("/linkedin")}><FaLinkedinIn /></button>
        <button onClick={() => navigate("/whatsapp")}><FaWhatsapp /></button>
        <button onClick={() => navigate("/youtube")}><FaYoutube /></button>
      </div>
    </div>
  )
}

export default MemberTopBar
