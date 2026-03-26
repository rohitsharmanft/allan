import React, { useState, useEffect, useContext } from "react";
import { Table, Pagination, Spin, message, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { admin_get_contact_us_list } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./ContactUsList.css";

const ContactUsList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState("");
    const { token } = useContext(AuthContext);
    useEffect(() => { fetchContactRequests(); }, [currentPage]);

    const fetchContactRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                admin_get_contact_us_list,
                {
                    offset: (currentPage - 1) * pageSize,
                    limit: pageSize,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data && response.data.status) {
                setData(response.data.data.data);
                setTotal(response.data.data.pagination.totalCount);
            } else {
                message.error(response.data.message || "Failed to load contact requests");
            }
        } catch (error) {
            console.error("Error fetching contact requests:", error);
            message.error("Failed to load contact requests");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
            width: 150,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 200,
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 150,
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (text) => <div className="message-cell">{text || "N/A"}</div>,
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <>
            <DashboardHeader />
            <div className="dashboard-main">
                <div className="dashboard-left">
                    <Sidebar />
                </div>
                <div className="dashboard-right">
                    <div className="contact-us-container">
                        <div className="page-header">
                            <h2 className="breakdown-title1">Contact Us Requests</h2>
                            <div className="search-box">
                                <SearchOutlined className="search-icon" />
                                <Input
                                    placeholder="Search..."
                                    bordered={false}
                                    className="search_input"
                                    value={searchText}
                                    onChange={handleSearch}
                                    allowClear
                                />
                            </div>
                        </div>

                        <div className="table-box">
                            <Spin spinning={loading}>
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    pagination={false}
                                    rowKey="_id"
                                    scroll={{ x: 1000 }}
                                    locale={{ emptyText: "No contact requests found" }}
                                />
                            </Spin>

                            <div className="pagination-box">
                                <Pagination
                                    current={currentPage}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsList;
