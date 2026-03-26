import React, { useContext, useEffect, useRef, useState } from "react";
import "./EditProfile.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, admin_edit_profile } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField/InputField";
import LoadingCard from "../../components/LoadingCard/LoadingCard";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import { AuthContext } from "../../contexts/AuthContext";
import { Breadcrumb, Spin } from "antd";            
import { FiChevronRight } from "react-icons/fi";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import User from '../../assets/user.png'
const EditProfile = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user);
      setFullName(user.fullName || "");
      setPreview(user.image || null);
    }
  }, [user]);

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    if (fieldName === "fullName") {
      if (!value.trim()) {
        newErrors.fullName = "Please enter full name.";
      } else if (value.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters.";
      } else if (value.trim().length > 50) {
        newErrors.fullName = "Full name cannot exceed 50 characters.";
      } else {
        delete newErrors.fullName;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);

    if (touched.fullName) {
      validateField("fullName", value);
    }
  };

  const handleNameBlur = () => {
    setTouched({ ...touched, fullName: true });
    validateField("fullName", fullName);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Please enter full name.";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    } else if (fullName.trim().length > 50) {
      newErrors.fullName = "Full name cannot exceed 50 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(admin_edit_profile, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data.code === 200) {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Optional: show full LoadingCard if you had initial data loading (but here we load from context)
  if (!user) {
    return <LoadingCard />;
  }

  return (
    <>
      <DashboardHeader />
      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>
        <div className="dashboard-right">
          <div className="edit-profile-container-">
            <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  { title: <Link to="/profile">My Profile</Link> },
                  { title: "Edit Profile" },
                ]}
              />
            </div>

            <Spin 
              spinning={loading} 
              tip="Updating profile..." 
              size="large"
            >
              {/* Profile Image */}
              <div 
                className="profile-img-wrapper"
                style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}
              >
                <img
                  src={preview ||User }
                  alt="profile"
                  className="profile-img"
                  onClick={() => !loading && fileRef.current.click()}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                />
                <div
                  className="camera-badge"
                  onClick={() => !loading && fileRef.current.click()}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  <i className="fa fa-camera"></i>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </div>

              {/* Form Fields */}
              <div className="form_grid">
                <div>
                  <InputField
                    label="Name *"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    disabled={loading}
                  />
                  {touched.fullName && errors.fullName && (
                    <div className="field-error">{errors.fullName}</div>
                  )}
                </div>

                <div>
                  <InputField
                    label="Email address"
                    type="email"
                    placeholder={user?.email || "example@gmail.com"}
                    value={user?.email || ""}
                    disabled
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="button_group">
                <GradientButton
                  className="update-btn"
                  text={loading ? "Updating..." : "Update Profile"}
                  onClick={handleUpdate}
                  loading={loading}
                  disabled={loading}
                />
                <GradientButton
                  className="discard-btn"
                  text="Discard"
                  onClick={() => navigate("/profile")}
                  disabled={loading}
                />
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;