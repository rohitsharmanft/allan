import React, { useState, useContext, useEffect } from "react";
import { Spin } from "antd";
import "./UploadDetails.css";
import GradientButton from "../GradientButton";
import { toast } from "react-toastify";
import axios from "axios";
import { member_apply_job } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import { MdOutlineCloudUpload } from "react-icons/md";
import { red } from "@mui/material/colors";

const UploadDetails = ({ isOpen, onClose, jobId, clientId, profileId, uploadButtonText }) => {
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileObject, setFileObject] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const { token } = useContext(AppContext);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [errors, setErrors] = useState({
    file: "",
    description: "",
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!fileObject) {
      newErrors.file = "Please upload a PDF file";
    }

    if (!description.trim()) {
      newErrors.description = "Please add a description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrors((prev) => ({ ...prev, file: "" }));

    if (file && file.type === "application/pdf") {
      setUploadedFileName(file.name);
      setFileObject(file);
    } else {
      setUploadedFileName("");
      setFileObject(null);
      setErrors((prev) => ({ ...prev, file: "Please upload a PDF file" }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    setErrors((prev) => ({ ...prev, file: "" }));

    if (file && file.type === "application/pdf") {
      setUploadedFileName(file.name);
      setFileObject(file);
    } else {
      setUploadedFileName("");
      setFileObject(null);
      setErrors((prev) => ({ ...prev, file: "Please upload a PDF file" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("clientId", clientId);
      formData.append("profileId", profileId);
      formData.append("description", description.trim());
      formData.append("file", fileObject);

      const response = await axios.post(member_apply_job, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast.success("Application submitted successfully!");
        onClose();
        setUploadedFileName("");
        setFileObject(null);
        setDescription("");
        setErrors({});
      } else {
        console.log(response.data.error_description)
        toast.error(response.data.error_description)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description ||
        "Failed to submit application",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} disabled={loading}>
          ✕
        </button>

        <h2 className="upload-heading">Upload Details</h2>

        <Spin spinning={loading} tip="Submitting application...">
          <div
            className={`upload-box- ${dragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <MdOutlineCloudUpload className="upload-icon" />
            </div>
            <p className="upload-text">Choose a file or drag & drop it here</p>
            <p className="upload-format">PDF only</p>
            <label htmlFor="file-input" className="upload_btn_">
              {uploadButtonText}
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
            {uploadedFileName && (
              <p className="file-name">✓ {uploadedFileName}</p>
            )}
          </div>
          {errors.file && <p className="error-text">{errors.file}</p>}

          <div className="upload-info">
            <h3>Cover Letter</h3>
            <textarea
              className="description-input"
              placeholder="e.g., I have skills in MERN stack, proficient in ReactJS...."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
              disabled={loading}
              rows="4"
            />
            {errors.description && (
              <p className="error-text" style={{ color: "red" }}>
                {errors.description}
              </p>
            )}
          </div>

          <div className="upload-info">
            <h3>Additional Information</h3>
            <p>
              Please upload your resume/CV in PDF format and provide a brief
              description of your skills and experience relevant to this job.
              This helps the client understand your qualifications better.
            </p>
          </div>

          <GradientButton
            className="change-password-btn"
            text={loading ? "Submitting..." : "Submit"}
            onClick={handleSubmit}
            disabled={loading}
          />
        </Spin>
      </div>
    </div>
  );
};

export default UploadDetails;
