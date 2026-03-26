import React, { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import DropdownField from "../../../Components/Common/InputField/DropdownField";
import InputField from "../../../Components/Common/InputField/InputField";
import GradientButton from "../../../Components/Common/GradientButton";
import "./ClientInformation.css";
import ClientNavBar from "../ClientHeader/ClientNavBar";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import Footer from "../../../Components/Common/Footer/Footer";
import Header from "../../../Components/Common/Header/Header";
import axios from "axios";
import { AppContext } from "../../../contexts/AppContexts";
import { toast } from "react-toastify";
import { update_profile_client } from "../../../api";

const ClientInformation = () => {
  const { refreshProfile, user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    postCode: "",
    address: "",
    city: "",
    country: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const MAX_NAME_LENGTH = 30;

  const validateForm = (data = formData, genderValue = gender) => {
    const newErrors = {};
    if (!data.fullName?.trim()) {
      newErrors.fullName = "Please enter full name.";
    } else if (data.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    } else if (data.fullName.trim().length > MAX_NAME_LENGTH) {
      newErrors.fullName = `Full name cannot exceed ${MAX_NAME_LENGTH} characters.`;
    }
    if (!data.email?.trim()) {
      newErrors.email = "Please enter email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!data.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Please enter phone number.";
    } else if (!/^[+]?[\d\s-()]{8,15}$/.test(data.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }
    if (!data.postCode?.trim()) {
      newErrors.postCode = "Please enter post code.";
    } else if (data.postCode.trim().length < 6) {
      newErrors.postCode = "Post code must be at least 6 characters.";
    }
    if (!data.address?.trim()) {
      newErrors.address = "Please enter address.";
    }
    if (!data.city?.trim()) {
      newErrors.city = "Please enter city.";
    }
    if (!data.country?.trim()) {
      newErrors.country = "Please enter country.";
    }
    if (!data.state?.trim()) {
      newErrors.state = "Please enter state.";
    }
    if (!genderValue?.trim()) {
      newErrors.gender = "Please select gender.";
    }
    return newErrors;
  };

  const handleChange = (e, field) => {
    let value = e.target.value;
    if (field === "fullName" && value.length > MAX_NAME_LENGTH) {
      return;
    }
    if (field === "phoneNumber") {
      if (value !== "" && !/^[0-9+\-\s()]*$/.test(value)) {
        return;
      }
    }

    if (field === "postCode") {
      value = value.trimStart(); // Prevent leading spaces
    }

    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    if (isSubmitted || (field === "postCode" && value.length > 0)) {
      const fieldError = validateForm(updatedFormData, gender)[field];
      setErrors((prev) => ({ ...prev, [field]: fieldError || "" }));
    }
  };

  const handleGenderChange = (value) => {
    setGender(value);
    if (isSubmitted) {
      const newErrors = validateForm(formData, value);
      setErrors(newErrors);
    }
  };
  useEffect(() => {
    refreshProfile();
  }, []);
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        postCode: user.postCode || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        state: user.state || "",
      });
      setGender(user.gender || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsSubmitted(true);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        update_profile_client,
        {
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          postCode: formData.postCode.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          state: formData.state.trim(),
          gender,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await refreshProfile();
      toast.success("Profile updated successfully!");
      setIsSubmitted(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error_description ||
        err.response?.data?.error ||
        "Failed to update profile. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>

      <div className="dashboard">
        <ClientSideBar />

        <div className="personal_information">
          <h2>Information</h2>

          <Spin spinning={loading} tip="Updating profile...">
            <div className="info_card-container">
              <div className="info-form-grid">
                <div>
                  <InputField
                    label="Full Name *"
                    placeholder="Enter Your Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleChange(e, "fullName")}
                    error={errors.fullName}
                    disabled={loading}
                  />
                </div>

                <div className="info_name-row">
                  <InputField
                    label="Email *"
                    placeholder="Enter Your Email"
                    value={formData.email}
                    onChange={(e) => handleChange(e, "email")}
                    error={errors.email}
                    disabled={true}
                  />
                  <InputField
                    label="Phone Number *"
                    placeholder="Enter Your Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange(e, "phoneNumber")}
                    error={errors.phoneNumber}
                    disabled={loading}
                  />
                </div>
{/* 
                <InputField
                  label="Post Code *"
                  placeholder="Enter Your Post Code"
                  value={formData.postCode}
                  onChange={(e) => handleChange(e, "postCode")}
                  error={errors.postCode}
                  disabled={loading}
                  maxLength={12}
                /> */}

              
                  {/* <InputField
                    label="Address Line 1 *"
                    placeholder="Enter Your Address"
                    value={formData.address}
                    onChange={(e) => handleChange(e, "address")}
                    error={errors.address}
                    disabled={loading}
                  /> */}
                  <InputField
                    label="City *"
                    placeholder="Enter Your City"
                    value={formData.city}
                    onChange={(e) => handleChange(e, "city")}
                    error={errors.city}
                    disabled={loading}
                  />
               

                <div className="info-row">
                  <InputField
                    label="Country *"
                    placeholder="Enter Your Country"
                    value={formData.country}
                    onChange={(e) => handleChange(e, "country")}
                    error={errors.country}
                    disabled={loading}
                  />
                  <InputField
                    label="State *"
                    placeholder="Enter Your State"
                    value={formData.state}
                    onChange={(e) => handleChange(e, "state")}
                    error={errors.state}
                    disabled={loading}
                  />
                </div>

                <DropdownField
                  label="Gender *"
                  value={gender}
                  onChange={handleGenderChange}
                  options={["Male", "Female", "Other"]}
                  error={errors.gender}
                  disabled={loading}
                  placeholder="Select gender"
                />
              </div>
            </div>

            <div className="info-button-group">
              <GradientButton
                className="update-profile-btn"
                text={loading ? "Updating..." : "Update Profile"}
                onClick={handleUpdateProfile}
                disabled={loading}
              />
            </div>
          </Spin>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ClientInformation;
