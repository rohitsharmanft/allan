import React, { useContext, useEffect, useState } from "react";
import "./JobDetail1.css";
import jobImg from "../../../../assets/images/img8.png";
import Header from "../../../../Components/Common/Header/Header";
import Footer from "../../../../Components/Common/Footer/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UploadDetails from "../../../../Components/Common/Upload/UploadDetails";
import GradientButton from "../../../../Components/Common/GradientButton";
import { AppContext } from "../../../../contexts/AppContexts";
import { Breadcrumb } from "antd";
import { FiChevronRight, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";

const JobDetail1 = () => {
  const location = useLocation();
  const job = location.state?.job;
  const type = location.state?.type;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, refreshProfile, userType } = useContext(AppContext);
  const navigate = useNavigate();
  const uploadButtonText = type === "project" ? "Upload Document" : "Upload CV";
  const profileId = user?.memberProfileData?._id;
  const isLoggedIn = !!user;
  const isMember = userType?.toLowerCase() === "member";
  const isProject = type === "project";

  useEffect(() => { refreshProfile(); }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Support both flat fields (from API response) and nested category object
  const categoryName = job?.category?.title || job?.categoryName || "";
  const locationStr = [job?.city, job?.location].filter(Boolean).join(", ");

  if (!job) {
    return (
      <div
        className="status-container"
        style={{ padding: "100px", textAlign: "center" }}
      >
        <p>No job details found. This can happen if the page is refreshed.</p>
        <GradientButton
          text="Back to Job Listing"
          onClick={() => navigate("/job")}
        />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1 style={{ textTransform: "capitalize" }}>{type} Details</h1>
      </div>

      <div
        className="breadcrumb"
        style={{ cursor: "pointer", textTransform: "capitalize" }}
      >
        <Breadcrumb
          separator={<FiChevronRight size={14} className="ss" />}
          items={[
            { title: <Link to={`/${type}`}>{type} Listing</Link> },
            { title: `${type} Details` },
          ]}
        />
      </div>

      <div className="jobdetails-container">
        <div className="jobdetails-card">
          <img
            src={job?.uploadImage || jobImg}
            alt={job?.projectTitle}
            className="jobdetails-image"
          />

          <div className="jobdetails-content">
            {/* Category tag */}
            {categoryName && (
              <span className="job-tag">{categoryName}</span>
            )}

            {/* Title */}
            <h2 className="job-title">{job?.projectTitle}</h2>

            {/* Meta info row: location, start date, closing date */}
            {(locationStr || job?.startDate || job?.closingDate || job?.quotationsDate) && (
              <div className="job-meta-row">
                {locationStr && (
                  <div className="job-meta-item">
                    <FiMapPin className="job-meta-icon" />
                    <span>{locationStr}</span>
                  </div>
                )}
                {job?.startDate && (
                  <div className="job-meta-item">
                    <FiCalendar className="job-meta-icon" />
                    <span>
                      <span className="job-meta-label">Start:</span>{" "}
                      {formatDate(job.startDate)}
                    </span>
                  </div>
                )}
                {(job?.closingDate || job?.quotationsDate) && (
                  <div className="job-meta-item">
                    <FiClock className="job-meta-icon" />
                    <span>
                      <span className="job-meta-label">
                        {isProject ? "Quotations close:" : "Applications close:"}
                      </span>{" "}
                      {formatDate(job.closingDate || job.quotationsDate)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Posted date */}
            <p className="job-date">
              Posted on{" "}
              {new Date(job?.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {/* Skills */}
            {job?.skillData?.length > 0 && (
              <div className="job-skills">
                <p className="job-meta-item"> Skills required<span>:-</span></p>
                {job.skillData.map((skill, i) => (
                  <span key={i} className="job-skill-tag">
                    {skill?.title}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="job-description">{job?.projectDescription}</p>

            {/* CTA button */}
            {(isMember || (!isLoggedIn && !isProject)) && (
              <div style={{ marginTop: "24px" }}>
                <GradientButton
                  className="change-password-btn"
                  text={isProject ? "Send Quote" : "Apply For Job"}
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate("/login", {
                        state: { from: location.pathname, job, type },
                      });
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadDetails
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={job._id}
        clientId={job.postedBy}
        profileId={profileId}
        uploadButtonText={uploadButtonText}
      />

      <Footer />
    </>
  );
};

export default JobDetail1;