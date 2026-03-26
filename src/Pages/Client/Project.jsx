import React, { useContext, useEffect, useState } from "react";
import "./JobsOrProjects.css";
import GradientButton from "../../Components/Common/GradientButton";
import JobCard from "../../Components/Common/JobCard/JobCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { job_list } from "../../api";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/AppContexts";

const Project = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AppContext)
  const type = 'project'
  console.log(token)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.post(job_list, { type: type }, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.status && response.data.data) {
          setJobs(response.data.data);
        }
      } catch (err) {
        toast.error("Error fetching jobs:", err.data.error_description);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };



  const fallbackImage =
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <> <div className="mainn">
      <div className="jobs-page">
        <div className="jobs-header">
          <h2>Project</h2>
          <GradientButton
            text="Post New Project"
            onClick={() => navigate("/post-a-project")}
          />
        </div>

        {loading && (
          <div className="loading-text" style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>
            Loading jobs...
          </div>
        )}
        {!loading && !error && jobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <h3>No jobs or projects posted yet.</h3>
            <p>Be the first to post one!</p>
          </div>
        )}

        <div className="jobs_grid">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              title={job.projectTitle || "Untitled Project"}
              date={formatDate(job.createdAt)}
              category={job.categoryName || "Unknown"}
              description={job.projectDescription.length > 50 ? job.projectDescription.slice(0, 40) + "..." : job.projectDescription}
              image={job.uploadImage || fallbackImage}
              onClickReadMore={() => {
                if (token) {
                  navigate('/client-job-detail', { state: { job, type: "project" } });
                } else {
                  navigate('/login', { state: { job, type: "project" } });
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Project;