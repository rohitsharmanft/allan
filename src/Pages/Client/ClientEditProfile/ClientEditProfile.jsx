import React, { useState, useEffect, useContext } from "react";
import { Spin, Breadcrumb } from "antd";
import InputField from "../../../Components/Common/InputField/InputField";
import "./ClientEditProfile.css";
import Footer from "../../../Components/Common/Footer/Footer";
import GradientButton from "../../../Components/Common/GradientButton";
import { AppContext } from "../../../contexts/AppContexts";
import { Link, useNavigate } from "react-router-dom";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import ClientNavBar from "../ClientHeader/ClientNavBar";
import { toast } from "react-toastify";
import axios from "axios";
import { update_profile_client } from "../../../api";
import { FaCamera } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import Avatar from "../../../assets/images/user.png";

const ClientEditProfile = () => {
  const { user, refreshProfile, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.image || Avatar
  );
  const [selectedImage, setSelectedImage] = useState(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);

  const MAX_NAME_LENGTH = 30;

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setMobile(user.phoneNumber || "");
      setWhatsapp(user.whatsappNumber || "");
      setProfileImagePreview(user.image || Avatar);
    }
  }, [user]);

  const openGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select a valid image file.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);

        setSelectedImage(file);
      }
    };
    input.click();
  };

  const validateName = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setNameError("Please enter your full name.");
      return false;
    }
    if (trimmed.length < 3) {
      setNameError("Full name must be at least 3 characters long.");
      return false;
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setNameError(`Full name cannot exceed ${MAX_NAME_LENGTH} characters.`);
      return false;
    }

    setNameError("");
    return true;
  };

  const validatePhone = (value, field) => {
    if (!value.trim()) {
      const msg = field === "mobile" ? "mobile" : "WhatsApp";
      field === "mobile"
        ? setMobileError(`Please enter your ${msg} number.`)
        : setWhatsappError(`Please enter ${msg} number.`);
      return false;
    }

    if (!/^[0-9+\-\s]*$/.test(value)) {
      const msg = "Only numbers, +, -, and space allowed.";
      field === "mobile" ? setMobileError(msg) : setWhatsappError(msg);
      return false;
    }

    const digits = value.replace(/\D/g, "").length;
    if (digits < 8 || digits > 15) {
      const msg = "Must contain 8 to 15 digits.";
      field === "mobile" ? setMobileError(msg) : setWhatsappError(msg);
      return false;
    }

    field === "mobile" ? setMobileError("") : setWhatsappError("");
    return true;
  };

  const handlePhoneChange = (e, setter, field) => {
    let value = e.target.value;
    if (value && !/^[0-9+\-\s]*$/.test(value)) return;
    setter(value);
    validatePhone(value, field);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleUpdate = async () => {
    const isNameValid = validateName(name);
    const isMobileValid = validatePhone(mobile, "mobile");
    const isWhatsappValid = validatePhone(whatsapp, "whatsapp");

    if (!isNameValid || !isMobileValid || !isWhatsappValid) {
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("fullName", name.trim());
      formData.append("phoneNumber", mobile.trim());
      formData.append("whatsappNumber", whatsapp.trim());
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.put(update_profile_client, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === 200) {
        await refreshProfile();
        toast.success("Profile updated successfully!");
        navigate("/client-profile");
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update profile.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // if (!user) {
  //   return (
  //     <div style={{ padding: "100px 0", textAlign: "center" }}>
  //       <Spin size="large" tip="Loading profile..." />
  //     </div>
  //   );
  // }

  return (
    <>
      <ClientNavBar />

      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>

      <div className="dashboard">
        <ClientSideBar />

        <div className="edit_profile-container">
          <div className="bread-crumb_">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                { title: <Link to="/client-profile">My Profile</Link> },
                { title: "Edit Profile" },
              ]}
            />
          </div>

          <Spin spinning={isUpdating} tip="Updating profile...">
            <div className="profile-header">
              <div style={{ position: "relative", width: "100px", height: "100px" }}>
                <img
                  src={profileImagePreview}
                  alt={name || "profile"}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
                <div onClick={openGallery} className="camera-icon-wrapper">
                  <FaCamera size={14} />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div>
                <InputField
                  label="Full Name"
                  placeholder="Please Enter Full Name"
                  value={name}
                  onChange={handleNameChange}
                  maxLength={30}
                  disabled={isUpdating}
                />
                {nameError && <p className="error">{nameError}</p>}
              </div>

              <div>
                <InputField
                  label="Email address"
                  type="email"
                  value={user?.email || ""}
                  disabled={true}
                />
              </div>

              <div>
                <InputField
                  label="Mobile Number"
                  placeholder="Please Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => handlePhoneChange(e, setMobile, "mobile")}
                  disabled={isUpdating}
                />
                {mobileError && <p className="error">{mobileError}</p>}
              </div>

              <div>
                <InputField
                  label="WhatsApp Number"
                  placeholder="Please Enter WhatsApp Number"
                  value={whatsapp}
                  onChange={(e) => handlePhoneChange(e, setWhatsapp, "whatsapp")}
                  disabled={isUpdating}
                />
                {whatsappError && <p className="error">{whatsappError}</p>}
              </div>
            </div>

            <div className="button-group">
              <GradientButton
                text={isUpdating ? "Updating..." : "Update profile"}
                onClick={handleUpdate}
                disabled={isUpdating}
                className="update-btn"
              />

              <GradientButton
                text="Discard"
                onClick={() => navigate(-1)}
                disabled={isUpdating}
                className="bt"
              />
            </div>
          </Spin>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ClientEditProfile;