import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import ProfileCard1 from "../../common/ReviewCard/ProfileCard1";
import { admin_reviews_list, admin_review_status } from "../../api";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import "./Reviews.css";
import { Breadcrumb, Spin } from "antd";
import { FiChevronRight } from "react-icons/fi";

const SubprofileReviews = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [subprofileName, setSubprofileName] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [id, token]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        admin_reviews_list,
        { subprofileId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const member = response.data.data.find((m) =>
        m.profileData?.some((p) => p._id === id)
      );

      if (!member) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const subprofile = member.profileData.find((p) => p._id === id);
      setSubprofileName(subprofile?.workDescription || "Unnamed Subprofile");

      const mappedReviews = (subprofile?.ratingData || []).map((r) => ({
        id: r._id,
        clientName: r.clientName?.join(", ") || "Anonymous",
        rating: r.rating || 0,
        review: r.review || "",
        status: r.status || "unpublished",
      }));

      setReviews(mappedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      await axios.post(
        admin_review_status,
        { id: reviewId, type: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Failed to update review status:", error);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "published") return r.status === "published";
    if (filter === "unpublished") return r.status === "unpublished";
    return true;
  });

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

          <div className="profile_header">
            <div className="all-btn">
              <GradientButton
                text="All"
                className={`button ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              />
              <GradientButton
                text="Published"
                className={`btn1 ${filter === "published" ? "active" : ""}`}
                onClick={() => setFilter("published")}
              />
              <GradientButton
                text="Unpublished"
                className={`button ${filter === "unpublished" ? "active" : ""}`}
                onClick={() => setFilter("unpublished")}
              />
            </div>
          </div>

          <div className="profile-cards">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" tip="Loading reviews..." />
              </div>
            ) : filteredReviews.length === 0 ? (
              <p className="no-results">
                No {filter === "all" ? "" : filter} reviews found
              </p>
            ) : (
              filteredReviews.map((r) => (
                <ProfileCard1
                  key={r.id}
                  title={`Client: ${r.clientName}`}
                  description={r.review}
                  rating={r.rating}
                  buttonText={r.status === "published" ? "Unpublish" : "Publish"}
                  onButtonClick={() =>
                    updateReviewStatus(
                      r.id,
                      r.status === "published" ? "unpublished" : "published"
                    )
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubprofileReviews;