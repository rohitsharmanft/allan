import React, { useState, useContext } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./JobDetails.css";
import jobImg from "../../assets/jobImg.png";
import GradientButton from "../../common/GradientButton/GradientButton";
import { Breadcrumb, Modal } from "antd";
import DeleteConfirmModal from "../../common/Modal/DeleteConfirmModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { API_URL } from "../../api";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";

const ProjectDetails = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const data = location.state
  const { token } = useContext(AuthContext)
  const [deleting, setDeleting] = useState(false);
  console.log(data)

  const handleDelete = async () => {
    setOpen(true)
    if (deleting) return;
    setDeleting(true);
    try {
      const response = await axios.put(`${API_URL}/Admin/api/jobs/${data.id}/delete`, {}, { headers: { Authorization: `Bearer ${token}`, }, });
      if (response.data.code === 200) {
        toast.success("Project deleted successfully!");
        navigate("/view-project");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data.error_description);
    } finally {
      setDeleting(false);
      setOpen(false);
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
           <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/all-projects">Projects</Link>,
                  },

                  {
                    title: "View Projects",
                  },
                ]}
              />
            </div>

          <div className="jobdetails-container">
            <div className="jobdetails-card">
              <img src={data?.image||jobImg} alt="Job" className="jobdetails-image" />

              <div className="jobdetails-content">
                <span className="job-tag">{data.category}</span>
                <h2 className="job-title">{data?.title}</h2>
                <p className="job-date">{data?.date}</p>
                <p className="job-description">{data?.jobDescription}</p>

                <div className="btn-lower">
                  <GradientButton
                    text={"Delete"}
                    className="btn-delete"
                    onClick={() => setOpen(true)}
                  />
                  {/* 
                  <GradientButton
                    text={"Discard"}
                    className="btn-discard"
                    onClick={() => {navigate("/view-project")}}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        text={'Are You Sure You Want To Delete This Job?'}
      />
    </>
  );
};

export default ProjectDetails;
