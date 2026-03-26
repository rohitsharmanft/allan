import React, { useContext, useEffect, useState } from "react";
import "./MyProfile.css";
import Profile from "./Profile";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingCard from "../../../Components/Common/LoadingCard/LoadingCard";
import { AppContext } from "../../../contexts/AppContexts";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";


const MyProfile = () => {
  const { user, loadingProfile, refreshProfile } = useContext(AppContext);
  useEffect(() => { refreshProfile(); }, [])
  // if (loadingProfile) return (<><LoadingCard /></>)
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
      <div className="dashboard">
        <Sidebar />
        <div className="j">
          <Profile />
        </div>
      </div>
      < Footer />
    </>
  );
};

export default MyProfile;
