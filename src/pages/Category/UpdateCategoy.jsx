import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import InputField from "../../common/InputField/InputField";
import { Button, Input, Upload, Breadcrumb, Spin } from "antd";
import GradientButton from "../../common/GradientButton/GradientButton";
import { UploadOutlined } from "@ant-design/icons";
import { FiChevronRight } from "react-icons/fi";
import "./UpdateCategory.css";
import { toast } from "react-toastify";
import { admin_edit_category } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

function UpdateCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [categoryName, setCategoryName] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (data) {
      setCategoryName(data.title || "");
      if (data.icon) {
        setIconPreview(data.icon);
      }
    } else {
      toast.warn("No category data found. Redirecting...");
      navigate("/category");
    }
  }, [data, navigate]);

  const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];

  const beforeUpload = (file) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, SVG, JPG and JPEG files are allowed");
      return Upload.LIST_IGNORE;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    if (errors.icon) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.icon;
        return newErrors;
      });
    }
    return false;
  };

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    setCategoryName(value);
    if (value.trim() && errors.categoryName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categoryName;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }

    if (!iconPreview) {
      newErrors.icon = "Icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", data.key);
      formData.append("title", categoryName);
      if (selectedFile) {
        formData.append("icon", selectedFile);
      }

      const response = await axios.put(admin_edit_category, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Category updated successfully");
        navigate("/category");
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        error.response?.data?.message ||
        "An error occurred while updating the category"
      );
    } finally {
      setLoading(false);
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
          <div className="edit-profile-container">
            <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/category">Categories</Link>,
                  },
                  {
                    title: "Edit Category",
                  },
                ]}
              />
            </div>

            <Spin spinning={loading} tip="Updating category...">
              <div className="form-grid">
                <div className="inside">
                  <div style={{ marginBottom: "20px" }}>
                    <InputField
                      label="Category Name*"
                      type="text"
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={handleCategoryNameChange}
                      status={errors.categoryName ? "error" : ""}
                    />
                    {errors.categoryName && (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontSize: "12px",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors.categoryName}
                      </span>
                    )}
                  </div>

                  <div className="upload">
                    <label className="label">Icon* (PNG, JPG, JPEG only)</label>
                    <Upload
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      className="w-full"
                      accept="image/png,image/jpeg,.png,.jpg,.jpeg,.svg"
                    >
                      <Input
                        placeholder="Upload icon (PNG / JPG / JPEG)"
                        className={`upload-input ${errors.icon ? "ant-input-status-error" : ""
                          }`}
                        readOnly
                        value={selectedFile ? selectedFile.name : ""}
                        suffix={
                          <Button
                            icon={<UploadOutlined />}
                            className="upload-btn"
                          />
                        }
                      />
                    </Upload>
                    {errors.icon && (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontSize: "12px",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors.icon}
                      </span>
                    )}
                    {iconPreview && (
                      <div className="icon-preview" style={{ marginTop: "10px" }}>
                        <img
                          src={iconPreview}
                          alt="Icon preview"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            setIconPreview(null);
                          }}
                        />
                      </div>
                    )}

                  </div>
                </div>
              </div>

              <div className="button_group">
                <GradientButton
                  className="update-btn"
                  text={"Update Category"}
                  onClick={handleUpdateCategory}
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

export default UpdateCategory;  