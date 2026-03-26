import React, { useContext, useEffect, useState } from "react";
import { Input, Button, Upload, message, Select, Breadcrumb, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

import "./AddBlog.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import InputField from "../../common/InputField/InputField";
import { admin_create_advisory, admin_get_all_category } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import Tiptap from "../../components/Editor";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const AddAdvisory = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { token } = useContext(AuthContext);
  const [category, setCategory] = useState(undefined);
  const [advisory, setAdvisory] = useState(undefined);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState({
    title: "",
    advisory: "",
    body: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(admin_get_all_category, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status && res.data.code === 200) {
        setCategories(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const advisoryOptions = [
    { value: "Member", label: "Member" },
    { value: "Client", label: "Client" },
  ];

  const categoryOptions = categories.map((cat) => ({
    label: cat.title,
    value: cat._id,
  }));

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const beforeUpload = (file) => {
    const isAllowed =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/svg+xml";

    if (!isAllowed) {
      toast.error("Only JPG, JPEG, PNG, SVG files are allowed!");
      return Upload.LIST_IGNORE;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    clearError("image");
    return false;
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      advisory: "",
      body: "",
      category: "",
      image: "",
    };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!advisory) {
      newErrors.advisory = "Please select who this advisory is for";
      isValid = false;
    }
    if (!body.trim()) {
      newErrors.body = "Content is required";
      isValid = false;
    }
    if (!category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }
    if (!image) {
      newErrors.image = "Please upload an image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.warning("Please complete all required fields");
      return;
    }

    if (loading) return; // extra safety

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", advisory);
      formData.append("description", body);
      formData.append("categoryId", category);
      formData.append("image", image);

      const response = await axios.post(admin_create_advisory, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast.success("Advisory created successfully!");
        setTitle("");
        setBody("");
        setImage(null);
        setImagePreview(null);
        setCategory(undefined);
        setAdvisory(undefined);
        setErrors({
          title: "",
          advisory: "",
          body: "",
          category: "",
          image: "",
        });
        navigate("/advisory");
      } else {
        toast.error(response.data.error.error_description || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error_description || "Something went wrong.");
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
          <div className="add-blog-container-">
            <div className="blog-bread">
              <div className="bread-crumb_">
                <Breadcrumb
                  separator={<FiChevronRight size={14} className="ss" />}
                  items={[
                    { title: <Link to="/advisory">Advisory</Link> },
                    { title: "Add Advisory Article" },
                  ]}
                />
              </div>
            </div>

            <h2 className="heading">Add Details</h2>

            <InputField
              placeholder="Enter advisory title"
              className={`input ${errors.title ? "error-input" : ""}`}
              value={title}
              label="Title"
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
            />
            {errors.title && <div className="error-text">{errors.title}</div>}

            <label className="label">Advisory For</label>
            <Select
              placeholder="Select type"
              options={advisoryOptions}
              className={`input ${errors.advisory ? "error-input" : ""}`}
              value={advisory}
              onChange={(value) => {
                setAdvisory(value);
                clearError("advisory");
              }}
            />
            {errors.advisory && (
              <div className="error-text">{errors.advisory}</div>
            )}

            <label className="label">Body Text</label>
            <div
              className={`editor-wrapper ${errors.body ? "error-border" : ""}`}
            >
              <Tiptap
                content={body}
                onChange={(value) => {
                  setBody(value);
                  clearError("body");
                }}
              />
            </div>
            {errors.body && <div className="error-text">{errors.body}</div>}

            <label className="label">Category</label>
            <Select
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              placeholder="Select Category"
              className={`input ${errors.category ? "error-input" : ""}`}
              value={category}
              onChange={(value) => {
                setCategory(value);
                clearError("category");
              }}
              options={categoryOptions}
              optionFilterProp="label"
            />
            {errors.category && (
              <div className="error-text">{errors.category}</div>
            )}

            <label className="label">Image</label>
            <Upload.Dragger
              name="image"
              multiple={false}
              className={`upload-area ${errors.image ? "error-border" : ""}`}
              showUploadList={false}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="blog-preview"
                  />
                  <p className="upload-text">Click or drag to replace image</p>
                </div>
              ) : (
                <>
                  <p className="upload-icon">
                    <InboxOutlined />
                  </p>
                  <p className="upload-text">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="upload-subtext">JPG, JPEG, PNG, SVG only</p>
                  <Button className="upload-btn">UPLOAD IMAGE</Button>
                </>
              )}
            </Upload.Dragger>
            {errors.image && <div className="error-text">{errors.image}</div>}

            <div className="btn-row">
              <GradientButton
                type="primary"
                className="btn-edit"
                text={
                  loading ? (
                    <span>
                      <Spin size="small" style={{ marginRight: 8 }} /> Saving...
                    </span>
                  ) : (
                    "Save"
                  )
                }
                onClick={handleSubmit}
                disabled={loading}
              />
              <GradientButton
                className="btn-discard"
                text="Discard"
                onClick={() => navigate("/advisory")}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdvisory;