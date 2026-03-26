import React, { useState, useContext } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./ViewProfile.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Breadcrumb, message } from "antd";
import { AuthContext } from "../../contexts/AuthContext";
import { admin_verify_member, admin_client_approval } from "../../api";
import { FiChevronRight } from "react-icons/fi";

const ViewProfile1 = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const record = location.state?.record;
  const approve_url =
    record.page_type === "member" ? admin_verify_member : admin_client_approval;
  const api_id = record.page_type === "member" ? record.memberId : record._id;

  if (!record) {
    navigate(-1);
    return null;
  }
  // console.log(api_id)

  const [status, setStatus] = useState(record.adminApproval);

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
        },
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
                  title: <Link to="/manage-clients"> Clients</Link>,
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
                {record.memberCategory && (
                  <div>
                    <span>Member Category</span>
                    <p>{record.memberCategory}</p>
                  </div>
                )}
                {record.gender && (
                  <div>
                    <span>Gender</span>
                    <p>{record.gender}</p>
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
                    <span>State</span>
                    <p>{record.state}</p>
                  </div>
                )}
                {record.city && (
                  <div>
                    <span>City</span>
                    <p>{record.city}</p>
                  </div>
                )}
                {/* {record.clientType && (
                  <div>
                    <span>Client Type</span>
                    <p>{record.clientType}</p>
                  </div>
                )} */}
                {/* {record.profileCount && (
                  <div>
                    <span>Profle Count</span>
                    <p>{record.profileCount}</p>
                  </div>
                )} */}
                {/* Status always visible */}
                <div>
                  <span>Status</span>
                  <p className={`status ${status}`}>
                    {status?.charAt(0).toUpperCase() + status?.slice(1)}
                  </p>
                </div>
                {/* 
                {(record.address ||
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
    </>
  );
};

export default ViewProfile1;
