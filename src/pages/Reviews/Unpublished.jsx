import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./Reviews.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard1 from "../../common/ReviewCard/ProfileCard1";
import { Breadcrumb, Spin } from "antd";
import { FiChevronRight } from "react-icons/fi";

const Unpublished = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API fetch (replace with real API call)
  useEffect(() => {
    const fetchUnpublishedProfiles = async () => {
      setLoading(true);
      try {
        // Replace with your real API call
        // const res = await axios.get("/api/unpublished-profiles", { headers });
        // const data = res.data.data || [];

        // For demo - using static data
        const mockData = [
          {
            name: "Allan",
            reviews: 1,
            rating: 4.75,
            description: "Online skills platform",
            location: "South Africa",
            image: logo,
          },
          {
            name: "James",
            reviews: 1,
            rating: 4.75,
            description: "Experienced architect",
            location: "Harare",
            image: logo,
          },
        ];

        setProfiles(mockData);
      } catch (error) {
        console.error("Failed to load unpublished profiles", error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnpublishedProfiles();
  }, []);

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          <div className="views">
            <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/reviews">All Profiles</Link>,
                  },
                  {
                    title: "View Profile",
                  },
                ]}
              />
            </div>
          </div>

          <div className="profile_content">
            <div className="profile_header">
              <div>
                <div className="all-btn">
                  <GradientButton
                    text={"Published"}
                    onClick={() => navigate("/published")}
                    className="button"
                  />
                  <GradientButton
                    text={"Unpublished"}
                    className="btn1"
                  />
                </div>
              </div>
            </div>

            <div className="profile-cards">
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" tip="Loading unpublished profiles..." />
                </div>
              ) : profiles.length === 0 ? (
                <p className="no-results">No unpublished profiles found</p>
              ) : (
                profiles.map((p, index) => (
                  <ProfileCard1
                    key={index}
                    {...p}
                    onEdit={() => navigate("/view-reviews")}
                    buttonText="View"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unpublished;