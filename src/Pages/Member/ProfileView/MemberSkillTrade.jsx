import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { Breadcrumb, Rate } from "antd";
import logo from "../../../assets/images/logo.png";
import GradientButton from "../../../Components/Common/GradientButton";
import "./MemberSkillTrade.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { member_profile_by_id } from "../../../api";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";

const MemberSkillTrade = () => {
  const location = useLocation();
  const profileId = location.state;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsToShow, setReviewsToShow] = useState(3);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) {
        toast.error("No profile ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${member_profile_by_id}/${profileId}`,
        );
        if (response.data.status && response.data.data.length > 0) {
          setProfile(response.data.data[0]);
        } else {
          toast.error("Profile not found");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error_description || "Failed to fetch profile",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [profileId]);

  const handleReadMore = () => {
    setReviewsToShow((prev) => prev + 3);
  };

  if (loading)
    return (
      <div className="skills_container">
        <p>Loading profile...</p>
      </div>
    );
  if (!profile)
    return (
      <div className="skills_container">
        <p>Profile not found.</p>
      </div>
    );

  // All reviews (including rating 0)
  const allReviews = profile.ratingList || [];
  const sortedReviews = [...allReviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // Only count reviews with actual rating > 0 for average
  const ratedReviews = allReviews.filter((r) => r.rating > 0);
  const avgRating =
    ratedReviews.length > 0
      ? ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length
      : 0;

  const totalReviews = allReviews.length;
  const ratedReviewsCount = ratedReviews.length;

  const visibleReviews = sortedReviews.slice(0, reviewsToShow);
  const hasMoreReviews = totalReviews > reviewsToShow;

  return (
    <>
      <div className="skills_container">
        <div className="sc">
          <div className="breadcrumb">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/member-profile">Member Profile</Link>,
                },

                {
                  title: "Profile View",
                },
              ]}
            />
          </div>
        </div>

        <h2 className="hh">Profile View</h2>
        <div className="skills_header_main">
          {/* Dynamic Header */}
          <div className="skills-header">
            <div className="header-left">
              <h2>{profile.businessTradingName}</h2>
              <p>{profile.overview || "Online skills platform"}</p>
              <div className="icons">
                <a href={`tel:${profile.phoneNumber}`} title="Call us">
                  <FaPhoneAlt className="icon" />
                </a>
                <a href={`mailto:${profile.memberEmail}`} title="Email us">
                  <FaEnvelope className="icon" />
                </a>
                <a
                  href={`https://wa.me/${profile.phoneNumber}?text=${encodeURIComponent("I am interested in your services as advertised on Skills and Trades Africa website")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                >
                  <FaWhatsapp className="icon" />
                </a>
                <div className="divider-"></div>
              </div>
            </div>
            <div className="logo-container">
              <img
                src={profile.image || logo}
                alt={profile.memberName}
                className="logo"
              />
            </div>
          </div>

          {/* Profile Section */}
          <div className="profile">
            <h3>Profile - {profile.memberName}</h3>
            <p>{profile.workDescription || "No description available."}</p>
          </div>

          <div className="rating">
            <div className="rating-line">
              <span>
                {ratedReviewsCount} Review{ratedReviewsCount !== 1 ? "s" : ""}{" "}
                /{" "}
              </span>
              <span className="rating-value">
                {ratedReviewsCount > 0 ? avgRating.toFixed(1) : "0.0"}
              </span>
              <Rate disabled allowHalf value={parseFloat(avgRating) || 0} />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews_section">
            <h3>Reviews ({totalReviews})</h3>

            {visibleReviews.length > 0 ? (
              <>
                {visibleReviews.map((review) => (
                  <div className="review_card" key={review._id}>
                    <div className="review-user">
                      <div className="avatar">
                        {review.clientName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="name">
                        <h4>{review.clientName || "Anonymous"}</h4>
                        <p className="date">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {review.rating > 0 ? (
                      <Rate
                        disabled
                        value={parseFloat(review.rating)}
                        allowHalf
                        className="rate"
                      />
                    ) : (
                      <p
                        style={{
                          color: "#999",
                          fontStyle: "italic",
                          margin: "10px 0",
                        }}
                      >
                        No star rating provided
                      </p>
                    )}
                    <p>{review.review || <em>No comment provided.</em>}</p>
                    {review.rating > 0 && (
                      <p className="recommend">
                        Would Recommend: {review.rating >= 4 ? "Yes" : "No"}
                      </p>
                    )}
                  </div>
                ))}

                {hasMoreReviews && (
                  <GradientButton
                    text="Read More →"
                    className="btn-read-more"
                    onClick={handleReadMore}
                  />
                )}
              </>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          {/* Photo Gallery */}
          <div className="photo-gallery">
            <h3>Photo Gallery Image</h3>
            <div className="gallery-images">
              {profile.photoGallery && profile.photoGallery.length > 0 ? (
                profile.photoGallery.map((img, index) => (
                  <img key={index} src={img} alt={`gallery-${index + 1}`} />
                ))
              ) : (
                <p>No photos available</p>
              )}
            </div>

            <div className="info_cards">
              <div className="info_card">
                <h4>Location</h4>
                <p>{profile.workLocation || "Not specified"}</p>
                <p>Member since {new Date(profile.createdAt).getFullYear()}</p>
              </div>
              <div className="info_card">
                <h4>Skills</h4>
                {profile.skills?.length > 0 ? (
                  <div className="skills_list">
                    {profile.skills.map((skill) => (
                      <p key={skill._id}>{skill.title}</p>
                    ))}
                  </div>
                ) : (
                  <p>No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberSkillTrade;
