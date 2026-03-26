import React, { useContext, useState, useEffect, useRef } from "react";
import { Spin, Breadcrumb } from "antd";
import DropdownField from "../../../Components/Common/InputField/DropdownField";
import InputField from "../../../Components/Common/InputField/InputField";
import GradientButton from "../../../Components/Common/GradientButton";
import "./CreateAnotherProfile.css";
import axios from "axios";
import {
  member_category_list,
  member_profile_by_id,
  member_skill_list,
  member_update_sub_profile,
} from "../../../api";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import { AppContext } from "../../../contexts/AppContexts";
import { toast } from "react-toastify";
import { validateForm } from "../../../utils/validators/validator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const EditAnotherProfile = () => {
  const { user, token, refreshProfile } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const locationInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillLoading, setSkillLoading] = useState(false);
  const [photoGallery, setPhotoGallery] = useState([]);
  const location = useLocation();
  const profileId = location.state;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isPremium = user?.membership === "Premium";
  const isFree = user?.membership === "Free";
  useEffect(() => { refreshProfile(); }, []);

  const rules = {
    fullName: [{ type: "required", message: "Please enter full name." }],
    gender: [{ type: "required", message: "Please select gender." }],
    categoryId: [{ type: "required", message: "Please select category." }],
    skillIds: [
      { type: "required", message: "Please enter at least one skill." },
    ],
    email: [
      { type: "required", message: "Please enter email." },
      { type: "email", message: "Please enter a valid email." },
    ],
    workLocation: [
      { type: "required", message: "Please select your working location." },
    ],
    country: [{ type: "required", message: "Please enter country." }],
    businessTradingName: [
      { type: "required", message: "Please enter business trading name." },
      {
        type: "min",
        value: 2,
        message: "Business name must be at least 2 characters.",
      },
    ],
    workDescription: [
      { type: "required", message: "Please enter work description." },
      {
        type: "min",
        value: 20,
        message: "Work description must be at least 20 characters.",
      },
      {
        type: "max",
        value: 200,
        message: "Work description must be under 200 characters.",
      },
    ],
    overview: [
      { type: "required", message: "Please enter profile overview." },
      {
        type: "min",
        value: 20,
        message: "Profile overview must be at least 20 characters.",
      },
      {
        type: "max",
        value: 900,
        message: "Profile overview must be under 900 characters.",
      },
    ],
  };

  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    telephoneNumber: "",
    phoneNumber: "",
    gender: "",
    businessTradingName: "",
    categoryId: "",
    skillIds: [],
    workLocation: "",
    country: "",
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) {
        toast.error("No profile ID provided");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${member_profile_by_id}/${profileId}`,
        );
        if (response.data.status && response.data.data.length > 0) {
          setProfile(response.data.data[0]);
        } else {
          toast.error("Profile not found");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error_description || "Failed to fetch profile",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [profileId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        id: profileId,
        fullName: profile.memberName || "",
        email: profile.memberEmail || "",
        phoneNumber: profile.phoneNumber || "",
        telephoneNumber: profile.telephoneNumber || "",
        gender: profile.gender
          ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
          : "",
        businessTradingName: profile.businessTradingName || "",
        workLocation: profile.workLocation || "",
        country: profile.country || "",
        workDescription: profile.workDescription || "",
        overview: profile.overview || "",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        socialLinks: {
          facebook: profile.socialLinks?.facebook || "",
          instagram: profile.socialLinks?.instagram || "",
          linkedin: profile.socialLinks?.linkedin || "",
          youtube: profile.socialLinks?.youtube || "",
          website: profile.socialLinks?.website || "",
          tiktok: profile.socialLinks?.tiktok || "",
          twitter: profile.socialLinks?.twitter || "",
        },
        categoryId: profile.categoryId || "",
        skillIds: Array.isArray(profile.skillIds)
          ? profile.skillIds
          : profile.skills?.map((s) => s._id) || [],
      });

      if (profile?.photoGallery) {
        setPhotoGallery(
          profile.photoGallery.map((url, idx) => ({
            id: `existing-${idx}`,
            url,
            isExisting: true,
          })),
        );
      }
    }
    if (profile?.categoryId) fetchSkills(profile.categoryId);
  }, [profile]);

  const handleChange = (e, field) => {
    let value = e.target?.value ?? e;

    if (field === "skillIds") {
      setFormData((prev) => ({
        ...prev,
        skillIds: Array.isArray(value) ? value : [],
      }));
      if (errors.skillIds) setErrors((prev) => ({ ...prev, skillIds: "" }));
      return;
    }

    if (
      (field === "phoneNumber" || field === "telephoneNumber") &&
      !/^\+?[0-9 ]*$/.test(value)
    ) {
      return;
    }
    if (value.length > 0) {
      value = value.replace(/^\s+/, "");
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
        socialLinks: { ...prev.socialLinks, [field]: value },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Provide real-time validation feedback as requested
    if (
      (field === "workDescription" || field === "overview") &&
      value.length > 0 &&
      value.length < 20
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${field === "workDescription" ? "Work description" : "Profile overview"
          } must be at least 20 characters.`,
      }));
    } else if (
      field === "businessTradingName" &&
      value.length > 0 &&
      value.length < 2
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Business name must be at least 2 characters.",
      }));
    } else if (errors[field]) {
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(member_category_list, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.code === 200) {
          setCategories(
            res.data.data.map((c) => ({ label: c.title, value: c._id })),
          );
        }
      } catch (err) {
        toast.error(
          err.response?.data?.error_description || "Failed to load categories",
        );
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const fetchSkills = async (categoryId) => {
    if (!categoryId) {
      setSkills([]);
      return;
    }
    setSkillLoading(true);
    try {
      const res = await axios.post(
        member_skill_list,
        { categoryId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.code === 200) {
        setSkills(res.data.data.map((s) => ({ label: s.title, value: s._id })));
      } else {
        setSkills([]);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error_description || "Failed to load skills",
      );
      setSkills([]);
    } finally {
      setSkillLoading(false);
    }
  };

  const handleUpdate = async () => {
    const validationErrors = validateForm(formData, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const formDataObj = new FormData();

    formDataObj.append("id", formData.id);
    formDataObj.append("fullName", formData.fullName);
    formDataObj.append("email", formData.email);
    formDataObj.append("gender", formData.gender.toLowerCase());
    formDataObj.append("phoneNumber", formData.phoneNumber);
    formDataObj.append("telephoneNumber", formData.telephoneNumber || "");
    if (formData.categoryId)
      formDataObj.append("categoryId", formData.categoryId);
    if (Array.isArray(formData.skillIds) && formData.skillIds.length > 0) {
      formDataObj.append("skillIds", JSON.stringify(formData.skillIds));
    }
    formDataObj.append("businessTradingName", formData.businessTradingName);
    formDataObj.append("workLocation", formData.workLocation);
    formDataObj.append("country", formData.country);
    formDataObj.append("latitude", formData.latitude || "");
    formDataObj.append("longitude", formData.longitude || "");
    formDataObj.append("workDescription", formData.workDescription || "");
    formDataObj.append("overview", formData.overview || "");

    if (isPremium) {
      formDataObj.append("socialLinks", JSON.stringify(formData.socialLinks));
    }

    const newFiles = photoGallery
      .filter((photo) => !photo.isExisting && photo.file)
      .map((photo) => photo.file);

    newFiles.forEach((file) => {
      formDataObj.append("photoGallery", file);
    });

    try {
      const response = await axios.put(member_update_sub_profile, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200 || response.data.code === 200) {
        toast.info("Profile update request submitted for admin approval.");
        refreshProfile();
        navigate(-1);
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error_description ||
        err.response?.data?.message ||
        "Network error. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
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
          <div className="sc">
            <div className="breadcrumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  { title: <Link to="/member-profile">Member Profile</Link> },
                  { title: "Update Profile" },
                ]}
              />
            </div>
          </div>
          <h2>Update Profile</h2>

          <Spin spinning={isSubmitting} tip="Updating profile...">
            <div className="info-card-container">
              <div className="info-form-grid">
                <InputField
                  label="Full Name"
                  placeholder="Please enter full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange(e, "fullName")}
                  error={errors.fullName}
                  disabled={isSubmitting}
                />

                <DropdownField
                  label="Gender"
                  value={formData.gender}
                  onChange={(val) => handleChange(val, "gender")}
                  options={["Male", "Female", "Other"]}
                  error={errors.gender}
                  disabled={isSubmitting}
                />

                <div className="info-row">
                  <DropdownField
                    label="Category"
                    value={formData.categoryId}
                    onChange={(val) => {
                      handleChange(val, "categoryId");
                      setFormData((prev) => ({ ...prev, skillIds: [] }));
                      fetchSkills(val);
                    }}
                    options={categories}
                    error={errors.categoryId}
                    placeholder="Choose category"
                    disabled={isSubmitting}
                  />

                  <DropdownField
                    label="Skills"
                    value={formData.skillIds}
                    onChange={(selected) => {
                      if (selected.length > 20) return;
                      handleChange(selected, "skillIds");
                    }}
                    options={skills}
                    multiple={true}
                    error={errors.skillIds}
                    loading={skillLoading}
                    placeholder={skillLoading ? "Loading…" : "Select skills"}
                    disabled={
                      !formData.categoryId || skillLoading || isSubmitting
                    }
                  />
                </div>

                <InputField
                  label="Email"
                  placeholder="Please enter email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, "email")}
                  error={errors.email}
                  disabled={isSubmitting}
                />

                <InputField
                  inputRef={locationInputRef}
                  label="Working Location"
                  placeholder="Type city/address"
                  value={formData.workLocation}
                  onChange={(e) => handleChange(e, "workLocation")}
                  error={errors.workLocation}
                  disabled={isSubmitting}
                />

                <InputField
                  label="Country"
                  value={formData.country}
                  disabled={true}
                  placeholder="Auto-filled from location"
                  error={errors.country}
                />

                <InputField
                  label="Business Trading Name"
                  placeholder="Your business name"
                  value={formData.businessTradingName}
                  onChange={(e) => handleChange(e, "businessTradingName")}
                  error={errors.businessTradingName}
                  disabled={isSubmitting}
                />

                <InputField
                  label="Work Description (20-200 chars)"
                  placeholder="Short tagline or summary (min 20 characters)"
                  value={formData.workDescription}
                  onChange={(e) => handleChange(e, "workDescription")}
                  error={errors.workDescription}
                  disabled={isSubmitting}
                />

                <InputField
                  label="Profile Overview (20-900 chars)"
                  placeholder="Tell clients about your experience and services"
                  value={formData.overview}
                  onChange={(e) => handleChange(e, "overview")}
                  error={errors.overview}
                  multiline
                  rows={6}
                  disabled={isSubmitting}
                />
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
                    disabled={photoGallery.length >= 12 || isSubmitting}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoGallery.length >= 12 || isSubmitting}
                  >
                    + Add Photos
                  </button>
                </div>

                {photoGallery.length > 0 && (
                  <div className="gallery-grid">
                    {photoGallery.map((photo) => (
                      <div key={photo.id} className="gallery-item">
                        <img
                          src={photo.isExisting ? photo.url : photo.preview}
                          alt="Gallery"
                          className="gallery-image"
                        />
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeletePhoto(photo.id)}
                          title="Delete photo"
                          disabled={isSubmitting}
                        >
                          ✕
                        </button>
                        {photo.isExisting && (
                          <span className="existing-badge">Existing</span>
                        )}
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
                    Profile
                  </h3>
                </div>

                <div className="info-card-container mt-3">
                  <div className="form_grid">
                    <InputField
                      label="Facebook Profile URL (Optional)"
                      placeholder="Enter Facebook Link"
                      value={formData.socialLinks.facebook}
                      onChange={(e) => handleChange(e, "facebook")}
                      disabled={isSubmitting}
                    />
                    <InputField
                      label="LinkedIn URL (Optional)"
                      placeholder="Enter LinkedIn URL"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleChange(e, "linkedin")}
                      disabled={isSubmitting}
                    />
                    <InputField
                      label="Instagram Profile URL (Optional)"
                      placeholder="Enter Instagram URL"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => handleChange(e, "instagram")}
                      disabled={isSubmitting}
                    />
                    <InputField
                      label="Youtube URL (Optional)"
                      placeholder="Enter Youtube URL"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => handleChange(e, "youtube")}
                      disabled={isSubmitting}
                    />
                    <InputField
                      label="TikTok URL (Optional)"
                      placeholder="Enter TikTok URL"
                      value={formData.socialLinks.tiktok}
                      onChange={(e) => handleChange(e, "tiktok")}
                      disabled={isSubmitting}
                    />
                    <InputField
                      label="Twitter Profile URL (Optional)"
                      placeholder="Enter Twitter Profile URL"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleChange(e, "twitter")}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="info-button-group">
              <GradientButton
                className="update-profile-btn"
                text={isSubmitting ? "Updating..." : "Update Profile"}
                onClick={handleUpdate}
                disabled={isSubmitting}
              />
            </div>
          </Spin>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditAnotherProfile;
