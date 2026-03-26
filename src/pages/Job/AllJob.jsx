import React, { useState, useEffect, useContext } from "react";
import { Table, Input, Pagination, Tooltip, Select } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import "./AllJob.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import axios from "axios";
import { API_URL, admin_get_all_job } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../../common/Modal/DeleteConfirmModal";
import { toast } from "react-toastify";
import { africanCountries } from "../../utils/Countries/Countries";
const { Option } = Select;

const AllJobs = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { token } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("");

  // Derived filtered list (search + country + jobs > 0)
  const filteredJobs = allJobs.filter((job) => {
    const lowerSearch = searchText.toLowerCase().trim();
    const lowerCountryInput = selectedCountry.toLowerCase().trim();

    const matchesSearch =
      !lowerSearch ||
      job.name?.toLowerCase().includes(lowerSearch) ||
      job.email?.toLowerCase().includes(lowerSearch);

    const matchesCountry =
      !lowerCountryInput ||
      (job.country || "").toLowerCase().includes(lowerCountryInput);

    const hasJobs = job.jobs > 0;

    return matchesSearch && matchesCountry && hasJobs;
  });

  // Data shown on current page
  const paginatedData = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "S No.",
      dataIndex: "sno",
      key: "sno",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Job Posted",
      dataIndex: "jobs",
      key: "jobs",
      width: 110,
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
              onClick={() => navigate("/view-job", { state: { user: record } })}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              className="icon delete"
              onClick={() => {
                setSelectedUser(record);
                setOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!selectedUser?.key || deleting) return;

    setDeleting(true);

    try {
      const response = await axios.put(
        `${API_URL}/Admin/api/clients/${selectedUser.key}/jobs/delete`,
        { type: "job" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success("Jobs deleted successfully!");
        fetchClientsWithJobs(); // refresh everything
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error_description || "Delete failed");
    } finally {
      setDeleting(false);
      setOpen(false);
      setSelectedUser(null);
    }
  };

  const fetchClientsWithJobs = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const payload = {
        type: "job",
        // country: selectedCountry || undefined,     // ← add this if backend supports country filter
      };

      const response = await axios.post(admin_get_all_job, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.status === true) {
        const users = response.data.data.data || [];

        const formatted = users.map((user, index) => ({
          key: user._id,
          sno: index + 1, // temporary - real sno calculated per page
          name: user.fullName || "N/A",
          email: user.email || "N/A",
          jobs: user.jobCount ?? 0,
          country: user.country || "", // ← must be present in API response
        }));

        setAllJobs(formatted);
        setCurrentPage(1);
      } else {
        toast.error(response.data?.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong while fetching users");
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientsWithJobs();
  }, []); // fetch once → filtering is client-side

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCountry]);

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          <h2 className="page-title">All Jobs</h2>

          <div className="jobs-page">
            <div className="search-select-container">
              <div className="search-box-">
                <SearchOutlined className="search-icon" />
                <Input
                  placeholder="Search by name or email..."
                  bordered={false}
                  className="search_input-"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </div>

              <div className="select-box">
                <Select
                  showSearch
                  allowClear
                  placeholder="Filter by country (type to search)..."
                  value={selectedCountry || undefined}
                  onChange={(val) => {
                    setSelectedCountry(val || "");
                    setCurrentPage(1);
                  }}
                  onSearch={(val) => setSelectedCountry(val)} // live update while typing
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: 250 }}
                >
                  {africanCountries.map((country) => (
                    <Option key={country} value={country}>
                      {country}
                    </Option>
                  ))}
                </Select>

                {/* <Select
                  id="category-filter"
                  value={selectedCategory || undefined}
                  onChange={(value) => setSelectedCategory(value || "")}
                  placeholder="All Categories"
                  allowClear
                  style={{ width: 250 }}
                >
                  {categories?.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name || cat.title || "Unnamed"}
                    </Option>
                  ))}
                </Select> */}
              </div>
            </div>

            <div className="table-box">
              <Table
                columns={columns}
                dataSource={paginatedData.map((item, idx) => ({
                  ...item,
                  sno: (currentPage - 1) * pageSize + idx + 1,
                }))}
                loading={loading}
                pagination={false}
                rowKey="key"
              />
              <div className="pagination-box">
                <Pagination
                  current={currentPage}
                  total={filteredJobs.length}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  responsive
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        text={"Are You Sure You Want To Delete This Client's All Jobs?"}
      />
    </>
  );
};

export default AllJobs;