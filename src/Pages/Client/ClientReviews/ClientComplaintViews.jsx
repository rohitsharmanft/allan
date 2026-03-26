import React from 'react'
import ReviewCard from "../../../Components/Common/ReviewCard/ReviewCard";
import "./ClientReviewSection.css";

import TopBar from '../../../Components/Common/Header/TopBar';
import Header from "../../../Components/Common/Header/Header";

import GradientButton from "../../../Components/Common/GradientButton";
import Footer from '../../../Components/Common/Footer/Footer';
import ClientSideBar from '../../../Components/Client/ClientPannel/ClientSideBar';
                                                          
const ClientComplaintViews = () => {
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
    <ClientSideBar/>
  <div className="main-reviews">
          <div className="breadcrumb">
          Complaints &gt; <span>View complaint</span>
        </div>
      <div className="reviews-section">

        <ReviewCard
          name="No Complain for Allan"
        //   reviewedBy="James"
          comment="I found the skills that I was looking for, the platform is fast and efficient."
        />
        {/* <ReviewCard
        name="Sophia"
        reviewedBy="Liam"
        comment="Very professional and great communication throughout."
        rating="5.0"
      /> */}
      </div>
      <div className="reviews-btn">
      <GradientButton text={"Delete"} className="btn-delete"/>
      <GradientButton text={"Discard"} className="btn-discard" />
     </div>
    </div>
   </div>
   <Footer/>
  
    </>
  );
}

export default ClientComplaintViews
