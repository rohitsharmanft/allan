import React, { useContext, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import Sidebar from '../../components/SideBar/Sidebar';
import GradientButton from '../../common/GradientButton/GradientButton';
import InputField from '../../common/InputField/InputField';
import { useNavigate } from 'react-router-dom';
import { Input, Upload, Button, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from 'axios';
import './CreateCategory.css';
import { admin_create_category } from '../../api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

function CreateCategory() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [categoryName, setCategoryName] = useState('');
    const [iconFile, setIconFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({
        categoryName: '',
        icon: '',
    });

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

    const validateForm = () => {
        const newErrors = { categoryName: '', icon: '' };
        let isValid = true;

        if (!categoryName.trim()) {
            newErrors.categoryName = "Category name is required";
            isValid = false;
        }

        if (!iconFile) {
            newErrors.icon = "Please upload an icon (PNG, JPG, JPEG or SVG)";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategoryName(value);
        // Clear error as user types
        if (value.trim()) {
            setErrors(prev => ({ ...prev, categoryName: '' }));
        }
    };

    const beforeUpload = (file) => {
        if (!allowedTypes.includes(file.type)) {
            message.error("Only PNG, JPG, JPEG, SVG files are allowed");
            toast.error("Only PNG, JPG, JPEG, SVG files are allowed");
            return Upload.LIST_IGNORE;
        }
        setIconFile(file);
        // Clear error when valid file is selected
        setErrors(prev => ({ ...prev, icon: '' }));
        return false; // prevent automatic upload
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            // toast.warn("Please correct the errors");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', categoryName.trim());
        formData.append('icon', iconFile);

        try {
            const response = await axios.post(admin_create_category, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.code === 200) {
                toast.success('Category created successfully!');
                navigate(-1);
            } else {
                toast.error(response.data.error_message || "Failed to create category");
            }
        } catch (error) {
            const errMsg = error.response?.data?.error_description 
                || error.response?.data?.message 
                || error.message 
                || 'Failed to create category';
            toast.error(errMsg);
            console.error('Create category error:', error);
        } finally {
            setLoading(false);
        }
    };

    const iconPreviewUrl = iconFile ? URL.createObjectURL(iconFile) : null;

    return (
        <>
            <DashboardHeader />
            <div className="dashboard-main">
                <div className="dashboard-left">
                    <Sidebar />
                </div>
                <div className="dashboard-right">
                    <div className="edit-profile_container">
                        <h2 style={{ marginBottom: '20px' }}>Create new category</h2>

                        <Spin spinning={loading} tip="Creating category...">
                            <div className="form-grid_">
                                <div className='inside'>
                                    <InputField
                                        label="Category Name*"
                                        type="text"
                                        placeholder="Enter category name"
                                        value={categoryName}
                                        onChange={handleCategoryChange}
                                    />
                                    {errors.categoryName && (
                                        <div className="error-message">
                                            {errors.categoryName}
                                        </div>
                                    )}
                                </div>

                                <div className='upload'>
                                    <label className="label">Icon* (PNG, JPG, JPEG, SVG only)</label>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        maxCount={1}
                                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                        fileList={iconFile ? [iconFile] : []}
                                        onRemove={() => setIconFile(null)}
                                        showUploadList={false}
                                    >
                                        <Input
                                            placeholder="Upload icon"
                                            className="upload-input"
                                            value={iconFile?.name || ''}
                                            readOnly
                                            suffix={<Button icon={<UploadOutlined />} className="upload-btn" />}
                                        />
                                    </Upload>

                                    {errors.icon && (
                                        <div className="error-message">
                                            {errors.icon}
                                        </div>
                                    )}

                                    {iconPreviewUrl && (
                                        <div className="icon-preview" style={{ marginTop: '12px' }}>
                                            <img
                                                src={iconPreviewUrl}
                                                alt="Icon preview"
                                                style={{
                                                    maxWidth: '80px',
                                                    maxHeight: '80px',
                                                    objectFit: 'contain',
                                                    border: '1px solid #d9d9d9',
                                                    borderRadius: '6px',
                                                    padding: '4px'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="button_group">
                                <GradientButton
                                    className="update-btn"
                                    text={loading ? "Creating..." : "Create category"}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                />
                                <GradientButton
                                    className="discard-btn"
                                    text={"Discard"}
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                />
                            </div>
                        </Spin>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateCategory;