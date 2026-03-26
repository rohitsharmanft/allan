import React, { useContext, useState } from "react";
import { Spin, Breadcrumb } from "antd";
import InputField from "../../../Components/Common/InputField/InputField";
import "./EditProfile.css";
import axios from "axios";
import { AppContext } from "../../../contexts/AppContexts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { update_profile_member } from "../../../api";
import { toast } from "react-toastify";
import { validateForm } from "../../../utils/validators/validator";
import { FaCamera } from "react-icons/fa";
import GradientButton from "../../../Components/Common/GradientButton";
import { FiChevronRight } from "react-icons/fi";
import Avatar from "../../../assets/images/user.png";

const EditProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, token } = useContext(AppContext);

  const [fullName, setFullName] = useState(user?.fullName ?? state?.fullName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? state?.phoneNumber ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsappNumber ?? state?.whatsappNumber ?? "");
  const [profileImagePreview, setProfileImagePreview] = useState(user?.image || Avatar);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({ fullName: "", phoneNumber: "", whatsappNumber: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const rules = {
    fullName: [{ type: "required", message: "Please enter full name." }],
    phoneNumber: [
      { type: "required", message: "Please enter your mobile number." },
      { type: "phone", message: "Please enter a valid mobile number." },
    ],
    whatsappNumber: [
      { type: "required", message: "Please enter your WhatsApp number." },
      { type: "phone", message: "Please enter a valid WhatsApp number." },
    ],
  };

  const validateField = (name, value) => {
    const fieldRules = { [name]: rules[name] };
    const fieldValues = { [name]: value };
    const fieldErrors = validateForm(fieldValues, fieldRules);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || "" }));
  };

  const openGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImagePreview(ev.target.result);
      reader.readAsDataURL(file);
      setSelectedImage(file);
    };
    input.click();
  };

  const handleUpdate = async () => {
    const validationErrors = validateForm({ fullName, phoneNumber, whatsappNumber }, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("whatsappNumber", whatsappNumber.trim());
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.put(update_profile_member, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200 || response.data.success) {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhoneInput = (e, setter, field) => {
    const value = e.target.value.replace(/[^0-9+]/g, "");
    setter(value);
    validateField(field, value);
  };

  return (
    <div className="edit-profile-container">
      <div className="bread-crumb_">
        <Breadcrumb
          separator={<FiChevronRight size={14} className="ss" />}
          items={[
            { title: <Link to="/profile">My Profile</Link> },
            { title: "Edit Profile" },
          ]}
        />
      </div>

      <Spin spinning={isUpdating} tip="Updating profile...">
        <div className="profile-header">
          <p className="ull">Upload Logo</p> 
          <div className="profile-image-wrapper">
            <img
              src={profileImagePreview}
              alt={fullName || "profile"}
              className="profile-image"
            />
            <div onClick={openGallery} className="camera-icon-wrapper">
              <FaCamera size={14} />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <InputField
            label="Name"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              validateField("fullName", e.target.value);
            }}
            error={errors.fullName}
            disabled={isUpdating}
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder={user?.email || "Enter email address"}
            value={user?.email || ""}
            disabled={true}
          />

          <InputField
            label="Mobile Number"
            placeholder="Enter mobile number"
            value={phoneNumber}
            onChange={(e) => handlePhoneInput(e, setPhoneNumber, "phoneNumber")}
            error={errors.phoneNumber}
            disabled={isUpdating}
          />

          <InputField
            label="WhatsApp Number"
            placeholder="Enter whatsapp number"
            value={whatsappNumber}
            onChange={(e) => handlePhoneInput(e, setWhatsappNumber, "whatsappNumber")}
            error={errors.whatsappNumber}
            disabled={isUpdating}
          />
        </div>

        <div className="reviews-btn">
          <GradientButton
            text={isUpdating ? "Updating..." : "Update Profile"}
            className="update-btn"
            onClick={handleUpdate}
            disabled={isUpdating}
          />

          <GradientButton
            text="Discard"
            className="bt"
            onClick={() => navigate("/profile")}
            disabled={isUpdating}
          />
        </div>
      </Spin>
    </div>
  );
};

export default EditProfile;