import React, { useContext, useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import GradientButton from "../../../Components/Common/GradientButton";
import "./MemberReviews.css";
// import Sidebar from "../../../Components/Common/MemberPanel/Sidebar";
import ProfileCard1 from '../../../Components/Member/ProfileCard1';

import { useNavigate } from "react-router-dom";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import axios from "axios";
import { member_profile_list, member_rating_list } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import Avatar from "../../../assets/images/user.png"
const MemberReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user, refreshProfile } = useContext(AppContext)
  const [profile, setProfile] = useState([]);

  useEffect(() => { refreshProfile(); }, []);

  const fetchProfile = async () => {
    if (!token) {
      setLoading(false); return;
    }
    try {
      setLoading(true);
      const response = await axios.get(member_profile_list, { headers: { Authorization: `Bearer ${token}`, }, });

      if (response.data.status && response.data.data.length > 0) {
        const profiles = response.data.data[0] || [];
        setProfile(profiles);
      } else { setProfile([]); }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error(error.response?.data?.message || "Failed to load profiles");
      setProfile([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, [token]);
  const profiles = [
    {
      name: "Skills & Trades Pty Ltd",
      reviews: 1,
      rating: 4.75,
      description: "Online skills platform",
      location: "South Africa",
      image: logo,
    },
    {
      name: "Skills & Trades",
      reviews: 1,
      rating: 4.75,
      description: "Experienced architect",
      location: "Harare",
      image: logo,
    },
  ];
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
      <div className="dashboard">
        <Sidebar />
        <div className="profile_content">
          <div className="profile_header">
            <div>
              {" "}
              <h3>Reviews</h3>
              {/* <div className="all-btn">
                <GradientButton
                  text={"Reviews"}
                  onClick={() => navigate("/member-review")}
                />
                <GradientButton
                  text={"Missed Appointment"}
                  className="btn-both"
                  onClick={() => navigate("/member-missed-appointment")}
                />
                <GradientButton
                  text={"Complaints"}
                  className="btn-both"
                  onClick={() => navigate("/member-complaint")}
                />
              </div> */}
            </div>
          </div>
          <div className="profile-cards">
            <ProfileCard1
              key={profile.profileData?._id}
              name={profile?.fullName}
              reviews={profile.profileData?.ratingData?.length || 0}
              rating={profile.profileData?.avgRating || 0}
              description={profile.profileData?.overview || "No overview provided"}
              location={profile.profileData?.workLocation || "Location not set"}
              qualification={profile.profileData?.qualification || ""}
              skills={profile.profileData?.skills?.map((s) => s.title) || []}
              {...profile}
              onClicked={() => navigate("/member-review-section", { state: profile.profileData?._id })}
              buttonText="View Reviews"
              childern={"Reviewd By"}
              image={profile.image || Avatar}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MemberReviews;
