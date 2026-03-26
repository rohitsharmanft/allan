import React from "react";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import "./JobSearchBar.css";
// import GradientButton from "../../Components/Common/GradientButton";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GradientButton from "../../../Components/Common/GradientButton";

const JobSearchBar = () => {
  const navigate = useNavigate();
  return (
    <div className="job-search_container">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search Here" className="search-input" />
      </div>
      <GradientButton className="gradient-btn" text={"Post a New Job →"} onClick={() => navigate("/post-job ")}>
        Post a New Job <FiArrowRight className="arrow-icon" />
      </GradientButton>
    </div>
  );
};

export default JobSearchBar;
