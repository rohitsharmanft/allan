import React, { useState, useEffect } from "react";
import { Modal, Radio, Checkbox, Select } from "antd";
import "./ExportDataModal.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import { toast } from "react-toastify";
import { DownOutlined } from "@ant-design/icons";

const MEMBER_TYPES = ["Premium", "Basic", "Free"];
const MAX_SELECTIONS = 5;

const AFRICAN_COUNTRIES = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
];

const ExportDataModal = ({
  open,
  onCancel,
  onExport,
  data,
  dataType = "member", // "member" or "client"
  categories = [], // pass for both member & client if needed
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMemberTypes, setSelectedMemberTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedOption(null);
      setSelectedMemberTypes([]);
      setSelectedCategories([]);
      setSelectedCountries([]);
    }
  }, [open]);

  const isClient = dataType === "client";

  // Handle category selection with max limit
  const handleCategoryChange = (values) => {
    if (values.length > MAX_SELECTIONS) {
      toast.warning(`Maximum ${MAX_SELECTIONS} categories can be selected`, {
        autoClose: 3000,
      });
      return;
    }
    setSelectedCategories(values);
  };

  // Handle country selection with max limit
  const handleCountryChange = (values) => {
    if (values.length > MAX_SELECTIONS) {
      toast.warning(`Maximum ${MAX_SELECTIONS} countries can be selected`, {
        autoClose: 3000,
      });
      return;
    }
    setSelectedCountries(values);
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warning("No data available to export at all");
      return;
    }

    const normMemberTypes = selectedMemberTypes.map((t) =>
      t.toLowerCase().trim(),
    );
    const normCategories = selectedCategories.map((c) =>
      c.toLowerCase().trim(),
    );
    const normCountries = selectedCountries.map((c) => c.toLowerCase().trim());

    const filteredData = data.filter((item) => {
      if (!selectedOption) return true;

      // Member Type filter (only for members)
      if (!isClient && selectedOption === "memberType") {
        if (normMemberTypes.length === 0) return false;
        const itemType = (item.membership || "").toLowerCase().trim();
        return normMemberTypes.includes(itemType);
      }

      // Category filter (for both)
      if (selectedOption === "category") {
        if (normCategories.length === 0) return false;
        const itemCat = (item.categoryTitle || "").toLowerCase().trim();
        return normCategories.includes(itemCat);
      }

      // Country filter (for both)
      if (selectedOption === "country") {
        if (normCountries.length === 0) return false;
        const itemCountry = (item.country || "").toLowerCase().trim();
        return normCountries.includes(itemCountry);
      }

      return false;
    });

    if (filteredData.length === 0) {
      let msg = "No matching records found.";

      if (!selectedOption) {
        msg = "Please select a filter option first.";
      } else if (!isClient && selectedOption === "memberType") {
        msg =
          selectedMemberTypes.length === 0
            ? "Please select at least one member type."
            : `No members found with type: ${selectedMemberTypes.join(", ")}`;
      } else if (selectedOption === "category") {
        msg =
          selectedCategories.length === 0
            ? "Please select at least one category."
            : `No records found in category: ${selectedCategories.join(", ")}`;
      } else if (selectedOption === "country") {
        msg =
          selectedCountries.length === 0
            ? "Please select at least one country."
            : `No records found from: ${selectedCountries.join(", ")}`;
      }

      toast.warning(msg, { autoClose: 4500 });
      return;
    }

    // ─── Headers & Rows ─── different for client vs member
    let headers = [];
    let rows = [];

    if (isClient) {
      headers = [
        "Full Name",
        "Email",
        "Phone",
        "Gender",
        "Country",
        "City",
        "State",
        "Approval Status",
        "Created At",
      ];

      rows = filteredData.map((item) => [
        `"${String(item.fullName || item.name || "").replace(/"/g, '""')}"`,
        item.email || "",
        item.phoneNumber || item.phone || "",
        item.gender || "",
        item.country || "",
        item.city || "",
        item.state || "",
        item.adminApproval || item.approval || "pending",
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
      ]);
    } else {
      // member
      headers = [
        "Full Name",
        "Email",
        "Phone",
        "Gender",
        "Profile Count",
        "Membership",
        "Category",
        "Approval Status",
        "Country",
        "Created At",
      ];

      rows = filteredData.map((item) => [
        `"${String(item.fullName || "").replace(/"/g, '""')}"`,
        item.email || "",
        item.phoneNumber || "",
        item.gender || "",
        item.profileCount || 0,
        item.membership || "",
        item.categoryTitle || "",
        item.adminApproval || "pending",
        item.country || "",
      ]);
    }

    const csvContent =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${dataType}_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => {
      toast.success(
        `Exported ${filteredData.length} record${filteredData.length !== 1 ? "s" : ""} successfully`,
      );
    }, 2000);
    onExport();
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={onCancel}
      className="export-modal"
      width={520}
    >
      <div className="export-content">
        <h2 className="export-title">Export Data</h2>
        <p className="export-subtitle">Choose what data you want to export</p>

        <div className="export-options">
          {!isClient && (
            <div
              className="export-option"
              onClick={() =>
                setSelectedOption(
                  selectedOption === "memberType" ? null : "memberType",
                )
              }
            >
              <span>Member Type</span>
              <Radio checked={selectedOption === "memberType"} />
            </div>
          )}

          <div
            className="export-option"
            onClick={() =>
              setSelectedOption(
                selectedOption === "category" ? null : "category",
              )
            }
          >
            <span>Category</span>
            <Radio checked={selectedOption === "category"} />
          </div>

          <div
            className="export-option"
            onClick={() =>
              setSelectedOption(selectedOption === "country" ? null : "country")
            }
          >
            <span>Country</span>
            <Radio checked={selectedOption === "country"} />
          </div>
        </div>

        {/* Sub-options */}
        {!isClient && selectedOption === "memberType" && (
          <div
            style={{ margin: "24px 0", padding: "0 20px", textAlign: "left" }}
          >
            <p style={{ fontWeight: 500, marginBottom: 12 }}>
              Select member types:
            </p>
            <Checkbox.Group
              options={MEMBER_TYPES}
              value={selectedMemberTypes}
              onChange={setSelectedMemberTypes}
            />
          </div>
        )}

        {selectedOption === "category" && (
          <div
            style={{ margin: "24px 0", padding: "0 20px", textAlign: "left" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <p style={{ fontWeight: 500, margin: 0 }}>Select categories:</p>
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontWeight: 500,
                }}
              >
                {selectedCategories.length}/{MAX_SELECTIONS}
              </span>
            </div>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select categories"
              value={selectedCategories}
              onChange={handleCategoryChange}
              maxCount={MAX_SELECTIONS}
              suffixIcon={<DownOutlined className="custom-dropdown-icon" />}
              options={categories.map((cat) => ({
                label:
                  cat.title ||
                  cat.name ||
                  cat.categoryTitle ||
                  "Unnamed Category",
                value:
                  cat.title || cat.name || cat.categoryTitle || cat._id || cat,
              }))}
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
            <p
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              You can select a maximum of {MAX_SELECTIONS} categories
            </p>
          </div>
        )}

        {selectedOption === "country" && (
          <div
            style={{ margin: "24px 0", padding: "0 20px", textAlign: "left" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <p style={{ fontWeight: 500, margin: 0 }}>Select countries:</p>
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontWeight: 500,
                }}
              >
                {selectedCountries.length}/{MAX_SELECTIONS}
              </span>
            </div>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Search and select countries"
              value={selectedCountries}
              onChange={handleCountryChange}
              maxCount={MAX_SELECTIONS}
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              suffixIcon={<DownOutlined className="custom-dropdown-icon" />}
              options={AFRICAN_COUNTRIES.map((c) => ({ label: c, value: c }))}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
            <p
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              You can select a maximum of {MAX_SELECTIONS} countries
            </p>
          </div>
        )}

        <div className="export-buttons">
          <GradientButton
            className="cancel-btn"
            onClick={onCancel}
            text="Cancel"
          />
          <GradientButton
            className="export-btn"
            onClick={handleExport}
            text="Export to CSV"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExportDataModal;
