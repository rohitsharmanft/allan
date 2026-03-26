import React, { useState, useEffect, useContext } from "react";
import { Table, Pagination, Tooltip, Spin, Input } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import "./ClientTable.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import { useNavigate } from "react-router-dom";
import ExportDataModal from "../ExportData/ExportDataModal";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { admin_client_list, admin_get_all_category } from "../../api";
import { toast } from "react-toastify";

const ClientTable = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]); // Store all clients for global search
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [selectedType, setSelectedType] = useState("accepted");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(admin_get_all_category, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status && res.data.code === 200) {
        setCategories(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      setFilteredData(clients);
      return;
    }

    setIsSearching(true);
    const lowerSearch = searchText.toLowerCase().trim();

    const filtered = allClients.filter((item) =>
      item.name?.toLowerCase().startsWith(lowerSearch) ||
      item.email?.toLowerCase().startsWith(lowerSearch)
    );

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchText, allClients, clients]);

  // Fetch clients when filters change
  useEffect(() => {
    fetchClients(selectedType);
  }, [selectedType]);

  const fetchClients = async (type) => {
    setLoading(true);

    try {
      const response = await axios.post(
        admin_client_list,
        {
          offset: 0,
          limit: 10000, // Fetch large limit to get all clients
          type: type === "all" ? undefined : type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data?.status) {
        toast.error(response.data?.message || "Failed to fetch clients");
        return;
      }

      const { data, pagination } = response.data.data;

      const formatted = data.map((client) => ({
        key: client._id,
        id: client._id,
        name: client.fullName,
        email: client.email,
        phone: client.phoneNumber,
        gender: client.gender,
        country: client.country,
        city: client.city,
        approval: client.adminApproval || "pending",
        state: client.state,
        raw: client,
        page_type: "client",
      }));

      setAllClients(formatted);
      setClients(formatted);
      setFilteredData(formatted);
      setTotal(pagination.totalCount || 0);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while loading clients");
      setClients([]);
      setAllClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    setSearchText(""); // Reset search when changing filters
  };

  // Get paginated data for current page
  const getPaginatedData = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (fullName) => <span style={{textTransform:'capitalize'}}>{fullName}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (v) => v || "-",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (v) => v || "-",
    },
    // {
    //   title: "Gender",
    //   dataIndex: "gender",
    //   key: "gender",
    //   width: 100,
    //   render: (v) =>
    //     v ? <span style={{ textTransform: "capitalize" }}>{v}</span> : "-",
    // },
    {
      title: "Country",
      key: "country",
      width: 150,
      render: (_, r) => [r.country].filter(Boolean).join(", ") || "-",
    },
    {
      title: "Approval",
      dataIndex: "approval",
      key: "approval",
      width: 120,
      render: (v) => (
        <span style={{ textTransform: "capitalize" }}>{v}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      // fixed: "right",
      render: (_, record) => (
        <Tooltip title="View">
          <EyeOutlined
            className="icon view"
            onClick={() =>
              navigate("/client-profile", {
                state: { record: record.raw },
              })
            }
          />
        </Tooltip>
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
              text="Accepted Clients"
              className={selectedType === "accepted" ? "active" : ""}
              onClick={() => handleTypeFilter("accepted")}
            />
            <GradientButton
              text="Rejected Clients"
              className={selectedType === "rejected" ? "active" : ""}
              onClick={() => handleTypeFilter("rejected")}
            />
            <GradientButton
              text="Pending Clients"
              className={selectedType === "pending" ? "active" : ""}
              onClick={() => handleTypeFilter("pending")}
            />
          </div>

          <div className="btn2">
            <GradientButton
              text="Export Data"
              onClick={() => setOpen(true)}
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
              scroll={{ x: 1100 }}
              locale={{ emptyText: "No clients found" }}
            />
          </Spin>

          <div className="pagination-box">
            <Pagination
              current={currentPage}
              total={isSearching ? filteredData.length : total}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <ExportDataModal
        open={open}
        onCancel={() => setOpen(false)}
        onExport={() => setOpen(false)}
        data={clients}
        dataType="client"
        categories={categories}
      />
    </>
  );
};

export default ClientTable;