import React, { useContext, useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import JobCard from "../../common/JobCard/JobCard";
import "./ViewJobs.css";
import { Breadcrumb, Pagination, Spin, message } from "antd";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { admin_get_job_acc_client } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import { FiChevronRight } from "react-icons/fi";


const ViewProject = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const { token } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const clientId = user?.key; // _id from AllJobs page

  const fetchJobs = async (page = 1) => {
    if (!clientId || !token) {
      setError("Missing client ID or authentication");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        id: clientId,
        type: "project",
        page,           // send page if your API supports it
        limit: pageSize // optional — add if backend supports
      };

      const response = await axios.post(
        admin_get_job_acc_client,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === true && response.data?.code === 200) {
        const jobList = response.data.data.data || [];
        setJobs(jobList);
        setTotal(response.data.data.pagination?.totalCount || jobList.length);
      } else {
        setJobs([]);
        setTotal(0);
        message.error(response.data?.message || "Failed to load jobs");
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError("Failed to load jobs. Please try again.");
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchJobs(currentPage);
    }
  }, [clientId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!clientId) {
    return (
      <div className="dashboard-main">
        <DashboardHeader />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>No client selected</h2>
          <p>Please go back and select a client from the list.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          <div className="upper">


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
            <h3>Projects by {user?.name || "Client"}</h3>
          </div>

          <div className="lower">
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Loading projects...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "red" }}>
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#666" }}>
                <h3>No projects found for this client</h3>
              </div>
            ) : (
              <>
                <div className="job-grid">
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      id={job._id}
                      jobDescription={job.projectDescription}
                      category={job.category?.title || "Uncategorized"}
                      title={job.projectTitle || "Untitled Project"}
                      date={new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      description={job.projectDescription.length > 50 ? job.projectDescription.slice(0, 50) + "...." : job.projectDescription || "No description available"}
                      image={job.uploadImage || null}
                      link={"/project-details"}
                    />
                  ))}
                </div>

                <div className="pagination_box">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProject;