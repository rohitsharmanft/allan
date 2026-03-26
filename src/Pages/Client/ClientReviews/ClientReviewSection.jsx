import React from "react";
import ReviewCard from "../../../Components/Common/ReviewCard/ReviewCard";
import "./ClientReviewSection.css";

import TopBar from '../../../Components/Common/Header/TopBar';
import Header from "../../../Components/Common/Header/Header";
import ClientSideBar from '../../../Components/Client/ClientPannel/ClientSideBar';
import Footer from "../../../Components/Common/Footer/Footer";
import GradientButton from "../../../Components/Common/GradientButton";
import ClientNavBar from "../ClientHeader/ClientNavBar";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";

const ClientReviewSection = () => {
  const location = useLocation();
  const review = location.state.review;
  console.log(review)
  return (
    <>
      {/* <TopBar />
      <ClientNavBar /> */}
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>
      <div className="dashboard">
        <ClientSideBar />
        <div className="main-reviews">
          <div className="breadcrumb">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/client-reviews">Reviews</Link>,
                },

                {
                  title: "View Reviews",
                },
              ]}
            />
          </div>
          <div className="reviews-section">

            <ReviewCard
              // name="Allan" 
              reviewedBy={`Reviewed By:${review?.fullName}`}
              comment={`Comment :${review?.review}`}
              rating={`Rating:${review?.rating}`}
            />
          </div>
          {/* <div className="reviews-btn">
              <GradientButton text={"Delete →"} className="btn-delete" />
              <GradientButton text={"Discard →"} className="btn-discard" />
            </div> */}
        </div>
      </div>
      <Footer />

    </>
  );
};

export default ClientReviewSection;
