import React, { useState, useEffect, useContext } from "react";
import { Table, Pagination, Tooltip, Spin, message, Input, Typography } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import "./MemberTable.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import { useNavigate } from "react-router-dom";
import ExportDataModal from "../ExportData/ExportDataModal";
import { admin_get_all_category, admin_get_all_member } from "../../api";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
const { Text } = Typography;

const MemberTable = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedMembership, setSelectedMembership] = useState("Premium");
  const { token } = useContext(AuthContext);
  const [memberType, setMemberType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  const prepareExportData = async () => {
    setExportLoading(true);
    try {
      const response = await axios.post(
        admin_get_all_member,
        {
          membership: "",
          type: "",
          offset: 0,
          limit: 10000,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status) {
        const transformed = response.data.data.data.map(member => ({
          key: member._id,
          fullName: member.fullName,
          email: member.email,
          phoneNumber: member.phoneNumber,
          gender: member.gender,
          profileCount: member.profileCount || 0,
          membership: member.membership,
          categoryTitle: member.categoryTitle,
          adminApproval: member.adminApproval,
          country: member.country,
        }));

        setExportData(transformed);
        setOpen(true);
      }
    } catch (err) {
      message.error("Failed to load data for export");
    } finally {
      setExportLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(admin_get_all_category, { headers: { Authorization: `Bearer ${token}` }, });
      if (res.data.status && res.data.code === 200) {
        setCategories(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch categories");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      setFilteredData(members);
      return;
    }
    setIsSearching(true);
    const lowerSearch = searchText.toLowerCase().trim();
    const filtered = allMembers.filter(
      (item) =>
        item.fullName?.toLowerCase().startsWith(lowerSearch) ||
        item.email?.toLowerCase().startsWith(lowerSearch),
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchText, allMembers, members]);

  useEffect(() => { fetchMembers(selectedMembership, memberType); }, [selectedMembership, memberType]);

  const fetchMembers = async (membershipType, type) => {
    setLoading(true);
    try {
      const response = await axios.post(admin_get_all_member,
        {
          membership: membershipType,
          type: type,
          offset: 0,
          limit: 10000,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data && response.data.status) {
        const transformedData = response.data.data.data.map((member) => ({
          key: member._id,
          memberId: member._id,
          _id: member._id,
          fullName: member.fullName,
          email: member.email,
          profileCount: member.profileCount || 0,
          membership: member.membership,
          phoneNumber: member.phoneNumber,
          address: member.address,
          gender: member.gender,
          memberCategory: member.memberCategory,
          adminApproval: member.adminApproval,
          idProof: member?.idProof,
          selfie: member?.selfie,
          page_type: "member",
          status: member?.adminApproval,
          country: member?.country,
          state: member?.state,
          locality: member?.locality,
          businessTradingName: member?.businessTradingName,
          categoryTitle: member?.categoryTitle,
          skillsTitle: member?.skillsTitle,
          password: member?.decryptPassword
        }));
        setAllMembers(transformedData);
        setMembers(transformedData);
        setFilteredData(transformedData);
        setTotal(response.data.data.pagination.totalCount);
        setCurrentPage(1);
      } else {
        message.error(response.data.message || "Failed to load members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Failed to load members");
      setMembers([]);
      setAllMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipFilter = (membershipType, type) => {
    setMemberType(type);
    setSelectedMembership(membershipType);
    setSearchText("");
  };

  const getPaginatedData = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 120,
      render: (fullName) => <span style={{textTransform:'capitalize'}}>{fullName}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 110,
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "test",
    //   width: 110,
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      align: "center",
      render: (status) => <span style={{textTransform:'capitalize'}}>{status}</span>,
    },
    {
      title: "Membership",
      dataIndex: "membership",
      key: "membership",
      width: 90,
      render: (membership) => <span style={{textTransform:'capitalize'}}>{membership}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="action-icons">
          <Tooltip title="View">
            <EyeOutlined
              className="icon view"
              onClick={() => navigate(`/view-profile`, { state: { record } })}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="member-container">
        <div className="search-box">
          <SearchOutlined className="search-icon" />
          <Input
            placeholder="Search by name or email..."
            bordered={false}
            className="search_input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <div className="reviews-btn">
          <div className="btn1">
            <GradientButton
              text="Premium"
              className={selectedMembership === "premium" ? "active" : ""}
              onClick={() => handleMembershipFilter("Premium", "")}
            />
            <GradientButton
              text="Basic"
              className={selectedMembership === "basic" ? "active" : ""}
              onClick={() => handleMembershipFilter("Basic", "")}
            />
            <GradientButton
              text="Free"
              className={selectedMembership === "free" ? "active" : ""}
              onClick={() => handleMembershipFilter("Free", "")}
            />
            <GradientButton
              text="Recently Signed Up"
              className={selectedMembership === "free" ? "active" : ""}
              onClick={() => handleMembershipFilter("", "pending")}
            />
          </div>
          <div className="btn2">
            <GradientButton
              text={exportLoading ? "Preparing..." : "Export Data"}
              onClick={prepareExportData}
              loading={exportLoading}
              disabled={exportLoading}
            />
          </div>
        </div>
        <div className="table-box">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={getPaginatedData()}
              pagination={false}
              rowKey="key"
              scroll={{ x: "max-content" }}
              locale={{ emptyText: "No members found" }}
            />
          </Spin>
          <div className="pagination-box">
            <Pagination
              current={currentPage}
              total={isSearching ? filteredData.length : total}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      {exportLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px 48px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              minWidth: "280px",
            }}
          >
            <Spin size="large" />
            <Text
              strong
              style={{ display: "block", marginTop: 16, fontSize: 16 }}
            >
              Preparing export data...
            </Text>
            <Text type="secondary" style={{ fontSize: 14 }}>
              This may take a few seconds
            </Text>
          </div>
        </div>
      )}

      <ExportDataModal
        open={open}
        onCancel={() => setOpen(false)}
        onExport={() => setOpen(false)}
        data={exportData}
        dataType="member"
        categories={categories}
      />
    </>
  );
};

export default MemberTable;