import React, { useContext, useEffect, useState } from "react";
import { Input, Button, Upload, message, Select, Breadcrumb } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import "./AddBlog.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import InputField from "../../common/InputField/InputField";
import { admin_get_all_category, admin_get_create_blog } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import Tiptap from "../../components/Editor";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { token } = useContext(AuthContext);
  const [category, setCategory] = useState(undefined);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    body: "",
    category: "",
    image: "",
  });

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

  const categoryOptions = categories.map((cat) => ({
    label: cat.title,
    value: cat._id,
  }));

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      body: "",
      category: "",
      image: "",
    };
    let isValid = true;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (trimmedTitle === "") {
      newErrors.title = "Only spaces are not allowed";
      isValid = false;
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title is too short (min 3 characters)";
      isValid = false;
    }

    const strippedBody = body.replace(/<[^>]+>/g, "").trim();
    if (!strippedBody) {
      newErrors.body = "Blog content is required";
      isValid = false;
    } else if (strippedBody === "") {
      newErrors.body = "Only spaces are not allowed";
      isValid = false;
    } else if (strippedBody.length < 10) {
      newErrors.body = "Content is too short (min 10 characters)";
      isValid = false;
    }

    if (!category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (!image) {
      newErrors.image = "Please upload a cover image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const beforeUpload = (file) => {
    const isAllowed =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/svg+xml";

    if (!isAllowed) {
      toast.error("You can only upload JPG, JPEG, PNG or SVG files!");
      return Upload.LIST_IGNORE;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    clearError("image");
    return false;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.warning("Please fill all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("heading", title.trim());
      formData.append("description", body);
      formData.append("categoryId", category);
      formData.append("image", image);

      const response = await axios.post(admin_get_create_blog, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast.success("Blog created successfully!");
        setTitle("");
        setBody("");
        setImage(null);
        setImagePreview(null);
        setCategory("");
        setErrors({ title: "", body: "", category: "", image: "" });
        navigate("/blog");
      } else {
        toast.error(response.data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error. Please try again.");
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
          <div className="add-blog-container">
            <div className="blog-bread">
              <div className="bread-crumb_">
                <Breadcrumb
                  separator={<FiChevronRight size={14} className="ss" />}
                  items={[
                    { title: <Link to="/blog">Blog</Link> },
                    { title: "Add Blog" },
                  ]}
                />
              </div>
            </div>

            <h2 className="heading">Add Details</h2>

            <label className="label">Title</label>
            <InputField
              placeholder="Enter blog title"
              className={`input ${errors.title ? "error-input" : ""}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
            />
            {errors.title && <div className="error-text">{errors.title}</div>}

            <label className="label">Blog Content</label>
            <div className={`editor-wrapper ${errors.body ? "error-border" : ""}`}>
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
              placeholder="Select Category"
              className={`input ${errors.category ? "error-input" : ""}`}
              value={category}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              onChange={(value) => {
                setCategory(value);
                clearError("category");
              }}
              options={categoryOptions}
              optionFilterProp="label"
            />
            {errors.category && <div className="error-text">{errors.category}</div>}

            <label className="label">Image (Cover)</label>
            <Upload.Dragger
              name="files"
              multiple={false}
              className={`upload-area ${errors.image ? "error-border" : ""}`}
              showUploadList={false}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Blog preview" className="blog-preview" />
                  <p className="upload-text">Click or drag to replace image</p>
                </div>
              ) : (
                <>
                  <p className="upload-icon">
                    <InboxOutlined />
                  </p>
                  <p className="upload-text">Choose a file or drag & drop it here</p>
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
                text={loading ? "Saving..." : "Save"}
                disabled={loading}
                onClick={handleSubmit}
              />
              <GradientButton
                className="btn-discard"
                text="Discard"
                onClick={() => navigate("/blog")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBlog;