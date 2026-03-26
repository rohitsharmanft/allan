import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Spin,
  Rate,
  Input,
  Breadcrumb,
  Tooltip,
  Collapse,
  Modal,
  Empty,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileTextOutlined,
  StarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import GradientButton from "../../../Components/Common/GradientButton";
import Header from "../../../Components/Common/Header/Header";
import Sidebar from "../../../Components/Member/Sidebar";
import { AppContext } from "../../../contexts/AppContexts";
import { Footer } from "antd/es/layout/layout";
import { FiChevronRight } from "react-icons/fi";

const MemberJobDetailsView = () => {
  const { state } = useLocation();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const job = state?.job;

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteFile, setQuoteFile] = useState(null);

  useEffect(() => {
    if (!job) {
      toast.error("Invalid job reference");
      navigate(-1);
    }
  }, [job, navigate]);

  const isImageFile = (url) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const getFileIcon = (url) => {
    const ext = url.split(".").pop()?.toLowerCase();

    if (ext === "pdf")
      return <FilePdfOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />;
    if (["doc", "docx"].includes(ext))
      return <FileWordOutlined style={{ fontSize: 48, color: "#1e90ff" }} />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImageOutlined style={{ fontSize: 48, color: "#52c41a" }} />;

    return <FileTextOutlined style={{ fontSize: 48, color: "#8c8c8c" }} />;
  };

  const getFileNameFromUrl = (url) => {
    try {
      return decodeURIComponent(url.split("/").pop().split("?")[0]);
    } catch {
      return "Attached File";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleSubmitQuote = async () => {
    if (!quoteAmount) {
      toast.error("Please enter a quote amount");
      return;
    }

    setSubmitLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await axios.post(submit_quote_api, {
      //     jobId: job._id,
      //     amount: quoteAmount,
      //     description: quoteDescription,
      //     file: quoteFile
      // }, { headers: { Authorization: `Bearer ${token}` } });

      // if (response.data.code === 200) {
      //     toast.success("Quote submitted successfully!");
      //     setShowQuoteForm(false);
      //     setQuoteAmount("");
      //     setQuoteDescription("");
      //     setQuoteFile(null);
      // }

      toast.success("Quote submitted successfully!");
      setShowQuoteForm(false);
      setQuoteAmount("");
      setQuoteDescription("");
      setQuoteFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit quote");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancelQuote = () => {
    setShowQuoteForm(false);
    setQuoteAmount("");
    setQuoteDescription("");
    setQuoteFile(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!job) return null;

  const statusColor =
    job.clientAction === "accepted"
      ? "#134A45"
      : job.clientAction === "rejected"
        ? "#f5222d"
        : "#faad14";

  return (
    <>
      <Header />
      <div className="dashboard">
        <Sidebar />
        <div className="member-details-container">
          <div className="breadcrumb">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/member-jobs">My Jobs</Link>,
                },
                {
                  title: "Job Details",
                },
              ]}
            />
          </div>

          <h2 className="section-title">Job Details</h2>

          {/* Job Information Card */}
          <div className="details-card">
            <div className="details-row">
              <div>
                <p className="label">Job Title</p>
                <p className="value">{job.jobTittle || "N/A"}</p>
              </div>
              <div>
                <p className="label">Client Name</p>
                <p className="value">{job.clientName || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <h3 className="sub-title">Job Description</h3>
          <div className="details-card">
            <p className="value" style={{ lineHeight: "1.6", color: "#666" }}>
              {job.jobDescription || "No description provided"}
            </p>
          </div>

          {/* Client Action Status */}
          <h3 className="sub-title">Client Action</h3>
          <div className="details-card">
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  color: statusColor,
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {job?.isJobDone === true && "✓ Completed"}
                {job?.isJobDone === false && "⏳ In Progress"}
              </span>
            </div>
            <p style={{ marginTop: "12px", color: "#666", fontSize: "14px" }}>
              Updated at:{" "}
              <span style={{ fontWeight: "600", color: "#333" }}>
                {formatDate(job.updatedAt)}
              </span>
            </p>
          </div>

          {/* Attached Quote File */}
          {job.file && (
            <>
              <h3 className="sub-title">Attached Quote File</h3>
              <div className="file-preview-container">
                {isImageFile(job.file) ? (
                  <img
                    src={job.file}
                    alt="Quote file"
                    className="member-image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="non-image-file">
                    <div className="file-icon">{getFileIcon(job.file)}</div>
                    <p>{getFileNameFromUrl(job.file)}</p>
                  </div>
                )}

                <div style={{ marginTop: "12px", textAlign: "center" }}>
                  <a
                    href={job.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="ant-btn ant-btn-primary"
                  >
                    <DownloadOutlined /> Download File
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Review Section */}
          {job.review && (
            <>
              <h3 className="sub-title">Client Review</h3>
              <div className="details-card">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <StarOutlined /> View Review
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        title="Client Review"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setShowReviewModal(false)}
          >
            Close
          </Button>,
        ]}
        width={600}
      >
        <div style={{ padding: "20px 0" }}>
          {/* Rating Section */}
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "8px",
              }}
            >
              Rating
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Rate
                disabled
                allowHalf
                value={job.rating || 0}
                style={{ fontSize: "24px" }}
              />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1890ff",
                }}
              >
                {job.rating || 0} / 5
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "8px",
              }}
            >
              Review
            </p>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "4px",
                borderLeft: "4px solid #1890ff",
                lineHeight: "1.6",
                color: "#333",
              }}
            >
              {job.review}
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
};

export default MemberJobDetailsView;
