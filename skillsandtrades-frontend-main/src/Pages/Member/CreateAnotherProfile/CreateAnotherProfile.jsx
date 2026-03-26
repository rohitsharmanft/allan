import React, { useContext, useState, useEffect, useRef } from "react";
import DropdownField from "../../../Components/Common/InputField/DropdownField";
import InputField from "../../../Components/Common/InputField/InputField";
import GradientButton from "../../../Components/Common/GradientButton";
import "./CreateAnotherProfile.css";
import axios from "axios";
import { add_profile_member } from "../../../api";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import { AppContext } from "../../../contexts/AppContexts";
import { toast } from "react-toastify";
import { validateForm } from "../../../utils/validators/validator";
import { Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const CreateAnotherProfile = () => {
  const { token, user, refreshProfile } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const locationInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillLoading, setSkillLoading] = useState(false);
  const [noSkillsMessage, setNoSkillsMessage] = useState(false);
  const [photoGallery, setPhotoGallery] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const isPremium = user?.membership === "Premium";
  const isFree = user?.membership === "Free";
  useEffect(() => {
    refreshProfile();
  }, []);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telephoneNumber: "",
    phoneNumber: "",
    gender: "",
    businessTradingName: "",
    workLocation: "",
    country: "",
    // experience: "",
    // hourlyCharged: "",
    // qualification: "",
    // affiliation: "",
    workDescription: "",
    overview: "",
    latitude: "",
    longitude: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      website: "",
      tiktok: "",
      twitter: "",
    },
  });
  console.log(user)

  useEffect(() => {
    if (user) {
      const profileData = user?.memberProfileData || {};
      setFormData({
        fullName: user?.fullName ?? "",
        email: user?.email ?? "",
        telephoneNumber: user?.telephoneNumber ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        gender: user?.gender ?? "",
        businessTradingName:
          user?.businessTradingName || profileData?.businessTradingName || "",
        workLocation:
          user?.state || profileData?.state || profileData?.workLocation || "",
        country: user?.country || profileData?.country || "",
        workDescription: profileData?.workDescription ?? "",
        overview: profileData?.overview ?? "",
        latitude: user?.latitude || profileData?.latitude || "",
        longitude: user?.longitude || profileData?.longitude || "",
        socialLinks: {
          facebook: profileData?.socialLinks?.facebook ?? "",
          instagram: profileData?.socialLinks?.instagram ?? "",
          linkedin: profileData?.socialLinks?.linkedin ?? "",
          youtube: profileData?.socialLinks?.youtube ?? "",
          website: profileData?.socialLinks?.website ?? "",
          tiktok: profileData?.socialLinks?.tiktok ?? "",
          twitter: profileData?.socialLinks?.twitter ?? "",
        },
      });
    }
  }, [user]);

  const validateField = (value, fieldName) => {
    if (fieldName === "fullName") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please enter full name." };
      }
      if (value.length < 2) {
        return {
          valid: false,
          error: "Full name must be at least 2 characters.",
        };
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return {
          valid: false,
          error:
            "Full name can only contain letters, spaces, hyphens, and apostrophes.",
        };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "email") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please enter email." };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, error: "Please enter a valid email." };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "gender") {
      if (!value) {
        return { valid: false, error: "Please select gender." };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "workLocation") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please select your working location." };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "country") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please enter country." };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "businessTradingName") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please enter business trading name." };
      }
      if (value.length < 2) {
        return {
          valid: false,
          error: "Business name must be at least 2 characters.",
        };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "workDescription") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please enter work description." };
      }
      if (value.length < 20) {
        return {
          valid: false,
          error: "Work description must be at least 20 characters.",
        };
      }
      if (value.length > 200) {
        return {
          valid: false,
          error: `Work description must be under 200 characters. (${value.length}/200)`,
        };
      }
      return { valid: true, error: "" };
    }

    if (fieldName === "overview") {
      if (!value || value.trim() === "") {
        return { valid: false, error: "Please enter profile overview." };
      }
      if (value.length < 20) {
        return {
          valid: false,
          error: "Profile overview must be at least 20 characters.",
        };
      }
      if (value.length > 900) {
        return {
          valid: false,
          error: `Profile overview must be under 900 characters. (${value.length}/900)`,
        };
      }
      return { valid: true, error: "" };
    }

    // if (fieldName === "experience") {
    //   if (!value || value.trim() === "") {
    //     return { valid: false, error: "Please enter experience." };
    //   }
    //   const isNumeric = /^\d+(\.\d+)?$/.test(value);
    //   if (!isNumeric) {
    //     return { valid: false, error: "Experience must contain only numbers." };
    //   }
    //   const numValue = parseInt(value);
    //   if (numValue < 0) {
    //     return { valid: false, error: "Experience cannot be negative." };
    //   }
    //   if (numValue > 70) {
    //     return { valid: false, error: "Experience cannot exceed 70 years." };
    //   }
    //   return { valid: true, error: "" };
    // }

    // if (fieldName === "hourlyCharged") {
    //   if (!value || value.trim() === "") {
    //     return { valid: false, error: "Please enter hourly charge." };
    //   }
    //   const isNumeric = /^\d+(\.\d+)?$/.test(value);
    //   if (!isNumeric) {
    //     return { valid: false, error: "Hourly charge must contain only numbers." };
    //   }
    //   const numValue = parseFloat(value);
    //   if (numValue < 1) {
    //     return { valid: false, error: "Hourly charge must be at least 1." };
    //   }
    //   if (numValue > 10000) {
    //     return { valid: false, error: "Hourly charge cannot exceed 10000." };
    //   }
    //   return { valid: true, error: "" };
    // }

    // if (fieldName === "qualification") {
    //   if (!value || value.trim() === "") {
    //     return { valid: false, error: "Please enter highest qualification." };
    //   }
    //   if (value.length < 2) {
    //     return { valid: false, error: "Qualification must be at least 2 characters." };
    //   }
    //   return { valid: true, error: "" };
    // }

    // if (fieldName === "affiliation") {
    //   if (!value || value.trim() === "") {
    //     return { valid: false, error: "Please enter highest affiliation." };
    //   }
    //   if (value.length < 2) {
    //     return { valid: false, error: "Affiliation must be at least 2 characters." };
    //   }
    //   return { valid: true, error: "" };
    // }

    return { valid: true, error: "" };
  };

  const handleChange = (e, field) => {
    let value = e.target?.value ?? e;

    if (
      (field === "phoneNumber" || field === "telephoneNumber") &&
      !/^\+?[0-9 ]*$/.test(value)
    ) {
      return;
    }

    const socialFields = [
      "facebook",
      "instagram",
      "linkedin",
      "youtube",
      "website",
      "tiktok",
      "twitter",
    ];
    if (socialFields.includes(field)) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate field dynamically
    const validation = validateField(value, field);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const maxPhotos = 12;
    const remaining = maxPhotos - photoGallery.length;

    if (files.length > remaining) {
      toast.error(
        `You can only upload ${remaining} more photo(s). Maximum is ${maxPhotos}.`,
      );
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB.`);
        return false;
      }
      return true;
    });

    const fileReaders = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) =>
            resolve({
              id: `new-${Date.now()}-${Math.random()}`,
              file,
              preview: ev.target.result,
              isExisting: false,
            });
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(fileReaders).then((results) => {
      setPhotoGallery((prev) => [...prev, ...results]);
      toast.success(`${results.length} photo(s) uploaded successfully!`);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePhoto = (id) => {
    setPhotoGallery((prev) => prev.filter((photo) => photo.id !== id));
    toast.info("Photo removed from gallery");
  };

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      toast.error("Map services unavailable – API key missing");
      return;
    }

    if (window.google?.maps?.places) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    script.onerror = () => toast.error("Failed to load Google Maps.");

    document.body.appendChild(script);

    return () => {
      const existing = document.querySelector(`script[src="${scriptUrl}"]`);
      if (existing) existing.remove();
    };
  }, []);

  useEffect(() => {
    if (!isGoogleMapsLoaded || !locationInputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
    );
    autocomplete.setFields([
      "formatted_address",
      "address_components",
      "geometry",
    ]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        toast.error("Please select a location from the suggestions.");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      let countryName = "";
      for (const component of place.address_components || []) {
        if (component.types.includes("country")) {
          countryName = component.long_name;
          break;
        }
      }
      setFormData((prev) => ({
        ...prev,
        workLocation: place.formatted_address,
        country: countryName || "Unknown Country",
        latitude: lat,
        longitude: lng,
      }));
      setErrors((prev) => ({ ...prev, workLocation: "", country: "" }));
    });
  }, [isGoogleMapsLoaded]);

  // Enhanced validation with all field checks
  const validateFormWithAllChecks = (data) => {
    const validationErrors = {};

    // Validate all required fields
    const fieldsToValidate = [
      "fullName",
      "email",
      "gender",
      "workLocation",
      "country",
      "businessTradingName",
      "workDescription",
      "overview",
    ];

    fieldsToValidate.forEach((field) => {
      const validation = validateField(data[field], field);
      if (!validation.valid) {
        validationErrors[field] = validation.error;
      }
    });

    return validationErrors;
  };

  const handleUpdate = async () => {
    const validationErrors = validateFormWithAllChecks(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    const formDataObj = new FormData();
    Object.entries({
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      telephoneNumber: formData.telephoneNumber,
      gender: formData.gender,
      businessTradingName: formData.businessTradingName,
      workLocation: formData.workLocation,
      country: formData.country,
      workDescription: formData.workDescription,
      overview: formData.overview,
      latitude: formData.latitude,
      longitude: formData.longitude,
      socialLinks: isPremium ? JSON.stringify(formData.socialLinks) : undefined,
    }).forEach(([key, value]) => {
      if (value !== undefined) formDataObj.append(key, value);
    });

    const newFiles = photoGallery
      .filter((photo) => !photo.isExisting && photo.file)
      .map((photo) => photo.file);
    newFiles.forEach((file) => {
      formDataObj.append("photoGallery", file);
    });

    try {
      const response = await axios.post(add_profile_member, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.code === 200 || response.data.status === 200) {
        toast.success("Profile created successfully!");
        setPhotoGallery([]);
        refreshProfile();
        navigate(-1);
      } else {
        toast.error(response.data?.message || "Failed to create profile");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error_description ||
        "Network error. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLater = async () => {
    setIsSavingDraft(true);
    const formDataObj = new FormData();
    Object.entries({
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      telephoneNumber: formData.telephoneNumber,
      gender: formData.gender,
      businessTradingName: formData.businessTradingName,
      workLocation: formData.workLocation,
      country: formData.country,
      workDescription: formData.workDescription,
      overview: formData.overview,
      latitude: formData.latitude,
      longitude: formData.longitude,
      socialLinks: isPremium ? JSON.stringify(formData.socialLinks) : undefined,
    }).forEach(([key, value]) => {
      if (value !== undefined) formDataObj.append(key, value);
    });

    const newFiles = photoGallery
      .filter((photo) => !photo.isExisting && photo.file)
      .map((photo) => photo.file);
    newFiles.forEach((file) => {
      formDataObj.append("photoGallery", file);
    });

    try {
      const response = await axios.post(add_profile_member, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.code === 200 || response.data.status === 200) {
        toast.success("Details saved successfully!");
        refreshProfile();
        navigate(-1);
      } else {
        toast.error(response.data?.message || "Failed to save details");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error_description ||
        "Network error. Please try again.",
      );
    } finally {
      setIsSavingDraft(false);
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
          <div className="breadcrumb_">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                { title: <Link to="/member-profile">Member Profile</Link> },
                { title: "Complete Profile" },
              ]}
            />
          </div>
          <h2>Complete Profile</h2>

          <div className="info-card-container">
            <div className="info-form-grid">
              <InputField
                label="Full Name"
                placeholder="Please enter full name"
                value={formData.fullName}
                onChange={(e) => handleChange(e, "fullName")}
                error={errors.fullName}
              />

              <DropdownField
                label="Gender"
                value={formData.gender}
                onChange={(val) => handleChange(val, "gender")}
                options={["Male", "Female", "Other"]}
                error={errors.gender}
              />

              <InputField
                label="Email"
                placeholder="Please enter email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                error={errors.email}
              />

              <InputField
                inputRef={locationInputRef}
                label="Working Location"
                placeholder="Type city/address"
                value={formData.workLocation}
                onChange={(e) => handleChange(e, "workLocation")}
                error={errors.workLocation}
                helperText="Start typing – suggestions limited to Africa"
              />

              <InputField
                label="Country"
                value={formData.country}
                disabled
                placeholder="Auto-filled from location"
                error={errors.country}
              />

              <InputField
                label="Business Trading Name"
                placeholder="Your business name"
                value={formData.businessTradingName}
                onChange={(e) => handleChange(e, "businessTradingName")}
                error={errors.businessTradingName}
              />

              <InputField
                label="Work Description (20-200 chars)"
                placeholder="Short tagline or summary (min 20 characters)"
                value={formData.workDescription}
                onChange={(e) => handleChange(e, "workDescription")}
                error={errors.workDescription}
              />

              <InputField
                label="Profile Overview (20-900 chars)"
                placeholder="Tell clients about your experience and services"
                value={formData.overview}
                onChange={(e) => handleChange(e, "overview")}
                error={errors.overview}
                multiline
                rows={6}
              />

              {/* <div className="info-row">
                <InputField
                  label="Experience (Years)"
                  placeholder="e.g. 8"
                  value={formData.experience}
                  onChange={(e) => handleChange(e, "experience")}
                  error={errors.experience}
                  inputMode="numeric"
                  maxLength="2"
                />
                <InputField
                  label="Hourly Charge (USD)"
                  placeholder="e.g. 35"
                  value={formData.hourlyCharged}
                  onChange={(e) => handleChange(e, "hourlyCharged")}
                  error={errors.hourlyCharged}
                  inputMode="numeric"
                  maxLength="5"
                />
              </div>

              <div className="info-row">
                <InputField
                  label="Highest Qualification"
                  placeholder="e.g. BSc Electrical Engineering"
                  value={formData.qualification}
                  onChange={(e) => handleChange(e, "qualification")}
                  error={errors.qualification}
                />
                <InputField
                  label="Highest Affiliation"
                  placeholder="e.g. COREN, University of Cape Town"
                  value={formData.affiliation}
                  onChange={(e) => handleChange(e, "affiliation")}
                  error={errors.affiliation}
                />
              </div> */}
            </div>
          </div>
          {!isFree && (
            <div className="photo-gallery-section">
              <h3>Photo Gallery</h3>
              <p className="gallery-helper-text">
                Upload high-quality photos to showcase your work. Maximum 5MB
                per photo.
              </p>

              <div className="upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={photoGallery.length >= 12}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoGallery.length >= 12}
                >
                  + Add Photos
                </button>
              </div>

              {photoGallery.length > 0 && (
                <div className="gallery-grid">
                  {photoGallery.map((photo) => (
                    <div key={photo.id} className="gallery-item">
                      <img
                        src={photo.preview}
                        alt="Gallery"
                        className="gallery-image"
                      />
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeletePhoto(photo.id)}
                        title="Delete photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {isPremium && (
            <>
              <div className="h3">
                <h3>
                  Social Media Links - These Will Appear On Your Public
                  Profile{" "}
                </h3>
              </div>

              <div className="change-password_container mt-3">
                <div className="form_grid">
                  <InputField
                    label="Facebook Profile URL (Optional)"
                    placeholder="Enter Facebook Link"
                    value={formData?.socialLinks?.facebook}
                    onChange={(e) => handleChange(e, "facebook")}
                  />

                  <InputField
                    label="LinkedIn URL (Optional)"
                    placeholder="Enter LinkedIn URL"
                    value={formData?.socialLinks?.linkedin}
                    onChange={(e) => handleChange(e, "linkedin")}
                  />

                  <InputField
                    label="Instagram Profile URL (Optional)"
                    placeholder="Enter Instagram URL"
                    value={formData?.socialLinks?.instagram}
                    onChange={(e) => handleChange(e, "instagram")}
                  />

                  <InputField
                    label="Youtube URL (Optional)"
                    placeholder="Enter Youtube URL"
                    value={formData?.socialLinks?.youtube}
                    onChange={(e) => handleChange(e, "youtube")}
                  />

                  <InputField
                    label="TikTok URL (Optional)"
                    placeholder="Enter TikTok URL"
                    value={formData?.socialLinks?.tiktok}
                    onChange={(e) => handleChange(e, "tiktok")}
                  />

                  <InputField
                    label="Twitter Profile URL (Optional)"
                    placeholder="Enter Twitter Profile URL"
                    value={formData?.socialLinks?.twitter}
                    onChange={(e) => handleChange(e, "twitter")}
                  />
                </div>
              </div>
            </>
          )}

          <div className="info-button-group-">
            <GradientButton
              className="update-profile-btn"
              text="Complete Profile"
              onClick={handleUpdate}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
            {/* <GradientButton
                className="update-profile-btn"
                text="Save Details and Return Later"
                onClick={handleSaveLater}
                loading={isSavingDraft}
                disabled={isSavingDraft}
              /> */}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CreateAnotherProfile;