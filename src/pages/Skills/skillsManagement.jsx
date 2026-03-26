import React, { useState, useEffect, useContext } from 'react';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import Sidebar from '../../components/SideBar/Sidebar';
import { Table, Space, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import GradientButton from '../../common/GradientButton/GradientButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, admin_get_all_category, admin_get_skills_by_category, admin_delete_skill } from '../../api';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from "react-toastify";
import './SkillsManagement.css'; // Imported responsive styles

function SkillsManagement() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [skillsMap, setSkillsMap] = useState({}); 
    const [skillsLoading, setSkillsLoading] = useState({});

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await axios.get(admin_get_all_category, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status && res.data.code === 200) {
                const formatted = res.data.data.map((item, idx) => ({
                    key: item._id,
                    title: item.title,
                    description: item.description || '',
                    icon: item.icon ? `${API_URL}/${item.icon}` : 'https://via.placeholder.com/40?text=No+Icon',
                }));
                setCategories(formatted);
            } else {
                message.error(res.data.message || 'Failed to fetch categories');
            }
        } catch (err) {
            console.error(err);
            message.error('Error fetching categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchSkillsByCategory = async (categoryId) => {
        if (skillsMap[categoryId]) return; 

        setSkillsLoading(prev => ({ ...prev, [categoryId]: true }));

        try {
            const res = await axios.post(
                `${admin_get_skills_by_category}`, 
                { categoryId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.status && res.data.code === 200) {
                setSkillsMap(prev => ({ ...prev, [categoryId]: res.data.data }));
            } else {
                toast.error('Failed to load skills');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error loading skills');
        } finally {
            setSkillsLoading(prev => ({ ...prev, [categoryId]: false }));
        }
    };


    const categoryColumns = [
        { title: 'Category', dataIndex: 'title', key: 'title' },
        // { title: 'Description', dataIndex: 'description', key: 'description' },
        // {
        //     title: 'Actions', key: 'actions', render: (_, record) => (
        //         <Space>
        //             {/* <Button size="small" icon={<EditOutlined />} /> */}
        //             {/* <Button size="small" danger icon={<DeleteOutlined />} /> */}
        //         </Space>
        //     )
        // }
    ];

    const skillColumns = [
        { title: 'Skill', dataIndex: 'title', key: 'title' },
        {
            title: 'Actions', key: 'actions', render: (_, record) => (
                <Space>
                    {/* <Button size="small" icon={<EditOutlined />} /> */}

                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteSkill(record._id)}
                    />
                    {/* <Button size="small" danger icon={<DeleteOutlined />} /> */}
                </Space>
            )
        }
    ];
    const deleteSkill = async (skillId) => {
        try {
            const response = await axios.delete(`${admin_delete_skill}/${skillId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status && response.data.code === 200) {
                toast.success("Skill deleted successfully");
                setSkillsMap(prev => {
                    const updated = { ...prev };
                    for (let catId in updated) {
                        updated[catId] = updated[catId].filter(skill => skill._id !== skillId);
                    }
                    return updated;
                });
            } else {
                toast.error(response.data.message || "Failed to delete skill");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting skill");
        }
    };

    return (
        <>
            <DashboardHeader />
            <div className="dashboard-main">
                <div className="dashboard-left"><Sidebar /></div>
                <div className="dashboard-right">
                    <div className='sk' >
                        <div className='sk1' >
                            <h2 style={{ margin: 0 }}>Skills Management</h2>
                            <GradientButton text="Add New Skills" onClick={() => navigate('/create-skills')} />
                        </div>
                            
                            <div className='table-box'>
                        <Table
                            dataSource={categories}
                            columns={categoryColumns}
                            loading={loadingCategories}
                            expandable={{
                                onExpand: (expanded, record) => expanded && fetchSkillsByCategory(record.key),
                                expandedRowRender: (record) => (
                                    <Table
                                        columns={skillColumns}
                                        dataSource={skillsMap[record.key] || []}
                                        loading={skillsLoading[record.key]}
                                        pagination={false}
                                        rowKey="_id"
                                        size="small"
                                        locale={{ emptyText: 'No skills found' }}
                                    />
                                )
                            }}
                            pagination={{ pageSize: 15 }}
                            rowKey="key"
                        />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SkillsManagement;
