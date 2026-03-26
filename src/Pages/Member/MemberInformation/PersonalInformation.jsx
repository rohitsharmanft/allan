import React, { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import "./PersonalInformation.css";
import DropdownField from "../../../Components/Common/InputField/DropdownField";
import InputField from "../../../Components/Common/InputField/InputField";
import GradientButton from "../../../Components/Common/GradientButton";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import { member_profile_list, update_profile_member } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import { validateForm } from "../../../utils/validators/validator";
import axios from "axios";
import { toast } from "react-toastify";

const PersonalInformation = () => {
  const { token, user, refreshProfile } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        telephoneNumber: user.telephoneNumber || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        businessTradingName: user.businessTradingName || "",
        category: user.category || "",
        skillIds: user.skillIds || "",
        workingLocation: user.workingLocation || "",
        town: user.town || "",
        country: user.country || "",
        experience: user.experience || "",
        hourlyCharged: user.hourlyCharged || "",
      });
    }
  }, [user]);

  const rules = {
    fullName: [{ type: "required", message: "Please enter full name." }],
    phoneNumber: [
      { type: "required", message: "Please enter mobile number." },
      { type: "phone", message: "Please enter a valid mobile number." },
      { type: "max", message: "Mobile number cannot be more than 15 digits." },
    ],
    telephoneNumber: [
      { type: "required", message: "Please enter telephone number." },
      { type: "phone", message: "Please enter a valid telephone number." },
      { type: "max", value: 15, message: "Telephone number cannot be more than 15 digits." },
    ],
    gender: [{ type: "required", message: "Please select your gender." }],
    businessTradingName: [{ type: "required", message: "Please enter your business trading name." }],
    category: [{ type: "required", message: "Please select your category." }],
    skillIds: [{ type: "required", message: "Please enter your skills." }],
    workingLocation: [{ type: "required", message: "Please enter your working location." }],
    town: [{ type: "required", message: "Please enter your town." }],
    country: [{ type: "required", message: "Please select your country." }],
    experience: [{ type: "required", message: "Please enter your experience." }],
    hourlyCharged: [{ type: "required", message: "Please enter your hourly charge." }],
  };

  const handleChange = (e, field) => {
    const value = e.target.value;

    if (field === "phoneNumber" || field === "telephoneNumber") {
      if (value !== "" && !/^\+?[0-9 ]*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(update_profile_member, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.code === 200) {
        toast.success(response?.data?.message || "Profile updated successfully!");
        await refreshProfile();
      } else {
        toast.error(response?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.error_description || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>

      <div className="dashboard">
        <Sidebar />

        <div className="personal-information">
          <h2>Personal Information</h2>

          <Spin spinning={loading} tip="Saving your information...">
            <div className="change-password-container">
              <div className="form_grid">
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData?.fullName || ""}
                  onChange={(e) => handleChange(e, "fullName")}
                  error={errors.fullName}
                  disabled={loading}
                />

                <InputField
                  label="Email address"
                  type="email"
                  placeholder="Enter email address"
                  value={formData?.email || ""}
                  onChange={(e) => handleChange(e, "email")}
                  error={errors.email}
                  disabled={true}
                />

                <InputField
                  type="text"
                  inputMode="numeric"
                  label="Telephone Number"
                  placeholder="Enter Your Telephone Number"
                  value={formData?.telephoneNumber || ""}
                  onChange={(e) => handleChange(e, "telephoneNumber")}
                  error={errors.telephoneNumber}
                  disabled={loading}
                />

                <InputField
                  type="text"
                  inputMode="numeric"
                  label="Mobile Number"
                  placeholder="Enter your Mobile number"
                  value={formData?.phoneNumber || ""}
                  onChange={(e) => handleChange(e, "phoneNumber")}
                  error={errors.phoneNumber}
                  disabled={loading}
                />

                <DropdownField
                  label="Gender"
                  value={formData?.gender || ""}
                  onChange={(value) => handleChange({ target: { value } }, "gender")}
                  options={["Male", "Female", "Other"]}
                  error={errors?.gender}
                  disabled={loading}
                />

                <InputField
                  label="Individual or Business Trading Name"
                  placeholder="Enter Trading Name"
                  value={formData?.businessTradingName || ""}
                  onChange={(e) => handleChange(e, "businessTradingName")}
                  error={errors.businessTradingName}
                  disabled={loading}
                />

                <DropdownField
                  label="Skill or Trade Category"
                  value={formData?.category || ""}
                  onChange={(value) => handleChange({ target: { value } }, "category")}
                  options={["Hello", "Hi", "Hey"]} // ← replace with real categories
                  error={errors?.category}
                  disabled={loading}
                />

                <InputField
                  label="Profession, skill or trade"
                  placeholder="Enter Profession, skill or trade"
                  value={formData?.skillIds || ""}
                  onChange={(e) => handleChange(e, "skillIds")}
                  error={errors.skillIds}
                  disabled={loading}
                />

                <InputField
                  label="Working Location"
                  placeholder="Enter working location"
                  value={formData?.workingLocation || ""}
                  onChange={(e) => handleChange(e, "workingLocation")}
                  error={errors?.workingLocation}
                  disabled={loading}
                />

                <InputField
                  label="City or Town"
                  placeholder="Enter your town"
                  value={formData?.town || ""}
                  onChange={(e) => handleChange(e, "town")}
                  error={errors.town}
                  disabled={loading}
                />

                <DropdownField
                  label="Country"
                  value={formData?.country || ""}
                  onChange={(value) => handleChange({ target: { value } }, "country")}
                  options={["India", "England", "Canada", "Australia"]} // ← replace with real list
                  error={errors.country}
                  disabled={loading}
                />

                <InputField
                  label="Year Of Experience"
                  placeholder="Enter your experience"
                  value={formData?.experience || ""}
                  onChange={(e) => handleChange(e, "experience")}
                  error={errors.experience}
                  disabled={loading}
                />

                <InputField
                  label="Hourly Charge (USD)"
                  placeholder="Enter hourly charge"
                  value={formData?.hourlyCharged || ""}
                  onChange={(e) => handleChange(e, "hourlyCharged")}
                  error={errors.hourlyCharged}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="button_group">
              <GradientButton
                className="update_btn"
                text={loading ? "Updating..." : "Update Profile"}
                onClick={handleSubmit}
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

export default PersonalInformation;