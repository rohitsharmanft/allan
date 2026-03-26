import React, { useContext, useEffect, useState } from "react";
import { Table, Pagination, Tooltip, Space, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../Components/Member/Sidebar";
import { get_member_jobs } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import Header from "../../../Components/Common/Header/Header";
import Footer from "../../../Components/Common/Footer/Footer";

const MemberProjectPage = () => {
    const { token, user, refreshProfile } = useContext(AppContext);
    const navigate = useNavigate();
    const [memberJobs, setMemberJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    useEffect(() => { refreshProfile(); }, []);
    const id = user?._id;
    console.log(id)
    const fetchMemberJobs = async (page = 1, pageSize = 10) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await axios.post(get_member_jobs, { type: 'project' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.code === 200 && response.data.data) {
                const jobsData = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];
                setMemberJobs(jobsData);

                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: jobsData.length,
                });
            }
        } catch (error) {
            console.error("Error fetching member jobs:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to load member jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMemberJobs(pagination.current, pagination.pageSize);
        }
    }, [id]);

    const formatTableData = (data, pageSize, currentPage) => {
        return data.map((item, idx) => ({
            key: item._id,
            serial: (currentPage - 1) * pageSize + idx + 1,
            jobTitle: item.jobTittle || "N/A",
            clientName: item?.clientName || "N/A",
            clientAction: item.clientAction || "pending",
            jobStatus: item.isJobDone || false,
            rating: item.rating || 0,
            hasReview: !!item.review,
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
            raw: { ...item }
        }));
    };

    const handleTableChange = (page, pageSize) => { fetchMemberJobs(page, pageSize); };

    const handleView = (record) => {
        navigate(`/member-project-details`, { state: { job: record.raw } });
    };

    const renderJobStatus = (status) => {
        let color = "#faad14";
        let displayStatus = "In Progress";

        if (status === true) {
            color = "#52c41a";
            displayStatus = "Completed";
        } else if (status === false) {
            color = "#faad14";
            displayStatus = "In Progress";
        }

        return (
            <span style={{
                color: color,
                fontWeight: "bold"
            }}>
                {displayStatus}
            </span>
        );
    };

    const columns = [
        {
            title: "S.No.",
            dataIndex: "serial",
            key: "serial",
            width: 60,
            align: "center",
        },
        {
            title: "Job Name",
            dataIndex: "jobTitle",
            key: "jobTitle",
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip title={text}>
                    {text}
                </Tooltip>
            ),
        },
        {
            title: "Client Name",
            dataIndex: "clientName",
            key: "clientName",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip title={text}>
                    {text}
                </Tooltip>
            ),
        },
        // {
        //     title: "Client Action",
        //     dataIndex: "clientAction",
        //     key: "clientAction",
        //     width: 100,
        //     render: (status) => renderClientActionStatus(status),
        // },
        {
            title: "Job Status",
            dataIndex: "jobStatus",
            key: "jobStatus",
            width: 100,
            render: (status) => renderJobStatus(status),
        },
        {
            title: "Posted Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 110,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: "center",
            // fixed: "right",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <EyeOutlined
                            className="icon view"
                            onClick={() => handleView(record)}
                            style={{ cursor: "pointer", fontSize: 18, color: "#fff" }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const jobTableData = formatTableData(
        memberJobs,
        pagination.pageSize,
        pagination.current
    );

    return (
        <>
            <Header />
            <div className="hero-section">
                <div className="overlay"></div>
                <h1>My Jobs</h1>
            </div>

            <div className="dashboard">
                <Sidebar />
                <div className="member-container">
                    <h3>Available Projects for Me</h3>

                    <div className="table-box">
                        <Spin spinning={loading} tip="Loading projects...">
                            <Table
                                columns={columns}
                                dataSource={jobTableData}
                                loading={false}
                                pagination={false}
                                scroll={{ x: 1200 }}
                                locale={{
                                    emptyText: "No projects available"
                                }}
                            />
                        </Spin>
                        <div className="pagination-box">
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={handleTableChange}
                                showSizeChanger
                                pageSizeOptions={["10", "20", "50"]}
                                style={{ marginTop: "20px", textAlign: "right" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default MemberProjectPage;