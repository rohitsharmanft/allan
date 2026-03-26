import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Upload, message, Select, Breadcrumb } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import "./AddBlog.css";

import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import InputField from "../../common/InputField/InputField";
import {
  API_URL,
  admin_edit_advisory,
  admin_get_all_category,
} from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import Tiptap from "../../components/Editor";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";
const { TextArea } = Input;

const EditAdvisory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  const data = location.state;
  const [id, setId] = useState(data?.id || "");
  const [title, setTitle] = useState(data?.title || "");
  const [body, setBody] = useState(data?.content || "");
  const [category, setCategory] = useState(data?.categoryId || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    data?.image ? `${data.image}` : null,
  );
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    if (!data) {
      message.error("No blog selected for editing");
      navigate("/advisory");
    }
  }, [data, navigate]);

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
    return false;
  };

  const handleSubmit = async () => {
    if (!id || !title || !body || !category) {
      message.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("description", body);
      formData.append("categoryId", category);
      if (image) formData.append("image", image);

      const response = await axios.put(admin_edit_advisory, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast.success("Advisory updated successfully!");
        navigate("/advisory");
      } else {
        toast.error(response.data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
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
            <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  { title: <Link to="/advisory">Advisory</Link> },
                  { title: "Edit Advisory" },
                ]}
              />
            </div>

            <h2 className="heading">Edit Advisory Details</h2>

            <label className="label">Title</label>
            <InputField
              placeholder="Enter blog title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="label">Body Text</label>
            <div className="editor-wrapper">
              <Tiptap content={body} onChange={setBody} />
            </div>

            <label className="label">Category</label>
            <Select
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              placeholder="Select Category"
              className="input"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              optionFilterProp="label"
            />

            <label className="label">Advisory Image</label>
            <Upload.Dragger
              name="image"
              multiple={false}
              className="upload-area"
              showUploadList={false}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Advisory preview"
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

            <div className="btn-row">
              <GradientButton
                text={loading ? "Saving..." : "Save Changes"}
                className="btn-edit"
                onClick={handleSubmit}
                disabled={loading}
              />
              <GradientButton
                text="Discard"
                className="btn-discard"
                onClick={() => navigate("/advisory")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAdvisory;
