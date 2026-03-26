import React, { useContext, useEffect, useState } from "react";
import "./JobListing.css";
import Footer from "../../../Components/Common/Footer/Footer";
import TopBar from "../../../Components/Common/Header/TopBar";
import Navbar from "../../../Components/Common/Header/Navbar";
import JobCard from "../../../Components/Common/JobCard/JobCard";
import axios from "axios";
import { toast } from "react-toastify";
import { job_listing } from "../../../api";
import GradientButton from "../../../Components/Common/GradientButton";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Common/Header/Header";
import jobImg from "../../../assets/images/img8.png";
import { AppContext } from "../../../contexts/AppContexts";
import { Autocomplete, TextField, styled } from "@mui/material";
import { get_all_categories } from "../../../api";

const countries = [
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
].sort((a, b) => a.name.localeCompare(b.name));

const StyledAutocomplete = styled(Autocomplete)({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    padding: "0px 12px",
    borderRadius: "8px",
    height: "45px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#497b76",
    },
    "&:hover fieldset": {
      borderColor: "#1a5e56",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1a5e56",
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "15px",
    color: "#111",
    height: "100%",
    padding: "0 !important",
    "&::placeholder": {
      color: "#999",
      opacity: 1,
    },
  },
});

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { userType, token } = useContext(AppContext);
  const isMember = userType?.toLowerCase() === "member";
  const limit = 6;
  const navigate = useNavigate();
  const [type, setType] = useState("job");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [alljobs, setAllJobs] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(get_all_categories);
        if (response.data.code === 200) {
          const sortedCategories = [...response.data.data]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((cat) => ({
              label: cat.title,
              value: cat._id,
            }));
          setCategories(sortedCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchJobs = async (page = 1, isLoadMore = false) => {
    if (!hasMore && isLoadMore) return;
    try {
      setError(null);
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const offset = (page - 1) * limit;
      const response = await axios.post(job_listing, {
        type: type,
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (response.data.code === 200) {
        const newJobs = response.data.data.data || [];
        const pagination = response.data.data.pagination;
        const noMore = newJobs.length < limit;
        setAllJobs(newJobs);

        if (isLoadMore) {
          setJobs((prev) => [...prev, ...newJobs]);
          setFilteredJobs((prev) => [...prev, ...newJobs]);
        } else {
          setJobs(newJobs);
          setFilteredJobs(newJobs);
        }
        setCurrentPage(pagination.currentPage || page);
        setHasMore(!noMore && pagination.currentPage < pagination.totalPages);
      } else {
        throw new Error(response.data.message || "Invalid response");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again.");
      toast.error("Failed to load jobs.");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchJobs(1, false);
  }, [type]);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((job) => {
        return (
          (job.projectTitle || "").toLowerCase().includes(lowerSearch) ||
          (job.skillData?.some((skill) =>
            skill.title.toLowerCase().includes(lowerSearch),
          ) ??
            false)
        );
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (job) => job.category?._id === selectedCategory,
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, jobs, selectedCategory, selectedLocation]);

  const handleSearchChange = async (value) => {
    setSearchTerm(value);

    if (value.trim() && hasMore && !loadingMore) {
      let page = currentPage + 1;
      let allJobsList = [...jobs];
      let keepFetching = true;
      setLoadingMore(true);

      while (keepFetching) {
        try {
          const offset = (page - 1) * limit;
          const response = await axios.post(job_listing, {
            type: type,
            offset: offset.toString(),
            limit: limit.toString(),
          });

          if (response.data.code === 200) {
            const newJobs = response.data.data.data || [];
            const pagination = response.data.data.pagination;
            allJobsList = [...allJobsList, ...newJobs];

            const noMore =
              newJobs.length < limit ||
              pagination.currentPage >= pagination.totalPages;
            if (noMore) {
              keepFetching = false;
              setHasMore(false);
            } else {
              page++;
            }
            setCurrentPage(pagination.currentPage || page);
          } else {
            keepFetching = false;
          }
        } catch (err) {
          keepFetching = false;
        }
      }

      setJobs(allJobsList);
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = async (value) => {
    setSelectedCategory(value);

    if (value && hasMore) {
      let page = currentPage + 1;
      let allJobs = [...jobs];
      let keepFetching = true;
      setLoadingMore(true);
      while (keepFetching) {
        try {
          const offset = (page - 1) * limit;
          const response = await axios.post(job_listing, {
            type: type,
            offset: offset.toString(),
            limit: limit.toString(),
          });

          if (response.data.code === 200) {
            const newJobs = response.data.data.data || [];
            const pagination = response.data.data.pagination;
            allJobs = [...allJobs, ...newJobs];

            const noMore =
              newJobs.length < limit ||
              pagination.currentPage >= pagination.totalPages;
            if (noMore) {
              keepFetching = false;
              setHasMore(false);
            } else {
              page++;
            }
            setCurrentPage(pagination.currentPage || page);
          } else {
            keepFetching = false;
          }
        } catch (err) {
          keepFetching = false;
        }
      }

      setJobs(allJobs);
      setLoadingMore(false);
    }
  };

  const handleLocationChange = async (value) => {
    setSelectedLocation(value);

    if (value && hasMore) {
      // Fetch all remaining pages so filter works on complete data
      let page = currentPage + 1;
      let allJobs = [...jobs];
      let keepFetching = true;

      setLoadingMore(true);

      while (keepFetching) {
        try {
          const offset = (page - 1) * limit;
          const response = await axios.post(job_listing, {
            type: type,
            offset: offset.toString(),
            limit: limit.toString(),
          });

          if (response.data.code === 200) {
            const newJobs = response.data.data.data || [];
            const pagination = response.data.data.pagination;
            allJobs = [...allJobs, ...newJobs];

            const noMore =
              newJobs.length < limit ||
              pagination.currentPage >= pagination.totalPages;
            if (noMore) {
              keepFetching = false;
              setHasMore(false);
            } else {
              page++;
            }
            setCurrentPage(pagination.currentPage || page);
          } else {
            keepFetching = false;
          }
        } catch (err) {
          keepFetching = false;
        }
      }

      setJobs(allJobs);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    fetchJobs(nextPage, true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* <TopBar />
      <Navbar /> */}
      <Header />
      <div className="job-container">
        <div className="hero-section">
          <div className="overlay"></div>
          <h1>Job Listing</h1>
        </div>

        {!token && (
          <div className="job-info-lines">
            <p>
              <span className="info-number">1.</span>{" "}
              <span className="info-role">Clients & Employers</span> – You can
              post a {type === "job" ? "job" : "project"} for free when you{" "}
              <span className="info-link" onClick={() => navigate("/login")}>
                LOGIN
              </span>{" "}
              to your account or{" "}
              <span className="info-link" onClick={() => navigate("/signup")}>
                Sign Up
              </span>{" "}
              for FREE.
            </p>
            <p>
              <span className="info-number">2.</span>{" "}
              <span className="info-role">Job Applicants</span> – You need to{" "}
              <span className="info-link" onClick={() => navigate("/login")}>
                LOGIN
              </span>{" "}
              or{" "}
              <span className="info-link" onClick={() => navigate("/signup")}>
                Sign Up
              </span>{" "}
              for FREE to apply for a job
            </p>
          </div>
        )}

        <div className="job-search-container">
          <div className="search_wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs by title, or skill..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="filter-wrapper">
            <StyledAutocomplete
              options={categories}
              getOptionLabel={(option) => option.label || ""}
              value={
                categories.find((cat) => cat.value === selectedCategory) || null
              }
              onChange={(event, newValue) => {
                handleCategoryChange(newValue ? newValue.value : null);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Category" />
              )}
            />
            <StyledAutocomplete
              options={countries}
              getOptionLabel={(option) => option.name || ""}
              value={countries.find((c) => c.name === selectedLocation) || null}
              onChange={(event, newValue) => {
                handleLocationChange(newValue ? newValue.name : null);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Country" />
              )}
            />
          </div>
          {!isMember && (
            <GradientButton
              className="gradient-btn"
              text={"Post a New Job"}
              onClick={() => navigate(`/post-job`, { state: { type } })}
            >
              Post a New Job <FiArrowRight className="arrow-icon" />
            </GradientButton>
          )}
        </div>
        {/* <div className="job-listing-button">
          <GradientButton
            className="gradient-btn"
            text={"Jobs"}
            onClick={() => setType("job")}
          >
          </GradientButton>
          <GradientButton
            className="gradient-btn"
            text={"Projects"}
            onClick={() => setType("project")}
          >
          </GradientButton>
        </div> */}
        <div className="job-grid">
          {loading ? (
            <div className="status-container">
              <p>{type == "job" ? "Loading jobs..." : "Loading projects..."}</p>
            </div>
          ) : error ? (
            <div className="status-container error">
              <p>{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="status-container empty">
              <p>
                {searchTerm
                  ? `No jobs found matching "${searchTerm}"`
                  : "No jobs available at the moment."}
              </p>
            </div>
          ) : (
            <>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  category={job.category?.title}
                  title={job.projectTitle || "Untitled Project"}
                  date={formatDate(job.createdAt)}
                  description={
                    job.projectDescription.length > 50
                      ? job.projectDescription.slice(0, 60) + "..."
                      : job.projectDescription || "No description provided."
                  }
                  image={job.uploadImage || jobImg}
                  onClickReadMore={() => {
                    navigate(`/${type}-detail`, { state: { job, type } });
                  }}
                />
              ))}
              {(loadingMore || (!searchTerm && hasMore)) && (
                <div className="load-more-container">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? "Loading more..." : "Load More →"}
                  </button>
                </div>
              )}
              {!hasMore && filteredJobs.length > 0 && !searchTerm && (
                <div className="end-of-list">
                  <p>
                    You've reached the end of the{" "}
                    {type === "job" ? "job" : "project"} list.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobListing;
