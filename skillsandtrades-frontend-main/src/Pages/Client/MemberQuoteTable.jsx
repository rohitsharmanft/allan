import React, { useContext, useEffect, useState } from "react";
import { Table, Pagination, Tooltip, Space, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./MemberQuoteTable.css";
import ClientSideBar from "../../Components/Client/ClientPannel/ClientSideBar";
import axios from "axios";
import { AppContext } from "../../contexts/AppContexts";
import Footer from "../../Components/Common/Footer/Footer";
import { quote_list } from "../../api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Common/Header/Header";

const MemberQuoteTable = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate()
  const location = useLocation();
  const stateData = location.state;
  console.log(stateData);
  const [quotes, setQuotes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const id = stateData?.jobs?._id || stateData?.projects?._id
  const fetchQuotes = async (page = 1, pageSize = 10) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axios.post(quote_list, { id: id }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.code === 200) {
        const apiData = res.data.data?.data || [];
        console.log("API returned quotes:", apiData);
        setQuotes(apiData);
        setPagination((prev) => ({
          ...prev,
          total: apiData.length,
        }));
        const formatted = apiData.map((quote, idx) => ({
          key: quote._id,
          serial: (page - 1) * pageSize + idx + 1,
          fullName: quote.fullName || "N/A",
          email: quote.email || "N/A",
          phone: quote.phoneNumber || "N/A",
          description: quote.description || "-",
          createdAt: quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : "-",
          file: quote.file || null,
          raw: quote,
        }));
        setTableData(formatted);
        toast.success(res.data.message || "Quotes loaded");
      } else {
        toast.warning("Unexpected response code");
      }
    } catch (error) {
      console.error("Quote fetch error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to load member quotes"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchQuotes(pagination.current, pagination.pageSize); }, [id]);
  const handleTableChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchQuotes(page, pageSize);
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
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined
              className="icon view"
              onClick={() => handleView(record.raw)}
            />
          </Tooltip>
          {/* <Tooltip title="Edit">
            <EditOutlined className="icon edit" />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined className="icon delete" />
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  const handleView = (quote) => {
    navigate('/member-detail', { state: { quote } })
    console.log("Full quote object:", quote);
  };

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
          <h3>Member Quotes</h3>
          <div className="table-box">
            <Table
              columns={columns}
              dataSource={tableData}
              loading={loading}
              pagination={false}
              scroll={{ x: 1000 }}
            />
            <div className="pagination-box">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handleTableChange}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MemberQuoteTable;