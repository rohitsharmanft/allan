import React, { useContext } from "react";
import "./ClientJobDetail.css";
import job8 from "../../assets/images/img8.png";
import GradientButton from "../../Components/Common/GradientButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { user_delete_job } from "../../api";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/AppContexts";
import ClientSideBar from "../../Components/Client/ClientPannel/ClientSideBar";
import Footer from "../../Components/Common/Footer/Footer";
import Header from "../../Components/Common/Header/Header";
import { Breadcrumb } from "antd";
import { FiChevronRight, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";

const ClientJobDetail = () => {
  const location = useLocation();
  const data = location.state.job;
  const type = location.state.type;
  const jobId = data?._id;
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const capitalizedType =
    type?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || "";

  const handleDelete = async () => {
    try {
      const response = await axios.delete(user_delete_job, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: jobId },
      });
      if (response.data.code === 200) {
        toast.success(`${capitalizedType} deleted successfully`);
        navigate(-1);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error_description || "Failed to delete");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Build location string from available fields
  const locationStr = [data?.city, data?.location]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>

      <div className="dashboard">
        <ClientSideBar />
        <div className="jobdetails_container">
          <div className="breadcrumb">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                { title: <Link to={`/client-${type}`}>{capitalizedType}s</Link> },
                { title: "View Details" },
              ]}
            />
          </div>

          <div className="jobdetails-card">
            {/* Image */}
            <img
              src={data?.uploadImage || job8}
              alt={data?.projectTitle}
              className="jobdetails-image"
            />

            <div className="jobdetails-content">
              {/* Category tag */}
              <span className="job-tag">{data?.categoryName}</span>

              {/* Title */}
              <h2 className="job-title">{data?.projectTitle}</h2>

              {/* Meta info row: location, start date, closing date */}
              <div className="job-meta-row">
                {locationStr && (
                  <div className="job-meta-item">
                    <FiMapPin className="job-meta-icon" />
                    <span>{locationStr}</span>
                  </div>
                )}
                {data?.startDate && (
                  <div className="job-meta-item">
                    <FiCalendar className="job-meta-icon" />
                    <span>
                      <span className="job-meta-label">Start:</span>{" "}
                      {formatDate(data.startDate)}
                    </span>
                  </div>
                )}
                {(data?.closingDate || data?.quotationsDate) && (
                  <div className="job-meta-item">
                    <FiClock className="job-meta-icon" />
                    <span>
                      <span className="job-meta-label">
                        {type === "project" ? "Quotations close:" : "Applications close:"}
                      </span>{" "}
                      {formatDate(data.closingDate || data.quotationsDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Posted date */}
              <p className="job-date">
                Posted on{" "}
                {new Date(data?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* Skills */}
              {data?.skillName?.length > 0 && (
                <div className="job-skills">
                  <p className="job-meta-item"> Skills required<span>:-</span></p>
                  {data.skillName.map((skill, i) => (
                    <span key={i} className="job-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="job-description">{data?.projectDescription}</p>

              {/* Delete button */}
              <GradientButton
                className="gb"
                text="Delete"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ClientJobDetail;