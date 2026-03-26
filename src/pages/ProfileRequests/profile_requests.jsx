import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Table, message, Button, Space, Tag, Divider, Tooltip } from "antd";
import { admin_profile_change_list, admin_profile_change_action } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./Profile_request.css";

const AdminProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        admin_profile_change_list,
        { page: 1, limit: 10 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status) {
        const rawItems = response.data.data.data || [];

        const transformed = rawItems.map((item) => {
          const oldData = {
            fullName: item.oldData?.fullName || item.fullName || "-",
            phoneNumber: item.oldData?.phoneNumber || "-",
            whatsappNumber: item.oldData?.whatsappNumber || "-",
            category: item.oldData?.category || "-",
            businessTradingName: item.oldData?.businessTradingName || "-",
            workDescription: item.oldData?.workDescription || "-",
            overview: item.oldData?.overview || "-",
            socialLinks: item.oldData?.socialLinks || {},
            skills: item.oldData?.skills || [],
          };

          const newData = {
            ...oldData,
            ...item.newData,
            skills: item.newData?.skills || item.newData?.skillIds || item.oldData?.skills || [],
            socialLinks: {
              ...(oldData.socialLinks || {}),
              ...(item.newData?.socialLinks || {}),
            },
          };

          return {
            key: item._id || item.profileId,
            ...item,
            oldData,
            newData,
          };
        });

        setProfiles(transformed);
      } else {
        message.error(response.data.message || "Failed to load requests");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch profile change requests");
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (type, record) => {
    try {
      const response = await axios.post(
        admin_profile_change_action,
        { id: record.profileId || record._id, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status) {
        fetchMembers();
        message.success(`Profile update ${type} successfully`);
      } else {
        message.error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  const ComparisonCell = ({ oldVal, newVal, type = "text" }) => {
    const normalize = (val) => {
      if (val === undefined || val === null) return "";
      if (typeof val === "string") return val.trim();
      return val;
    };

    const oldNormalized = normalize(oldVal);
    const newNormalized = normalize(newVal);

    const isDifferent =
      JSON.stringify(oldNormalized) !== JSON.stringify(newNormalized);

    const renderValue = (value, isNew = false) => {
      if (value === "" || value === null || value === undefined) {
        return <span className="empty-value">—</span>;
      }

      if (type === "skills") {
        if (!Array.isArray(value) || value.length === 0) {
          return <span className="empty-value">—</span>;
        }
        return (
          <div className="skills-container">
            {value.map((skill, i) => (
              <Tag
                color={isNew ? "green" : "default"}
                key={i}
                className="skill-tag"
              >
                {typeof skill === "string" ? skill : skill?.title || skill?.name || "—"}
              </Tag>
            ))}
          </div>
        );
      }

      if (type === "social") {
        if (!value || typeof value !== "object" || Object.keys(value).length === 0) {
          return <span className="empty-value">—</span>;
        }

        // Filter out internal MongoDB fields and empty/invalid values
        const validLinks = Object.entries(value).filter(([key, url]) => {
          if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return false;
          if (!url || typeof url !== "string" || url.trim() === "") return false;
          return true;
        });

        if (validLinks.length === 0) {
          return <span className="empty-value">—</span>;
        }

        return (
          <div className="social-links-modern">
            {validLinks.map(([platform, url]) => (
              <Tooltip title={url} key={platform}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-link ${isNew ? "new-link" : ""}`}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              </Tooltip>
            ))}
          </div>
        );
      }

      return typeof value === "string" ? value.trim() : String(value);
    };

    if (!isDifferent) {
      return (
        <div className="comparison-unchanged">
          {renderValue(oldVal)}
        </div>
      );
    }

    return (
      <div className="comparison-container changed">
        <div className="old-value">
          <s className="strikethrough">{renderValue(oldVal)}</s>
        </div>

        <div className="new-value">
          {renderValue(newVal, true)}
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "Member",
      dataIndex: "fullName",
      key: "fullName",
      width: 160,
      fixed: "",
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.fullName || "-"}
          newVal={record.newData?.fullName || "-"}
        />
      ),
    },
    {
      title: "Phone / WhatsApp",
      key: "contact",
      width: 180,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.phoneNumber || record.whatsappNumber || "-"}
          newVal={record.newData?.phoneNumber || record.newData?.whatsappNumber || "-"}
        />
      ),
    },
    {
      title: "Business Name",
      key: "businessTradingName",
      width: 220,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.businessTradingName}
          newVal={record.newData?.businessTradingName}
        />
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 160,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.category}
          newVal={record.newData?.category}
        />
      ),
    },
    {
      title: "Skills",
      key: "skills",
      width: 280,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.skills}
          newVal={record.newData?.skills}
          type="skills"
        />
      ),
    },
    {
      title: "Social Links",
      key: "socialLinks",
      width: 220,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.socialLinks}
          newVal={record.newData?.socialLinks}
          type="social"
        />
      ),
    },
    {
      title: "Work Description",
      key: "workDescription",
      width: 260,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.workDescription}
          newVal={record.newData?.workDescription}
        />
      ),
    },
    {
      title: "Overview",
      key: "overview",
      width: 320,
      render: (_, record) => (
        <ComparisonCell
          oldVal={record.overview}
          newVal={record.newData?.overview}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      fixed: "",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => updateMemberStatus("approved", record)}
          >
            Accept
          </Button>
          <Button
            danger
            size="small"
            onClick={() => updateMemberStatus("rejected", record)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader />
      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>
        <div className="dashboard-right">
          <div className="admin-profile-requests-container">
            <div className="profile-requests-header">
              <h2>Profile Update Requests</h2>
              {/* <p style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
                Current data (top) • Proposed changes (bottom, highlighted)
              </p> */}
            </div>
            <div className="table-box-white">
              <Table
                columns={columns}
                dataSource={profiles}
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: "max-content" }}
                rowKey="key"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfilesPage;