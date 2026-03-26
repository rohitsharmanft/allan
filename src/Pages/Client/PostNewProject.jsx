import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  Upload,
  DatePicker,
  Breadcrumb,
  message,
} from "antd";
import GradientButton from "../../Components/Common/GradientButton";
import "./PostNewJob.css";
import ClientSideBar from "../../Components/Client/ClientPannel/ClientSideBar";
import Footer from "../../Components/Common/Footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/AppContexts";
import { category_list, create_job, skill_list } from "../../api";
import { FiChevronRight, FiUploadCloud } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Common/Header/Header";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Dragger } = Upload;

const PostNewProject = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const { token } = useContext(AppContext);
  const [skillLoading, setSkillLoading] = useState(false);
  const [noSkillsMessage, setNoSkillsMessage] = useState(false);
  const [selectedSkillsCount, setSelectedSkillsCount] = useState(0);
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();
  const type = "project";

  const fetchSkills = async (categoryId) => {
    if (!categoryId) {
      setSkills([]);
      setNoSkillsMessage(false);
      return;
    }
    setSkillLoading(true);
    setNoSkillsMessage(false);
    const payload = { categoryId };
    try {
      const res = await axios.post(skill_list, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.code === 200) {
        const skillOptions = res.data.data.map((skill) => ({
          label: skill.title,
          value: skill._id,
        }));
        setSkills(skillOptions);
        setNoSkillsMessage(skillOptions.length === 0);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error_description || "Failed to load skills",
      );
      setSkills([]);
      setNoSkillsMessage(true);
    } finally {
      setSkillLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    form.setFieldsValue({ skills: [] });
    setSelectedSkillsCount(0);
    fetchSkills(value);
  };

  const handleSkillsChange = (selectedValues) => {
    if (selectedValues.length > 5) {
      message.destroy();
      message.error("You can only select maximum 5 skills");
      form.setFieldsValue({ skills: selectedValues.slice(0, 5) });
      setSelectedSkillsCount(5);
      return;
    }
    setSelectedSkillsCount(selectedValues.length);
    form.setFieldsValue({ skills: selectedValues });
  };

  useEffect(() => {
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 100;
    message.config({ top: navbarHeight + 80, zIndex: 9999 });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(category_list, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.code === 200) {
          const categoriesOption = res.data.data.map((cat) => ({
            label: cat.title,
            value: cat._id,
          }));
          setCategories(categoriesOption);
        }
      } catch (err) {
        toast.error(
          err.response?.data?.error_description || "Failed to load categories",
        );
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const onFinish = async (values) => {
    if (!token) return toast.error("Please log in again.");
    setLoading(true);

    const formData = new FormData();
    formData.append("type", "project");
    formData.append("categoryId", values.category);
    formData.append("skillIds", JSON.stringify(values.skills || []));
    formData.append("projectTitle", values.title);
    formData.append("projectDescription", values.desc);
    formData.append("location", values.locationCountry || "");
    formData.append("city", values.locationCity || "");
    formData.append("startDate", values.startDate?.format("YYYY-MM-DD") || "");
    formData.append(
      "quotationsDate",
      values.quotationsDate?.format("YYYY-MM-DD") || "",
    );
    values.files?.forEach((file) => {
      formData.append("uploadImage", file.originFileObj);
    });

    try {
      const response = await axios.post(create_job, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.code === 200) {
        toast.success("Project posted successfully!");
        form.resetFields();
        setSelectedSkillsCount(0);
        setAgreed(false);
        navigate("/client-project");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error_description ||
        err.response?.data?.error ||
        "Failed to post.";
      toast.error(msg);
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
        <div className="post-job-wrap">
          <div className="breadcrumb">
            <Breadcrumb
              separator={
                <FiChevronRight size={14} className="breadcrumb-separator" />
              }
              items={[
                { title: <Link to="/client-project">Projects</Link> },
                { title: <strong>Post New Project</strong> },
              ]}
            />
          </div>

          <h2 className="pj-title">Post New Project</h2>

          <div className="pj-card">
            <Form
              form={form}
              layout="vertical"
              size="large"
              className="pj-form"
              onFinish={onFinish}
              initialValues={{ type: "project" }}
            >
              <div className="pj-row">
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                  className="pj-item"
                >
                  <Select
                    placeholder="Select Category"
                    options={categories}
                    onChange={handleCategoryChange}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Required Skills"
                  name="skills"
                  className="pj-item"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!form.getFieldValue("category"))
                          return Promise.resolve();
                        if (!value || value.length === 0)
                          return Promise.reject(
                            new Error("Please select at least 1 skill"),
                          );
                        if (value.length > 5)
                          return Promise.reject(
                            new Error("Maximum 5 skills allowed"),
                          );
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder={
                      !form.getFieldValue("category")
                        ? "First select a category"
                        : skillLoading
                          ? "Loading skills..."
                          : noSkillsMessage
                            ? "No skills added for this category yet"
                            : "Select Skills"
                    }
                    options={skills}
                    loading={skillLoading}
                    disabled={
                      !form.getFieldValue("category") ||
                      skillLoading ||
                      noSkillsMessage
                    }
                    allowClear
                    showSearch
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    optionFilterProp="label"
                    onChange={handleSkillsChange}
                    tagRender={(props) => {
                      const skillName =
                        skills.find((s) => s.value === props.value)?.label ||
                        props.label;
                      return (
                        <span className="skill-tag">
                          {skillName}
                          <span className="skill-close" onClick={props.onClose}>
                            ×
                          </span>
                        </span>
                      );
                    }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Project Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter a project title" },
                  {
                    min: 10,
                    message: "Title should be at least 10 characters",
                  },
                  {
                    max: 150,
                    message: "Title should not exceed 150 characters",
                  },
                ]}
              >
                <Input
                  placeholder="Enter a clear project title"
                  maxLength={150}
                  showCount
                />
              </Form.Item>

              <div className="pj-row">
                <Form.Item
                  label="Location"
                  name="locationCountry"
                  rules={[
                    { required: true, message: "Please select a country" },
                  ]}
                  className="pj-item"
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="Select Country"
                  >
                    {[
                      { code: "DZ", name: "Algeria" },
                      { code: "AO", name: "Angola" },
                      { code: "BJ", name: "Benin" },
                      { code: "BW", name: "Botswana" },
                      { code: "BF", name: "Burkina Faso" },
                      { code: "BI", name: "Burundi" },
                      { code: "CV", name: "Cape Verde" },
                      { code: "CM", name: "Cameroon" },
                      { code: "CF", name: "Central African Republic" },
                      { code: "TD", name: "Chad" },
                      { code: "KM", name: "Comoros" },
                      { code: "CD", name: "Democratic Republic of the Congo" },
                      { code: "DJ", name: "Djibouti" },
                      { code: "EG", name: "Egypt" },
                      { code: "GQ", name: "Equatorial Guinea" },
                      { code: "ER", name: "Eritrea" },
                      { code: "SZ", name: "Eswatini" },
                      { code: "ET", name: "Ethiopia" },
                      { code: "GA", name: "Gabon" },
                      { code: "GM", name: "Gambia" },
                      { code: "GH", name: "Ghana" },
                      { code: "GN", name: "Guinea" },
                      { code: "GW", name: "Guinea-Bissau" },
                      { code: "CI", name: "Ivory Coast" },
                      { code: "KE", name: "Kenya" },
                      { code: "LS", name: "Lesotho" },
                      { code: "LR", name: "Liberia" },
                      { code: "LY", name: "Libya" },
                      { code: "MG", name: "Madagascar" },
                      { code: "MW", name: "Malawi" },
                      { code: "ML", name: "Mali" },
                      { code: "MR", name: "Mauritania" },
                      { code: "MU", name: "Mauritius" },
                      { code: "MA", name: "Morocco" },
                      { code: "MZ", name: "Mozambique" },
                      { code: "NA", name: "Namibia" },
                      { code: "NE", name: "Niger" },
                      { code: "NG", name: "Nigeria" },
                      { code: "CG", name: "Republic of the Congo" },
                      { code: "RE", name: "Réunion" },
                      { code: "RW", name: "Rwanda" },
                      { code: "SH", name: "Saint Helena" },
                      { code: "ST", name: "São Tomé and Príncipe" },
                      { code: "SN", name: "Senegal" },
                      { code: "SC", name: "Seychelles" },
                      { code: "SL", name: "Sierra Leone" },
                      { code: "SO", name: "Somalia" },
                      { code: "ZA", name: "South Africa" },
                      { code: "SS", name: "South Sudan" },
                      { code: "SD", name: "Sudan" },
                      { code: "TZ", name: "Tanzania" },
                      { code: "TG", name: "Togo" },
                      { code: "TN", name: "Tunisia" },
                      { code: "UG", name: "Uganda" },
                      { code: "ZM", name: "Zambia" },
                      { code: "ZW", name: "Zimbabwe" },
                    ]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c) => (
                        <Select.Option key={c.code} value={c.name}>
                          {c.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Enter City, Town or Village"
                  name="locationCity"
                  className="pj-item"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please enter city, town or village",
                    },
                    {
                      min: 2,
                      message: "Location must be at least 2 characters",
                    },
                  ]}
                >
                  <Input placeholder="Enter city, town or village" />
                </Form.Item>
              </div>

              <Form.Item
                label="Project Description"
                name="desc"
                rules={[
                  {
                    required: true,
                    message: "Please write a project description",
                  },
                  {
                    min: 50,
                    message: "Description must be at least 50 characters",
                  },
                  {
                    max: 2000,
                    message: "Description should not exceed 2000 characters",
                  },
                ]}
              >
                <TextArea
                  placeholder="Describe your requirements in detail..."
                  rows={6}
                  showCount
                  className="desc-textarea"
                  maxLength={2000}
                />
              </Form.Item>

              <Form.Item
                label="Proposed Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select start date" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select Start Date"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Quotations closing Date"
                name="quotationsDate"
                rules={[
                  { required: true, message: "Please select quotations closing date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select Quotations closing Date"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Upload Image"
                name="files"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              // rules={[{ required: true, message: "Please select image" }]}
              >
                <Dragger
                  accept="image/*"
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("You can only upload image files!");
                      return Upload.LIST_IGNORE;
                    }
                    return true;
                  }}
                >
                  <div className="pj-dragger-inner">
                    <FiUploadCloud className="pj-dragger-icon" />
                    <p className="pj-dragger-title">
                      Choose an image or drag & drop it here
                    </p>
                    <button type="button" className="pj-upload-btn">
                      UPLOAD IMAGE
                    </button>
                  </div>
                </Dragger>
              </Form.Item>

              {/* Terms and Conditions Checkbox */}
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

              <div className="pj-actions">
                <GradientButton
                  text={loading ? "Posting..." : "Post"}
                  htmlType="submit"
                  className="change-password-btn"
                  loading={loading}
                  disabled={!agreed}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostNewProject;