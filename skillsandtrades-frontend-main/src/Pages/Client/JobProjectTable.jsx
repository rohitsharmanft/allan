import React, { useContext, useEffect, useState } from "react";
import { Table, Pagination, Tooltip, Space, Button, Tabs } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ClientNavBar from "./ClientHeader/ClientNavBar";
import ClientSideBar from "../../Components/Client/ClientPannel/ClientSideBar";
import axios from "axios";
import { AppContext } from "../../contexts/AppContexts";
import TopBar from "../../Components/Common/Header/TopBar";
import Footer from "../../Components/Common/Footer/Footer";
import { job_list } from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Common/Header/Header";

const JobProjectTable = () => {
  const { token, user, refreshProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => { refreshProfile(); }, []);

  const id = user?._id;

  const fetchJobsAndProjects = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const jobRes = await axios.post(
        job_list,
        { id: id, type: "job" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (jobRes.data.code === 200 && jobRes.data.data) {
        const jobData = Array.isArray(jobRes.data.data) ? jobRes.data.data : [];
        console.log("API returned jobs:", jobData);
        setJobs(jobData);
      }
      const projectRes = await axios.post(
        job_list,
        { id: id, type: "project" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (projectRes.data.code === 200 && projectRes.data.data) {
        const projectData = Array.isArray(projectRes.data.data) ? projectRes.data.data : [];
        console.log("API returned projects:", projectData);
        setProjects(projectData);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobsAndProjects(pagination.current, pagination.pageSize);
    }
  }, [id]);

  const formatTableData = (data, pageSize, currentPage) => {
    return data.map((item, idx) => ({
      key: item._id,
      serial: (currentPage - 1) * pageSize + idx + 1,
      title: item.projectTitle || item.title || "N/A",
      categoryName: item.categoryName || "N/A",
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
      raw: item,
    }));
  };

  const handleTableChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: pagination.total });
    fetchJobsAndProjects(page, pageSize);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPagination({ current: 1, pageSize: 10, total: 0 });
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "serial",
      key: "serial",
      width: 80,
      align: "center",
    },
    {
      title: "Project Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Quotes">
            <EyeOutlined
              className="icon view"
              onClick={() => handleView(record.raw, activeTab)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleView = (item, type) => {
    navigate(`/client-quote`, { state: { [type]: item } });
    console.log(`Full ${type} object:`, item);
  };

  const jobTableData = formatTableData(jobs, pagination.pageSize, pagination.current);
  const projectTableData = formatTableData(projects, pagination.pageSize, pagination.current);
  const currentTableData = activeTab === "jobs" ? jobTableData : projectTableData;
  const currentTotal = activeTab === "jobs" ? jobs.length : projects.length;

  const tabItems = [
    {
      key: "jobs",
      label: "Jobs",
      children: (
        <div className="table-box">
          <Table
            columns={columns}
            dataSource={currentTableData}
            loading={loading}
            pagination={false}
            scroll={{ x: 1000 }}
          />
          <div className="pagination-box">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={currentTotal}
              onChange={handleTableChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
            />
          </div>
        </div>
      ),
    },
    {
      key: "projects",
      label: "Projects",
      children: (
        <div className="table-box">
          <Table
            columns={columns}
            dataSource={currentTableData}
            loading={loading}
            pagination={false}
            scroll={{ x: 1000 }}
          />
          <div className="pagination-box">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={currentTotal}
              onChange={handleTableChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>

      <div className="dashboard">
        <ClientSideBar />
        <div className="member-container">
          <h3>Project Quotes</h3>

          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobProjectTable;