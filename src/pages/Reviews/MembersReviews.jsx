import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { admin_reviews_list, admin_review_status } from "../../api";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Breadcrumb, Spin } from "antd";
import { FiChevronRight } from "react-icons/fi";
import "./MembersReviews.css";

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="gold" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="gold" />);
    } else {
      stars.push(<FaRegStar key={i} color="gold" />);
    }
  }

  return (
    <div className="star-rating-container">
      <div style={{ display: "flex", gap: "2px" }}>{stars}</div>
      <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const MembersReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [member, setMember] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberReviews();
  }, [id, token]);

  const fetchMemberReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        admin_reviews_list,
        { memberId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status && res.data.data) {
        const foundMember = res.data.data.find((m) => m._id === id);
        if (foundMember) {
          setMember(foundMember);
          setReviews(foundMember.ratingData || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch member reviews:", err);
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
        prev.map((r) =>
          r._id === reviewId ? { ...r, status: newStatus } : r
        )
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
                  { title: <Link to="/reviews">All Profiles</Link> },
                  { title: "Reviews" },
                ]}
              />
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={`gradient-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`gradient-btn ${filter === "published" ? "active" : ""}`}
              onClick={() => setFilter("published")}
            >
              Published
            </button>
            <button
              className={`gradient-btn ${filter === "unpublished" ? "active" : ""}`}
              onClick={() => setFilter("unpublished")}
            >
              Unpublished
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "80px 0", textAlign: "center" }}>
              <Spin size="large" tip="Loading member reviews..." />
            </div>
          ) : (
            <>
              {member && (
                <div className="profile_header">
                  <h2>{member.fullName || "Member"}</h2>
                  <p>Average Rating: {member.profileAvgRating?.toFixed(1) || "—"}</p>
                  <p>Total Reviews: {reviews.length}</p>
                </div>
              )}

              <div className="profile-cards">
                {filteredReviews.length === 0 ? (
                  <p>No {filter !== "all" ? filter : ""} reviews found</p>
                ) : (
                  filteredReviews.map((r) => (
                    <div key={r._id} className="review-card">
                      <h4>{r.clientName || "Anonymous"}</h4>
                      <StarRating rating={r.rating || 0} />
                      <p>{r.review || "No comment provided"}</p>
                      <p>Status: {r.status || "unpublished"}</p>
                      <button
                        className="gradient-btn"
                        onClick={() =>
                          updateReviewStatus(
                            r._id,
                            r.status === "published" ? "unpublished" : "published"
                          )
                        }
                      >
                        {r.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <GradientButton text="Back" onClick={() => navigate(-1)} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MembersReviews;