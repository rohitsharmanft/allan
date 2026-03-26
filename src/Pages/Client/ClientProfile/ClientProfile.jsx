import React, { useContext, useEffect, useState } from "react";
import "./MyProfile.css";
// import Sidebar from "../../../Components/Common/ClientPannel/ClientSideBar";
import Profile from "./Profile";
// import ClientNavBar from "../../../Pages/ClientPage/ClientHeader/ClientNavBar";
import TopBar from '../../../Components/Common/Header/TopBar';
import Footer from "../../../Components/Common/Footer/Footer";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import Header from "../../../Components/Common/Header/Header";
import { AppContext } from "../../../contexts/AppContexts";
       
const ClientProfile = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>
      <div className="dashboard">
        <ClientSideBar />
        <div className="j">
        <Profile/>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClientProfile;
