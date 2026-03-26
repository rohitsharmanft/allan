import React, { useEffect, useState } from "react";
import "./MemberReviews.css";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import axios from "axios";
import { member_profile_by_id } from "../../../api";
import { toast } from "react-toastify";
import ReviewCard from "../../../Components/Common/ReviewCard/ReviewCard";
import { Breadcrumb, Spin } from "antd";
import { FiChevronRight } from "react-icons/fi";

const ReviewsSection = () => {
  const location = useLocation();
  const profileId = location.state;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) {
        toast.error("No profile ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${member_profile_by_id}/${profileId}`);
        if (response.data.status && response.data.data.length > 0) {
          setProfile(response.data.data[0]);
        } else {
          toast.error("Profile not found");
        }
      } catch (error) {
        toast.error(error.response?.data?.error_description || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);

  // if (loading) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }
  // if (!profile) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <p>Profile not found.</p>    </div>
  //   );
  // }
  const reviews = profile?.ratingList || [];

  const validRatings = reviews.filter(r => r.rating > 0);
  const avgRating = validRatings.length > 0
    ? (validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length).toFixed(1)
    : "0.0";
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
      <div className="dashboard">
        <Sidebar />
        <div className="main-reviews">
          <div className="breadcrumb">

            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/member-review">Reviews</Link>,
                },

                {
                  title: "View Reviews",
                },
              ]}
            />
          </div>
          <div className="reviews-section">
            {loading ? <div className="loading-state" style={{ padding: "60px 0", textAlign: "center" }}>
              <Spin size="large" tip="Loading your profile..." />
            </div> :
              reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    name={profile.memberName}
                    reviewedBy={review.clientName || "Anonymous"}
                    comment={review.review || "No comment provided."}
                    rating={review.rating > 0 ? `${review.rating} stars` : "Not rated"}
                  />
                ))
              )
            }
          </div>

        </div>
      </div>
      <Footer />

    </>
  );
};

export default ReviewsSection;
