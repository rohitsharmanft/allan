import React, { useContext, useState, useEffect } from "react";
import { Button, Spin, Rate, Input, Modal, Breadcrumb } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FileTextOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import GradientButton from "../../../Components/Common/GradientButton";
import Header from "../../../Components/Common/Header/Header";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import { AppContext } from "../../../contexts/AppContexts";
import {
  client_create_rating,
  get_rating_by_quoteId,
  job_done,
  qutation_details,
} from "../../../api";
import { FiChevronRight } from "react-icons/fi";

const QuoteDetailsView = () => {
  const { state } = useLocation();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const quoteId = state?.job?._id;

  console.log(quoteId);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobDoneLoading, setJobDoneLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    setJobCompleted(quote?.isJobDone);
  }, [quote]);

  useEffect(() => {
    if (quoteId) {
      fetchQuoteData();
      fetchExistingReview();
    } else {
      toast.error("Invalid job reference");
      navigate(-1);
    }
  }, [quoteId]);

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

  const fetchQuoteData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${qutation_details}/${quoteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200 && response.data.data) {
        const quoteData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
        setQuote(quoteData);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description ||
          "Failed to fetch quote details",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingReview = async () => {
    try {
      const endpoint = `${get_rating_by_quoteId}/${quoteId}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Review API Response:", response.data);

      if (
        response.data.code === 200 &&
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const reviewData = response.data.data[0];
        console.log("Review data found:", reviewData);
        setExistingReview({
          _id: reviewData._id,
          rating: reviewData.rating,
          comment: reviewData.review,
        });
      } else if (
        response.data.status === true &&
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const reviewData = response.data.data[0];
        console.log("Review data found:", reviewData);
        setExistingReview({
          _id: reviewData._id,
          rating: reviewData.rating,
          comment: reviewData.review,
        });
      } else {
        console.log("No review data in response");
        setExistingReview(null);
      }
    } catch (error) {
      console.error(
        "Error fetching review:",
        error.response?.data || error.message,
      );
      console.log("No existing review found or API error");
      setExistingReview(null);
    }
  };

  const handleJobDone = async () => {
    setJobDoneLoading(true);
    try {
      const response = await axios.get(`${job_done}/${quoteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.code === 200) {
        toast.success("Job marked as complete!");
        setJobCompleted(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description || "Failed to update status",
      );
    } finally {
      setJobDoneLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please provide a star rating");
      return;
    }

    setReviewLoading(true);
    try {
      const payload = {
        rating: rating.toString(),
        memberId: quote?.memberId,
        review: reviewComment || "",
        memberProfileId: quote?.profileId || "",
        jobId: quote?.jobId || "",
        quoteId: quoteId,
      };
      const response = await axios.post(client_create_rating, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.code === 200 || response.data.success) {
        toast.success(
          isEditingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!",
        );
        setExistingReview({
          _id: response.data.data?._id,
          rating: rating,
          comment: reviewComment,
        });
        setShowReviewForm(false);
        setIsEditingReview(false);
        setRating(0);
        setReviewComment("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description ||
          error.response?.data?.message ||
          "Failed to submit review",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = () => {
    setRating(existingReview.rating);
    setReviewComment(existingReview.comment);
    setIsEditingReview(true);
    setShowReviewForm(true);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setIsEditingReview(false);
    setRating(0);
    setReviewComment("");
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

  return (
    <>
      <Header />
      <div className="dashboard">
        <ClientSideBar />
        <div className="member-details-container" style={{ cursor: "pointer" }}>
          <div className="breadcrumb">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: (
                    <Link to="/assigned-job-listing">My Assigned Jobs</Link>
                  ),
                },

                {
                  title: "Quote Details",
                },
              ]}
            />
          </div>

          <h2 className="section-title">Quote Details</h2>

          <div className="details-card">
            <div className="details-row">
              <div>
                <p className="label">Profile ID</p>
                <p className="value">{quote?.memberId}</p>
              </div>
              <div>
                <p className="label">Profile Name</p>
                <p className="value">{quote?.fullName}</p>
              </div>
              <div>
                <p className="label">Email Address</p>
                <p className="value">{quote?.email}</p>
              </div>
              <div>
                <p className="label">Phone Number</p>
                <p className="value status-active">{quote?.phoneNumber}</p>
              </div>
            </div>
          </div>

          <h3 className="sub-title">Additional Information</h3>
          <p className="description-text">{quote?.description}</p>

          <h3 className="sub-title">Attached File</h3>
          <div className="file-preview-container">
            {quote?.file ? (
              <>
                {isImageFile(quote?.file) ? (
                  <img
                    src={quote?.file}
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
                    <div className="file-icon">{getFileIcon(quote?.file)}</div>
                    <p>{getFileNameFromUrl(quote?.file)}</p>
                  </div>
                )}

                <div style={{ marginTop: "12px", textAlign: "center" }}>
                  <a
                    href={quote?.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="ant-btn ant-btn-primary"
                  >
                    <DownloadOutlined /> Download File
                  </a>
                </div>
              </>
            ) : (
              <p>No file attached</p>
            )}
          </div>

          {!jobCompleted ? (
            <div className="action-buttons" style={{ marginTop: "20px" }}>
              <GradientButton
                className="change-password-btn "
                text={"Job Done"}
                onClick={handleJobDone}
                loading={jobDoneLoading}
                disabled={jobDoneLoading}
              />
            </div>
          ) : (
            <>
              <h4
                style={{
                  marginTop: "20px",
                  color: "#52c41a",
                  fontWeight: "bold",
                }}
              >
                ✓ Job Completed
              </h4>

              {existingReview && !showReviewForm ? (
                <div
                  className="review-display-container"
                  style={{ marginTop: "30px" }}
                >
                  <div className="details-card">
                    <h3 className="sub-title" style={{ marginBottom: "20px" }}>
                      Your Review
                    </h3>

                    <div style={{ marginBottom: "20px" }}>
                      <p className="label">Rating</p>
                      <div style={{ fontSize: "32px" }}>
                        <Rate
                          disabled
                          allowHalf
                          value={existingReview.rating}
                          style={{ fontSize: 40 }}
                        />
                      </div>
                      <p
                        style={{
                          color: "#999",
                          marginTop: "10px",
                          fontSize: "12px",
                        }}
                      >
                        You rated this job {existingReview.rating} star
                        {existingReview.rating > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <p className="label">Your Review</p>
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          minHeight: "100px",
                          lineHeight: "1.6",
                        }}
                      >
                        {existingReview.comment || (
                          <em style={{ color: "#999" }}>No comment provided</em>
                        )}
                      </div>
                    </div>

                    <div className="action-buttons">
                      <GradientButton
                        className="change-password-btn "
                        text={"Update Review"}
                        onClick={handleEditReview}
                      />
                    </div>
                  </div>
                </div>
              ) : !showReviewForm ? (
                <div className="action-buttons" style={{ marginTop: "20px" }}>
                  <GradientButton
                    className="change-password-btn "
                    text={"Leave a Review"}
                    onClick={() => {
                      setShowReviewForm(true);
                      setIsEditingReview(false);
                    }}
                  />
                </div>
              ) : (
                <div
                  className="review-form-container"
                  style={{ marginTop: "30px" }}
                >
                  <div className="details-card">
                    <h3 className="sub-title" style={{ marginBottom: "20px" }}>
                      {isEditingReview
                        ? "Update Your Review"
                        : "Leave a Review"}
                    </h3>

                    <div style={{ marginBottom: "20px" }}>
                      <p className="label">Rating</p>
                      <div style={{ fontSize: "32px" }}>
                        <Rate
                          allowHalf
                          value={rating}
                          onChange={setRating}
                          style={{ fontSize: 40 }}
                        />
                      </div>
                      {rating > 0 && (
                        <p
                          style={{
                            color: "#999",
                            marginTop: "10px",
                            fontSize: "12px",
                          }}
                        >
                          You rated this job {rating} star
                          {rating > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <p className="label">Your Review</p>
                      <Input.TextArea
                        rows={5}
                        placeholder="Share your experience with this job. What went well? What could be improved?"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        maxLength={500}
                        showCount
                        style={{
                          resize: "none",
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                          padding: "12px",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          minHeight: "100px",
                          width: "100%",
                        }}
                      />
                    </div>
                    <div className="action-buttons">
                      <GradientButton
                        className="change-password-btn "
                        text={
                          isEditingReview ? "Update Review" : "Submit Review"
                        }
                        onClick={handleSubmitReview}
                        loading={reviewLoading}
                        disabled={reviewLoading || rating === 0}
                      />
                      <GradientButton
                        className="dchange-password-btn "
                        text={"Cancel"}
                        onClick={handleCancelReview}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default QuoteDetailsView;
