import React, { useState, useContext, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { Spin, Breadcrumb, Select, Input } from "antd";
import "./JobDetail.css";
import Header from "../../../../Components/Common/Header/Header";
import GradientButton from "../../../../Components/Common/GradientButton";
import Footer from "../../../../Components/Common/Footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../../contexts/AppContexts";
import { category_list, skill_list, create_job } from "../../../../api";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState(location.state?.type || "");

  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedApplicationDate, setSelectedApplicationDate] = useState(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [noSkillsMessage, setNoSkillsMessage] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    category: "",
    skills: "",
    description: "",
    startDate: "",
    applicationDate: "",
    country: "",
    city: "",
    files: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      try {
        const res = await axios.get(category_list, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.code === 200) {
          const categoryOptions = res.data.data.map((cat) => ({
            label: cat.title,
            value: cat._id,
          }));
          setCategories(categoryOptions);
        }
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [token]);

  const fetchSkills = async (categoryId) => {
    if (!categoryId) {
      setSkills([]);
      setSelectedSkills([]);
      setNoSkillsMessage(false);
      return;
    }
    setSkillLoading(true);
    setNoSkillsMessage(false);
    try {
      const res = await axios.post(
        skill_list,
        { categoryId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.code === 200) {
        const skillOptions = res.data.data.map((skill) => ({
          label: skill.title,
          value: skill._id,
        }));
        setSkills(skillOptions);
        setNoSkillsMessage(skillOptions.length === 0);
      } else {
        setSkills([]);
        setNoSkillsMessage(true);
      }
    } catch (err) {
      toast.error("Failed to load skills");
      setSkills([]);
      setNoSkillsMessage(true);
    } finally {
      setSkillLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedSkills([]);
    setErrors((prev) => ({ ...prev, category: "", skills: "" }));
    fetchSkills(value);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setErrors((prev) => ({ ...prev, files: "" }));
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    const maxFiles = 10;
    if (files.length + uploadedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Only PNG, JPG, JPEG, SVG files are allowed. (${file.name} is invalid)`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload({ target: { files } });
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!selectedCategory) newErrors.category = "Category is required";
    if (selectedSkills.length === 0)
      newErrors.skills = "At least one skill is required";
    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.trim().length < 50)
      newErrors.description = "Description must be at least 50 characters";
    if (!selectedStartDate) newErrors.startDate = "Start date is required";
    if (!selectedApplicationDate)
      newErrors.applicationDate = "Application closing date is required";
    if (!country) newErrors.country = "Country is required";
    if (!city.trim()) newErrors.city = "City / Town / Village is required";
    // if (uploadedFiles.length === 0)
    //   newErrors.files = "Please upload image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("categoryId", selectedCategory);
    formData.append("skillIds", JSON.stringify(selectedSkills));
    formData.append("projectTitle", title.trim());
    formData.append("projectDescription", description.trim());
    formData.append("startDate", selectedStartDate.format("YYYY-MM-DD"));
    formData.append("closingDate", selectedApplicationDate.format("YYYY-MM-DD"));
    formData.append("location", country);
    formData.append("city", city.trim());
    uploadedFiles.forEach((file) => {
      formData.append("uploadImage", file);
    });

    try {
      const resp = await axios.post(create_job, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.data.code === 200) {
        toast.success(`${type === "project" ? "Project" : "Job"} posted successfully!`);
        setTitle("");
        setDescription("");
        setSelectedCategory(undefined);
        setSelectedSkills([]);
        setSkills([]);
        setSelectedStartDate(null);
        setSelectedApplicationDate(null);
        setCountry("");
        setCity("");
        setUploadedFiles([]);
        setAgreed(false);
        setErrors({});
      }
    } catch (err) {
      toast.error(err.response?.data?.error_description || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  const titleLabel = type === "project" ? "Project Title" : "Job Title";

  const africanCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cape Verde",
    "Cameroon", "Central African Republic", "Chad", "Comoros",
    "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea",
    "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
    "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya",
    "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique",
    "Namibia", "Niger", "Nigeria", "Republic of the Congo", "Réunion", "Rwanda",
    "Saint Helena", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone",
    "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia",
    "Uganda", "Zambia", "Zimbabwe",
  ].sort();

  return (
    <>
      <Header />

      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Post a New {type === "project" ? "Project" : "Job"}</h1>
      </div>

      <div className="breadcrumb">
        <Breadcrumb
          separator={<FiChevronRight size={14} className="ss" />}
          items={[
            {
              title: (
                <Link to={`/${type}`}>
                  {type === "project" ? "Project" : "Job"} Listing
                </Link>
              ),
            },
            { title: `Post a New ${type === "project" ? "Project" : "Job"}` },
          ]}
        />
      </div>

      <div className="postjob-wrapper">
        <h2>Post a New {type === "project" ? "Project" : "Job"}</h2>

        <Spin spinning={loading} tip={`Posting your ${type}...`}>
          <form className="postjob-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="password-label">{titleLabel}</label>
              <input
                type="text"
                placeholder={`Enter ${type === "project" ? "project" : "job"} title`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                maxLength="150"
                disabled={loading}
              />
              {errors.title && <p className="error-text">{errors.title}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="password-label">Category</label>
                <Select
                  placeholder="Select Category"
                  value={selectedCategory ?? undefined}
                  onChange={handleCategoryChange}
                  options={categories}
                  loading={categories.length === 0 && token}
                  notFoundContent="No categories available"
                  allowClear
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: "100%" }}
                  disabled={loading}
                />
                {errors.category && <p className="error-text">{errors.category}</p>}
              </div>

              <div className="form-group">
                <label className="password-label">Required Skills</label>
                <Select
                  mode="multiple"
                  placeholder={
                    !selectedCategory
                      ? "First select a category"
                      : skillLoading
                        ? "Loading skills..."
                        : noSkillsMessage
                          ? "No skills added for this category yet"
                          : "Select Skills"
                  }
                  options={skills}
                  value={selectedSkills}
                  onChange={(values) => {
                    setSelectedSkills(values);
                    setErrors((prev) => ({ ...prev, skills: "" }));
                  }}
                  loading={skillLoading}
                  disabled={!selectedCategory || skillLoading || noSkillsMessage || loading}
                  allowClear
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  optionFilterProp="label"
                  style={{ width: "100%" }}
                />
                {errors.skills && <p className="error-text">{errors.skills}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="password-label">Country</label>
                <Select
                  showSearch
                  placeholder="Select Country"
                  value={country || undefined}
                  onChange={(val) => {
                    setCountry(val);
                    setErrors((prev) => ({ ...prev, country: "" }));
                  }}
                  allowClear
                  filterOption={(input, option) =>
                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={loading}
                >
                  {africanCountries.map((c) => (
                    <Select.Option key={c} value={c}>
                      {c}
                    </Select.Option>
                  ))}
                </Select>
                {errors.country && <p className="error-text">{errors.country}</p>}
              </div>

              <div className="form-group">
                <label className="password-label">City, Town or Village</label>
                <input
                  type="text"
                  placeholder="Enter city, town or village"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setErrors((prev) => ({ ...prev, city: "" }));
                  }}
                  disabled={loading}
                />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="password-label">
                {type === "project" ? "Project" : "Job"} Description
              </label>
              <textarea
                placeholder="Describe your requirements in detail (min 50 characters)"
                rows="6"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                disabled={loading}
              />
              {errors.description && (
                <p className="error-text">
                  {errors.description.includes("required")
                    ? "Description is required"
                    : "Description must be at least 50 characters"}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="password-label">
                Upload Image (PNG, JPG, JPEG, SVG)
              </label>
              <div
                className="upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ borderColor: errors.files ? "#ff4d4f" : "#d9d9d9" }}
              >
                <MdOutlineCloudUpload className="upload-icon" />
                <p>Choose file(s) or drag & drop here</p>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="file-upload"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => document.getElementById("file-upload").click()}
                  disabled={loading}
                >
                  SELECT
                </button>
                {uploadedFiles.length > 0 && (
                  <div className="file-list" style={{ marginTop: "12px" }}>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile(index)}
                          disabled={loading}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.files && <p className="error-text">{errors.files}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="password-label">Proposed Start Date</label>
                <input
                  type="date"
                  value={selectedStartDate ? selectedStartDate.format("YYYY-MM-DD") : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedStartDate(value ? dayjs(value) : null);
                    setErrors((prev) => ({ ...prev, startDate: "" }));
                  }}
                  min={dayjs().format("YYYY-MM-DD")}
                  disabled={loading}
                />
                {errors.startDate && <p className="error-text">{errors.startDate}</p>}
              </div>

              <div className="form-group">
                <label className="password-label">
                  {type === "project" ? "Quotations" : "Applications"} Closing Date
                </label>
                <input
                  type="date"
                  value={
                    selectedApplicationDate
                      ? selectedApplicationDate.format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedApplicationDate(value ? dayjs(value) : null);
                    setErrors((prev) => ({ ...prev, applicationDate: "" }));
                  }}
                  min={dayjs().format("YYYY-MM-DD")} // disables past dates
                  disabled={loading}
                />
                {errors.applicationDate && (
                  <p className="error-text">{errors.applicationDate}</p>
                )}
              </div>
            </div>

            <div className="pj-terms">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms">
                By proceeding, I confirm that I have read and agree to the{" "}
                <span onClick={() => navigate("/terms-&-conditions")}>
                  Terms and Conditions
                </span>
              </label>
            </div>

            <GradientButton
              type="submit"
              className="change-password--"
              text={loading ? "Posting..." : "Submit"}
              disabled={loading || !agreed}
            />
          </form>
        </Spin>
      </div>

      <Footer />
    </>
  );
};

export default JobDetails;