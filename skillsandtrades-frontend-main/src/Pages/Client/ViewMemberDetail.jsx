import React, { useContext, useState, useEffect } from "react";
import "./ViewMemberDetail.css";
import { Breadcrumb, Button, Spin } from "antd";
import GradientButton from "../../Components/Common/GradientButton";
import ClientNavBar from "./ClientHeader/ClientNavBar";
import TopBar from "../../Components/Common/Header/TopBar";
import ClientSideBar from "../../Components/Client/ClientPannel/ClientSideBar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FileTextOutlined, DownloadOutlined, FilePdfOutlined, FileWordOutlined, FileImageOutlined } from "@ant-design/icons";
import Header from "../../Components/Common/Header/Header";
import axios from "axios";
import { client_qutataion_action, qutation_details } from "../../api";
import { AppContext } from "../../contexts/AppContexts";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";

const ViewMemberDetail = () => {
  const { state } = useLocation();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const quoteId = state?.quote?._id;
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    if (quoteId) { fetchQuoteData(); }
  }, [quoteId]);

  const isImageFile = (url) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const getFileIcon = (url) => {
    const ext = url.split(".").pop()?.toLowerCase();

    if (ext === "pdf") return <FilePdfOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />;
    if (["doc", "docx"].includes(ext)) return <FileWordOutlined style={{ fontSize: 48, color: "#1e90ff" }} />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return <FileImageOutlined style={{ fontSize: 48, color: "#52c41a" }} />;

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
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.code === 200 && response.data.data) {
        // Handle both array and single object responses
        const quoteData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
        setQuote(quoteData);
      }
    } catch (error) {
      console.log(error.response?.data?.error_description);
      toast.error(error.response?.data?.error_description || "Failed to fetch quote details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const qutationAction = async (type) => {
    const isAccept = type === "accepted";
    const setActionLoading = isAccept ? setAcceptLoading : setRejectLoading;

    setActionLoading(true);
    const payloads = {
      id: quote?._id,
      type: type
    };

    try {
      const response = await axios.post(client_qutataion_action, payloads, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.code === 200) {
        toast.success(`Quote ${type}ed successfully`);
        // Refresh the quote data after successful action
        await fetchQuoteData();
      }
    } catch (error) {
      console.log(error.response?.data?.error_description);
      toast.error(error.response?.data?.error_description || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = () => {
    qutationAction("accepted");
  };

  const handleReject = () => {
    qutationAction("rejected");
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No quote data found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="dashboard">
        <ClientSideBar />
        <div className="member-details-container" style={{ cursor: 'pointer' }}>
         
          <div className="breadcrumb">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/client-quote">Member Quote</Link>,
                  },

                  {
                    title: "View Member Details",
                  },
                ]}
              />
            </div>

          <h2 className="section-title">Member Details</h2>

          <div className="details-card">
            <div className="details-row">
              <div>
                <p className="label">Profile ID</p>
                <p className="value">{quote?.memberId}</p>
              </div>
              <div>
                <p className="label">Profile Name</p>
                <p className="value">{quote.fullName}</p>
              </div>
              <div>
                <p className="label">Email Address</p>
                <p className="value">{quote.email}</p>
              </div>
              <div>
                <p className="label">Phone Number</p>
                <p className="value status-active">{quote.phoneNumber}</p>
              </div>
            </div>
          </div>

          <h3 className="sub-title">Additional Information</h3>
          <p className="description-text">{quote.description}</p>

          <h3 className="sub-title">Attached File</h3>
          <div className="file-preview-container">
            {quote.file ? (
              <>
                {isImageFile(quote.file) ? (
                  <img
                    src={quote.file}
                    alt="Member file"
                    className="member-image"
                    style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                  />
                ) : (
                  <div className="non-image-file">
                    <div className="file-icon">
                      {getFileIcon(quote.file)}
                    </div>
                    <p>{getFileNameFromUrl(quote.file)}</p>
                  </div>
                )}

                <div style={{ marginTop: "12px", textAlign: "center" }}>
                  <a
                    href={quote.file}
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

          {quote.clientAction === "pending" ? (
            <div className="action-buttons" style={{ marginTop: '10px' }}>
              <GradientButton
                className="delete_btn"
                text={"Accept Quote"}
                onClick={handleAccept}
                disabled={acceptLoading || rejectLoading}
                loading={acceptLoading}
              />
              <GradientButton
                className="discard_btn"
                text={"Reject Quote"}
                onClick={handleReject}
                disabled={acceptLoading || rejectLoading}
                loading={rejectLoading}
              />
            </div>
          ) : (
            <h4
              style={{
                marginTop: '10px',
                color: quote.clientAction === "accepted" ? 'green' : 'red'
              }}
            >
              This quote is already {quote.clientAction}
            </h4>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewMemberDetail;