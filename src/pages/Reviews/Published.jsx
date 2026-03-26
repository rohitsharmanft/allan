import React, { useState, useEffect, useContext } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./Reviews.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard1 from "../../common/ReviewCard/ProfileCard1";
import { Breadcrumb, Spin } from "antd";
import { FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { admin_reviews_list } from "../../api";

const Published = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          admin_reviews_list,
          { type: "published" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status && response.data.code === 200) {
          const formatted = response.data.data
            .map((member) => ({
              name: member.fullName,
              reviews: member.ratingData?.length || 0,
              rating: member.profileAvgRating || 0,
              description: member.workDescription || "",
              location: member.country || "",
              image: member.image || "",
            }))
            .filter((p) => p.reviews > 0);

          setProfiles(formatted);
        }
      } catch (err) {
        console.error("Failed to load published profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedProfiles();
  }, [token]);

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
              <div className="all-btn">
                <GradientButton
                  text="Published"
                  onClick={() => navigate("/reviews")}
                  className="btn1"
                />
                <GradientButton
                  text="Unpublished"
                  onClick={() => navigate("/unpublished")}
                  className="button"
                />
              </div>
            </div>

            <div className="profile-cards">
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" tip="Loading published profiles..." />
                </div>
              ) : profiles.length === 0 ? (
                <p className="no-results">No published profiles found</p>
              ) : (
                profiles.map((p, index) => (
                  <ProfileCard1
                    key={index}
                    name={p.name}
                    reviews={p.reviews}
                    rating={p.rating}
                    description={p.description}
                    location={p.location}
                    image={p.image}
                    onEdit={() => navigate(`/reviews/member/${p.id || index}`)}
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

export default Published;