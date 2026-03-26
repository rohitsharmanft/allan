import React, { useState, useEffect, useContext } from "react";
import "./Notification.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import { List, Avatar, Tag, Button, Spin, message } from "antd";
import { BellOutlined, CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { admin_get_notifications, admin_mark_notification_read } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Notification = () => {
    const { fetchCount } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();

    const fetchNotifications = async (p = page) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${admin_get_notifications}?limit=${pageSize}&offset=${(p - 1) * pageSize}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status) {
                setNotifications(response.data.data.notifications);
                setTotal(response.data.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            message.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, [page]);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(admin_mark_notification_read, { id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            fetchCount();
            message.success("Marked as read");
        } catch (error) {
            console.error("Error marking notification as read:", error);
            message.error("Failed to mark as read");
        }
    };

    const handleView = (item) => {
        if (!item.isRead) markAsRead(item._id);

        // Deep linking logic based on Sidebar.jsx paths
        switch (item.type) {
            case 'client_registration':
                navigate('/manage-clients');
                break;
            case 'member_registration':
                navigate('/manage-members');
                break;
            case 'member_profile_update':
                navigate('/profile-update-requests');
                break;
            case 'job_posted':
                navigate('/job');
                break;
            case 'project_posted':
                navigate('/project');
                break;
            default:
                break;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const getTagColor = (type) => {
        switch (type) {
            case 'member_registration':
            case 'client_registration': return 'blue';
            case 'job_posted':
            case 'project_posted': return 'green';
            case 'member_profile_update': return 'orange';
            default: return 'default';
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
                    <div className="notification-card">
                        <div className="notification-header">
                            <h3 className="notification-title">Notifications ({total})</h3>
                            <Button type="link" onClick={() => fetchNotifications(1)}>Refresh</Button>
                        </div>
                        <div className="notification-content">
                            {loading && <div className="loading-spinner"><Spin size="large" /></div>}
                            {!loading && (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={notifications}
                                    pagination={{
                                        onChange: (p) => setPage(p),
                                        pageSize: pageSize,
                                        total: total,
                                        current: page,
                                        align: 'center'
                                    }}
                                    renderItem={(item) => (
                                        <List.Item
                                            className={`notification-item ${item.isRead ? 'read' : 'unread'}`}
                                            actions={[
                                                !item.isRead && (
                                                    <Button
                                                        type="text"
                                                        icon={<CheckCircleOutlined />}
                                                        onClick={() => markAsRead(item._id)}
                                                        title="Mark as read"
                                                    />
                                                ),
                                                <Button
                                                    type="text"
                                                    icon={<EyeOutlined />}
                                                    onClick={() => handleView(item)}
                                                    title="View"
                                                />
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        icon={<BellOutlined />}
                                                        className="notification-avatar"
                                                        style={{
                                                            backgroundColor: item.isRead ? '#f5f5f5' : '#134A45',
                                                            color: item.isRead ? '#134A45' : '#fff'
                                                        }}
                                                    />
                                                }
                                                title={
                                                    <div className="notification-item-header">
                                                        <span className="notification-item-title">{item.title}</span>
                                                        <Tag color={getTagColor(item.type)} className="notification-tag">
                                                            {item.type.replace(/_/g, ' ').toUpperCase()}
                                                        </Tag>
                                                        <span className="notification-time">{formatTime(item.createdAt)}</span>
                                                    </div>
                                                }
                                                description={<span className="notification-description">{item.message}</span>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notification;
