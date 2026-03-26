import React from 'react'
import ReviewCard from "../../../Components/Common/ReviewCard/ReviewCard";
import "./ClientReviewSection.css";

import Header from "../../../Components/Common/Header/Header";
import ClientSideBar from '../../../Components/Client/ClientPannel/ClientSideBar';
import Footer from "../../../Components/Common/Footer/Footer";
import GradientButton from "../../../Components/Common/GradientButton";
import TopBar from '../../../Components/Common/Header/TopBar';

const ClientMissedReviews = () => {
  return (
    <>
      {/* <TopBar/>
     <ClientNavBar/> */}
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>
      <div className="dashboard">
        <ClientSideBar />
        <div className="main-reviews">
          <div className="breadcrumb">
            Missed Appointment&gt; <span>View Missed Appointment</span>
          </div>
          <div className="reviews-section">

            <ReviewCard
              name="Allan"
              reviewedBy="Reviewd By:James"
              comment="Comment:I found the skills that I was looking for, the platform is fast and efficient."
              rating="Rating: 4.75"
            />
            {/* <ReviewCard
        name="Sophia"
        reviewedBy="Liam"
        comment="Very professional and great communication throughout."
        rating="5.0"
      /> */}
          </div>
          <div className="reviews-btn">
            <GradientButton text={"Delete"} className="btn-delete" />
            <GradientButton text={"Discard"} className="btn-discard" />
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
}

export default ClientMissedReviews
