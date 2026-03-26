import React, { useState, useEffect } from "react";
import "./SkillsTrades.css";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { Breadcrumb, Empty, Rate, Spin } from "antd";
import logo from "../../../assets/images/logo.png";
import Header from "../../../Components/Common/Header/Header";
import GradientButton from "../../../Components/Common/GradientButton";
import Footer from "../../../Components/Common/Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { detail_page } from "../../../api";
import { toast } from "react-toastify";

const SkillsTrades = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const location = useLocation();
  const companyData = location.state.companyData || [];
  const locationName = location.state.locationName || "";
  const profileData = location.state.profileData || [];
  const category = location.state?.categoryData;
  const id = companyData?._id;
  console.log(locationName);
  console.log(category);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${detail_page}/${id}`);
        const result = await response.json();
        if (result.code === 200) {
          setData(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReadMore = () => { setReviewsToShow((prev) => prev + 2); };

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="skills-container"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <Spin size="large" />
        </div>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <div className="skills-container" style={{ padding: "50px" }}>
          <Empty description="No data found" />
        </div>
        <Footer />
      </>
    );
  }

  const totalReviews = data.ratingList?.length || 0;
  const visibleReviews = data.ratingList?.slice(0, reviewsToShow) || [];
  const hasMoreReviews = totalReviews > reviewsToShow;

  return (
    <>
      <Header />

      <div className="skills-container">
        <div className="hero-section">
          <div className="overlay"></div>
          <h1>Skills in {data.workLocation || "South Africa"}</h1>
        </div>
        <div className="breadcrumb">
          <Breadcrumb
            separator={<FiChevronRight size={14} className="ss" />}
            items={[
              {
                title: <Link to="/">Homepage</Link>,
              },
              {
                title: <Link to="/all-categories">All Categories</Link>,
              },
              ...(category
                ? [
                  {
                    title: (
                      <Link to="/administration" state={category}>
                        Administration Skills
                      </Link>
                    ),
                  },
                ]
                : []),
              {
                title: (
                  <Link
                    to="/skill-profiles"
                    state={{ profileData, category, locationName }}
                  >
                    Skills in {locationName || "South Africa"}
                  </Link>
                ),
              },
              {
                title: "Detail Page",
              },
            ]}
          />
        </div>
        <div className="skills-header-main">
          <div className="skills-header">
            <div className="header-left">
              <h2>{data.businessTradingName}</h2>
              <p>{data.overview}</p>
              <div className="icons">
                <a href={`tel:+91${data.phoneNumber}`} title="Call us">
                  <FaPhoneAlt className="icon" />
                </a>
                <a href={`mailto:${data.memberEmail}`} title="Email us">
                  <FaEnvelope className="icon" />
                </a>
                <a
                  href={`https://wa.me/91${data.phoneNumber}?text=${encodeURIComponent("I am interested in your services as advertised on Skills and Trades Africa website")}`}
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
                src={data.image || logo}
                alt={data.memberName}
                className="logo"
              />
            </div>
          </div>

          <div className="profile">
            <h3>Profile</h3>
            <p>{data.overview}</p>
          </div>

          <div className="photo-gallery">
            <h3>Photo Gallery Image</h3>
            <div className="gallery-images">
              {data.photoGallery && data.photoGallery.length > 0 ? (
                data.photoGallery.map((img, index) => (
                  <img key={index} src={img} alt={`gallery-${index + 1}`} />
                ))
              ) : (
                <p>No photos available</p>
              )}
            </div>

            <div className="info-cards">
              <div className="info-card">
                <h4>Online Skills Platform</h4>
                <p>{data.workLocation}</p>
                <p>
                  Verified{" "}
                  {new Date(data.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="info-card">
                <h4>Qualifications</h4>
                <p>{data.qualification}</p>
                <p>
                  Verified{" "}
                  {new Date(data.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="photo-gallery">
            <div className="skills_list">
              <h3>Skills</h3>
              <div className="skills-grid">
                {data.skills && data.skills.length > 0 ? (
                  data.skills.map((skill) => (
                    <div key={skill._id} className="skill-badge">
                      {skill.title}
                    </div>
                  ))
                ) : (
                  <p>No skills listed</p>
                )}
              </div>
            </div>

            <div className="reviews-section-">
              <h3>Reviews</h3>
              <div className="rating">
                <div className="rating-line">
                  <span>{totalReviews} Reviews / </span>
                  <span className="rating-value"> {data.avgRating || 0}</span>
                  {data.avgRating !== undefined && (
                    <Rate
                      disabled
                      allowHalf
                      value={Number(parseFloat(data.avgRating)) || 0}
                    />
                  )}
                </div>
              </div>
              {visibleReviews.length > 0 ? (
                <>
                  {visibleReviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-user">
                        <div className="avatar">
                          {review.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div className="name">
                          <h4>{review.clientName}</h4>
                          <p className="date">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <Rate
                        disabled
                        value={parseFloat(review.rating)}
                        allowHalf
                        className="rate"
                      />
                      <p>{review.review}</p>
                    </div>
                  ))}
                  {hasMoreReviews && (
                    <GradientButton
                      text="Read More"
                      className="btn-read-more"
                      onClick={handleReadMore}
                    />
                  )}
                </>
              ) : (
                <p>No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SkillsTrades;
