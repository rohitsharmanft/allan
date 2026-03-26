import React, { useContext, useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import { useNavigate } from "react-router-dom";
import { Select, message } from "antd";
import "./CreateSkills.css";
import { admin_create_skill, admin_get_all_category } from "../../api";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";

const { Option } = Select;

function CreateSkills() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(admin_get_all_category, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status && data.code === 200) {
        setCategories(data.data);
      } else {
        message.error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCategory) return toast.error("Please select a category");
    if (!skillsText.trim()) return toast.error("Please enter skills");

    const skillsArray = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (skillsArray.length === 0) {
      return toast.error("No valid skills found");
    }

    const selectedCategoryData = categories.find(
      (c) => c.title === selectedCategory,
    );
    if (!selectedCategoryData) {
      return toast.error("Category not found");
    }

    const categoryId = selectedCategoryData._id;

    setLoading(true);

    try {
      for (const skill of skillsArray) {
        const res = await fetch(admin_create_skill, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: skill,
            categoryId: categoryId,
          }),
        });

        const data = await res.json();

        if (data.code===200) {
          toast.success("Skills created successfully!");
          navigate(-1)
        }else{
          toast.error(data.error_description)
          console.log(data?.error_description)
        }
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to create skills");
      console.log(err.data)
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
          <div className="edit-profile_container">
            <h2 style={{ marginBottom: "20px" }}>Create New Skill</h2>

            <div className="form-grid">
              <div>
  <label>Category*</label>
  <Select
    placeholder="Select category"
    style={{ width: "100%" }}
    value={selectedCategory}
    onChange={(value) => {
      setSelectedCategory(value);
      setSkillsText("");
    }}
  >
    {[...categories]
      .sort((a, b) =>
        (a.title || "")
          .toLowerCase()
          .localeCompare((b.title || "").toLowerCase())
      )
      .map((cat) => (
        <Option key={cat._id} value={cat.title}>
          {cat.title}
        </Option>
      ))}
  </Select>
</div>
              {/* Skills Input */}
              {selectedCategory && (
                <div className="skill-input-wrapper">
                  <label className="skill-label">
                    Skills*
                    <span style={{ color: "grey", opacity: 0.9 }}>
                      (Max length upto 50 characters)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="skill-input"
                    placeholder="Enter skills separated by commas (e.g. Accountant, CFO, Auditor)"
                    value={skillsText}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSkillsText(value);

                      if (value.length === 50) {
                        toast.warn("Skill text cannot exceed 50 characters");
                      }
                    }}
                    maxLength={50}
                  />

                  <p className="skill-hint">
                    Separate skills using a comma. Each skill will be saved
                    individually.
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="button_group" style={{ marginTop: 20 }}>
              <GradientButton
                text={loading ? "Creating..." : "Create Skill"}
                onClick={handleSubmit}
                disabled={loading}
              />

              <GradientButton
                text="Discard"
                className="discard-btn"
                onClick={() => navigate(-1)}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSkills;
