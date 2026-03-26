import React, { useContext, useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import GradientButton from "../../../Components/Common/GradientButton";
import "./ClientReviews.css";
import ProfileCard1 from "../../../Components/Member/ProfileCard1";

import { useNavigate } from "react-router-dom";

import TopBar from "../../../Components/Common/Header/TopBar";
import Header from "../../../Components/Common/Header/Header";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import Footer from "../../../Components/Common/Footer/Footer";
import ClientNavBar from "../ClientHeader/ClientNavBar";
import axios from "axios";
import { client_rating_list, rating_list } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import Avatar from "../../../assets/images/user.png"

const ClientReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AppContext)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(client_rating_list, { headers: { Authorization: `Bearer ${token}` } })
        if (response.data.code === 200) {
          setReviews(response.data.data);
        } else {
          setError(response.message || "No reviews found");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


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

        <div className="profile_content">
          <div className="profile_header">
            <h3>Reviews</h3>
          </div>

          {/* {loading && (
            <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>
              Loading reviews...
            </div>
          )} */}

          {!loading && !error && reviews.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
              <h3>No reviews yet</h3>
              <p>Your clients haven't left any reviews.</p>
            </div>
          )}

          <div className="profile-cards">
            {reviews && reviews.map((review) => (
              <ProfileCard1
                key={review._id}
                name={review.businessTradingName || "Anonymous"}
                rating={review.rating}
                reviews={1}
                description={review.review}
                location={review.workLocation}
                image={review.image || Avatar}
                onClicked={() => { navigate('/client-reviews-section', { state: { review } }) }}
                buttonText="View Detail"
                userName={review.fullName}
                childern={"Review For"}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ClientReviews;