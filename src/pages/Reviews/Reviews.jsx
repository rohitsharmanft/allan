import React, { useState, useEffect, useContext } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./Reviews.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import ProfileCard1 from "../../common/ReviewCard/ProfileCard1";
import { admin_reviews_list, admin_get_all_category } from "../../api";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { africanCountries } from "../../utils/Countries/Countries";

const Reviews = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("published");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(admin_get_all_category, {headers: { Authorization: `Bearer ${token}` },});
      if (res.data.code === 200) {
        const sorted = [...(res.data.data || [])].sort((a, b) =>
          (a.name || a.title || "").localeCompare(b.name || b.title || "", undefined, {
            sensitivity: "base",
            numeric: true,
          })
        );
        setCategories(sorted);
      } else {
        toast.error(res.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const payload = { type };
      if (selectedCountry) payload.country = selectedCountry;
      if (selectedCategory) payload.categoryId = selectedCategory;

      const res = await axios.post(
        admin_reviews_list,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status && res.data.code === 200) {
        const formatted = res.data.data
          .map((member) => ({
            id: member._id,
            fullName: member.fullName,
            country: member.country,
            totalReviews: member.ratingData?.length || 0,
            avgRating: member.profileAvgRating,
            image: member.image || "",
            skills: member.skillsData?.map((s) => s.title) || [],
          }))
          .filter((member) => member.totalReviews > 0);

        setProfiles(formatted);
      } else {
        toast.error(res.data.message || "Failed to load reviews");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProfiles(); }, [type, selectedCountry, selectedCategory]);

  return (
    <>
      <DashboardHeader />
      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          <div className="profile_content">
            <div className="profile_header">
              <div className="all-btn">
                <GradientButton
                  text="Published"
                  className={`btn1 ${type === "published" ? "active" : ""}`}
                  onClick={() => setType("published")}
                />
                <GradientButton
                  text="Unpublished"
                  className={`button ${type === "unpublished" ? "active" : ""}`}
                  onClick={() => setType("unpublished")}
                />
              </div>

              <div className="header-top">
                <div className="filter-section">
                  <label htmlFor="country-filter" className="filter-label">
                    Filter by Country
                  </label>
                  <select
                    id="country-filter"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All African Countries</option>
                    {africanCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="category-filter" className="filter-label">
                    Filter by Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name || cat.title || "Unnamed"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="profile-cards">
              {loading && <p className="loading-text">Loading...</p>}

              {!loading && profiles.length === 0 && (
                <p className="no-results">No profiles found</p>
              )}

              {!loading &&
                profiles.map((p) => (
                  <ProfileCard1
                    key={p.id}
                    fullName={p.fullName}
                    country={p.country}
                    totalReviews={p.totalReviews}
                    memberAvgRating={p.avgRating}
                    image={p.image}
                    skills={p.skills.join(", ")}
                    buttonText="View"
                    onEdit={() => navigate(`/reviews/member/${p.id}`)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;