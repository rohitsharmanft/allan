import React, { useContext, useEffect, useState } from "react";
import { Table, Pagination, Tooltip, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { accepted_quote_list } from "../../../api";
import Header from "../../../Components/Common/Header/Header";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import Footer from "../../../Components/Common/Footer/Footer";
import { AppContext } from "../../../contexts/AppContexts";

const AssignedJobsPage = () => {
    const { token, user, refreshProfile } = useContext(AppContext);
    const navigate = useNavigate();
    const [assignedJobs, setAssignedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        refreshProfile();
    }, []);

    const id = user?._id;

    const fetchAssignedJobs = async (page = 1, pageSize = 10) => {
        if (!id) return;
        setLoading(true);

        try {
            const response = await axios.post(
                accepted_quote_list,
                {
                    userId: id,
                    page: page,
                    pageSize: pageSize
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.code === 200 && response.data.data) {
                const jobsData = Array.isArray(response.data.data.data)
                    ? response.data.data.data
                    : [];
                setAssignedJobs(jobsData);

                const paginationInfo = response.data.data.pagination || {};
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: paginationInfo.totalCount || jobsData.length,
                });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load assigned jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchAssignedJobs(pagination.current, pagination.pageSize);
        }
    }, [id]);

    const formatTableData = (data, pageSize, currentPage) => {
        return data.map((item, idx) => ({
            key: item._id,
            serial: (currentPage - 1) * pageSize + idx + 1,
            jobTitle: item.jobData?.projectTitle || "N/A",
            clientName: item.fullName || "N/A",
            email: item.email || "N/A",
            phoneNumber: item.phoneNumber || "N/A",
            status: item.isJobDone === false ? "pending" : "completed",
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
            raw: { ...item }
        }));
    };

    const handleTableChange = (page, pageSize) => {
        fetchAssignedJobs(page, pageSize);
    };

    const handleView = (record) => {
        navigate(`/assigned-job-details`, { state: { job: record.raw } });
    };

    const columns = [
        {
            title: "S.No.",
            dataIndex: "serial",
            key: "serial",
            width: 10,
            align: "center",
        },
        {
            title: "Job/Project Title",
            dataIndex: "jobTitle",
            key: "jobTitle",
            width: 100
        },
        {
            title: "Client Name",
            dataIndex: "clientName",
            width: 80,
            key: "clientName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 100,
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 80,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 80,
            render: (status) => (
                <span style={{
                    color: status === "completed" ? "#52c41a" : "#faad14",
                    fontWeight: "bold"
                }}>
                    {status === "completed" ? "Completed" : "Pending"}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <EyeOutlined
                            className="icon view"
                            onClick={() => handleView(record)}
                            style={{ cursor: "pointer", fontSize: 18 }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const jobTableData = formatTableData(
        assignedJobs,
        pagination.pageSize,
        pagination.current
    );

    console.log(jobTableData)

    return (
        <>
            <Header />
            <div className="hero-section">
                <div className="overlay"></div>
                <h1>Assigned Jobs</h1>
            </div>

            <div className="dashboard">
                <ClientSideBar />
                <div className="member-container">
                    <h3>My Assigned Jobs</h3>

                    <div className="table-box">
                        <Table
                            columns={columns}
                            dataSource={jobTableData}
                            loading={loading}
                            pagination={false}
                            scroll={{ x: 1200 }}
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

export default AssignedJobsPage;