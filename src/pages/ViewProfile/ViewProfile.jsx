import React, { useState, useContext } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./ViewProfile.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Breadcrumb, message, Modal } from "antd";
import { AuthContext } from "../../contexts/AuthContext";
import { admin_verify_member, admin_client_approval } from "../../api";
import { FiChevronRight } from "react-icons/fi";

const ViewProfile = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const record = location.state?.record;
  const approve_url =
    record.page_type === "member" ? admin_verify_member : admin_client_approval;
  const api_id = record.page_type === "member" ? record.memberId : record._id;
  const [status, setStatus] = useState(record.adminApproval);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageTitle, setImageTitle] = useState("");

  console.log(record)

  if (!record) {
    navigate(-1);
    return null;
  }

  const updateMemberStatus = async (type) => {
    try {
      const response = await axios.post(
        approve_url,
        {
          id: api_id,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status) {
        message.success(`Member ${type} successfully`);
      } else {
        message.error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  const openImageModal = (imageSrc, title) => {
    setSelectedImage(imageSrc);
    setImageTitle(title);
    setIsModalVisible(true);
  };

  const closeImageModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
    setImageTitle("");
  };

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          
          <div className="bread-crumb_">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/manage-members"> Members</Link>,
                },

                {
                  title: "View Profile",
                },
              ]}
            />
          </div>

          <div className="breakdown-container1">
            <h3 className="breakdown-title">Profile Status Breakdown</h3>

            <div className="breakdown-box">
              <div className="breakdown-row">
                {record.fullName && (
                  <div>
                    <span>Full Name</span>
                    <p>{record.fullName}</p>
                  </div>
                )}

                {record.email && (
                  <div>
                    <span>Email</span>
                    <p>{record.email}</p>
                  </div>
                )}

                {record.phoneNumber && (
                  <div>
                    <span>Phone Number</span>
                    <p>{record.phoneNumber}</p>
                  </div>
                )}

                {record.whatsappNumber && (
                  <div>
                    <span>WhatsApp Number</span>
                    <p>{record.whatsappNumber}</p>
                  </div>
                )}
                {record.membership && (
                  <div>
                    <span>Membership</span>
                    <p>{record.membership}</p>
                  </div>
                )}

                {record.gender && (
                  <div>
                    <span>Gender</span>
                    <p>{record.gender}</p>
                  </div>
                )}
                {record.categoryTitle && (
                  <div>
                    <span>Category</span>
                    <p>{record.categoryTitle}</p>
                  </div>
                )}
                {Array.isArray(record.skillsTitle) && record.skillsTitle.length > 0 && (
                  <div>
                    <span>Skills</span>
                    <p>{record.skillsTitle.join(", ")}</p>
                  </div>
                )}
                {record.country && (
                  <div>
                    <span>Country</span>
                    <p>{record.country}</p>
                  </div>
                )}
                {record.state && (
                  <div>
                    <span>District, Province Or State</span>
                    <p>{record.state}</p>
                  </div>
                )}
                {record.locality && (
                  <div>
                    <span>Town , Village Or City</span>
                    <p>{record.locality}</p>
                  </div>
                )}
                {record.businessTradingName && (
                  <div>
                    <span>Business or Individual Trading Name</span>
                    <p>{record.businessTradingName}</p>
                  </div>
                )}
                {record.clientType && (
                  <div>
                    <span>Client Type</span>
                    <p>{record.clientType}</p>
                  </div>
                )}

                <div>
                  <span>Status</span>
                  <p className={`status ${status}`}>{status}</p>
                </div>

                {record.idProof && (
                  <div className="image-box">
                    <span>ID Proof</span>
                    <img
                      src={record?.idProof}
                      alt="ID Proof"
                      className="profile-image"
                      onClick={() => openImageModal(record.idProof, "ID Proof")}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {record.selfie && (
                  <div className="image-box">
                    <span>Selfie</span>
                    <img
                      src={record.selfie}
                      alt="Selfie"
                      className="profile-image"
                      onClick={() => openImageModal(record.selfie, "Selfie")}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* {(record.address ||
                  record.city ||
                  record.state ||
                  record.country ||
                  record.postCode) && (
                    <div>
                      <span>Address</span>
                      <p>
                        {[
                          record.address,
                          record.city,
                          record.state,
                          record.country,
                          record.postCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )} */}

              </div>
            </div>

            <div className="btn" style={{ marginTop: "20px" }}>
              {(status === "rejected" || status === "pending") && (
                <GradientButton
                  text="Accept"
                  className="btn-accept"
                  onClick={() => {
                    updateMemberStatus("accepted");
                    navigate(-1);
                  }}
                />
              )}

              {(status === "accepted" || status === "pending") && (
                <GradientButton
                  text="Reject"
                  className="btn-reject"
                  onClick={() => {
                    updateMemberStatus("rejected");
                    navigate(-1);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={imageTitle}
        visible={isModalVisible}
        onCancel={closeImageModal}
        footer={null}
        centered
        width={800}
      >
        <img
          src={selectedImage}
          alt={imageTitle}
          style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain" }}
        />
      </Modal>
    </>
  );
};

export default ViewProfile;
