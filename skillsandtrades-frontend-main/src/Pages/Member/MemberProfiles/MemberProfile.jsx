import React, { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import "./MemberProfile.css";
import GradientButton from "../../../Components/Common/GradientButton";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import ProfileCard from "../../../Components/Member/ProfileCard";
import Header from "../../../Components/Common/Header/Header";
import { AppContext } from "../../../contexts/AppContexts";
import { member_profile_list } from "../../../api";
import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "../../../assets/images/user.png";

const MemberProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { user, refreshProfile, token } = useContext(AppContext);
  console.log(profile)
  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(member_profile_list, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status && response.data.data?.length > 0) {
          setProfile(response.data.data[0]);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(error.response?.data?.message || "Failed to load profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const isProfile = user?.isProfile;

  const editButtonText = isProfile ? "Update Profile" : "Complete Profile";
  const editNavigationPath = isProfile ? "/update-sub-profile" : "/create-another-profile";

  const handleEditClick = () => {
    navigate(editNavigationPath, { state: profile?.profileData?._id });
  };

  const handleViewClick = () => {
    navigate("/member-profile-view", { state: profile?.profileData?._id });
  };

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>

      <div className="member-profile-page">
        <Sidebar />

        <div className="profile-content">
          <div className="profile_header">
            <div>
              <h2>My Profile</h2>
            </div>
          </div>

          {loading ? (
            <div className="loading-state" style={{ padding: "60px 0", textAlign: "center" }}>
              <Spin size="large" tip="Loading your profile..." />
            </div>
          ) : !profile ? (
            <div className="no-profiles">
              <p>You haven't created a profile yet.</p>
              <GradientButton
                className="create-btn"
                text="Create Profile"
                onClick={() => navigate("/create-another-profile")}
              />
            </div>
          ) : (
            <div className="profile-cards">
              <ProfileCard
                key={profile?._id}
                name={profile?.fullName}
                reviews={profile?.profileData?.ratingData?.length || 0}
                rating={profile?.profileData?.avgRating || 0}
                image={profile?.image || Avatar}
                description={profile?.profileData?.overview || "No overview provided"}
                location={profile?.profileData?.workLocation || "Location not set"}
                qualification={profile?.profileData?.qualification || ""}
                skills={profile?.profileData?.skills?.map((s) => s.title) || []}
                onEdit={handleEditClick}
                onView={handleViewClick}
                buttonText1={editButtonText}
                buttonText2="View Profile"
                showButton2={isProfile}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MemberProfile;