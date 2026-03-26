import React from "react";
import "./LeaveReview.css";
// import LeaveReviewCard from "../../Components/Common/LeaveReviewCard";
import icon1 from "../../../assets/icons/icon1.png"
import calendar from "../../../assets/icons/calendar.png"
import vector from "../../../assets/icons/vector.png"
import { FaRegCommentDots, FaCalendarTimes, FaRegEnvelope } from "react-icons/fa";
// import Header from "../../Components/Header/Header";

import Footer from '../../../Components/Common/Footer/Footer';
import LeaveReviewCard from "../../../Components/Common/LeaveReviewCard";
import Header from "../../../Components/Common/Header/Header";
const LeaveReview = () => {
  const cards = [
    {     
      icon: icon1,
      title: "Review",
      description:
        "We greatly value your feedback to help us maintain the high quality of our traders. Reviews take just a couple of minutes to complete and are a huge help for traders and other consumers alike. See how reviews work and how they help.",
      buttonText: "Leave A Review →",
    },
    // {
    //   icon: calendar,
    //   title: "Missed Appointment",
    //   description:
    //     "We greatly value your feedback to help us maintain the high quality of our traders. Reviews take just a couple of minutes to complete and are a huge help for traders and other consumers alike. See how reviews work and how they help.",
    //   buttonText: "Report Missed Appointment →",
    // },
    // {
    //   icon: vector,
    //   title: "Complaint",
    //   description:
    //     "We greatly value your feedback to help us maintain the high quality of our traders. Reviews take just a couple of minutes to complete and are a huge help for traders and other consumers alike. See how reviews work and how they help.",
    //   buttonText: "Make A Complaint →",
    // },
  ];

  return (
    <>

      <Header />

      <div className="hero-section">
        <div className="overlay"></div>
        <h1> Leave A Review</h1>
      </div>
      <section className="review-section">
        <h2>What type of review would you like to leave?</h2>
        <p className="review-subtext">
          Leave a review of work done, report a missed appointment or make a complaint
        </p>

        <div className="review-grid">
          {cards.map((card, i) => (
            <LeaveReviewCard
              key={i}
              icon={card.icon}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LeaveReview;
