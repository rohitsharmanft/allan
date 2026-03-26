import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import GradientButton from "../GradientButton";
import "./HeroSection.css";
import axios from "axios";
import { get_profile_list_with_location, skill_list_for_searchbar, } from "../../../api";
import SearchResult from "../SearchResult";
import { AppContext } from "../../../contexts/AppContexts";

const HeroSection = () => {
  const navigate = useNavigate();
  const { setValue, watch, register } = useForm();
  const locationInputRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedGeoLocation, setSelectedGeoLocation] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const [showSearchResultModal, setShowSearchResultModal] = useState(false);
  const skillValue = watch("skill", "");
  const [showPostModal, setShowPostModal] = useState(false);
  const { userType } = useContext(AppContext);
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key is missing!");
      toast.error("Map services unavailable – API key missing");
      return;
    }

    if (window.google?.maps?.places) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    script.onerror = () => toast.error("Failed to load Google Maps.");

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        `script[src="${scriptUrl}"]`,
      );
      if (existingScript) existingScript.remove();
    };
  }, []);

  useEffect(() => {
    if (!isGoogleMapsLoaded || !locationInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
    );

    autocomplete.setFields([
      "formatted_address",
      "geometry",
      "types",
      "address_components",
    ]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        toast.error("Please select a valid location from the dropdown.");
        return;
      }

      let country = "";
      let searchType = "city";
      const countryComponent = place.address_components?.find((c) =>
        c.types.includes("country")
      );
      country = countryComponent?.long_name || "";
      if (place.types.includes("country")) {
        searchType = "country";
      }

      if (place.types.includes("locality")) {
        searchType = "city";
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setValue("location", place.formatted_address);

      const locationData = {
        lat,
        lng,
        country,
        searchType,
      };

      setSelectedGeoLocation(locationData);
    });
  }, [isGoogleMapsLoaded, setValue]);

  const fetchAllSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(skill_list_for_searchbar);
      const skillData = response.data.data.map((skill) => ({
        id: skill._id,
        title: skill.title,
      }));
      const sortedSkills = skillData.sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      setSkills(sortedSkills);
      setFilteredSkills(sortedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllSkills(); }, []);

  useEffect(() => {
    if (!skillValue.trim()) {
      setFilteredSkills(skills);
      setShowSkillDropdown(false);
      return;
    }
    const filtered = skills
      .filter((skill) =>
        skill.title.toLowerCase().startsWith(skillValue.toLowerCase()),
      )
      .sort((a, b) => a.title.localeCompare(b.title));
    setFilteredSkills(filtered.slice(0, 10));
    setShowSkillDropdown(true);
  }, [skillValue, skills]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSkillSelect = (skill) => {
    setValue("skill", skill.title);
    setSkillId(skill.id);
    setShowSkillDropdown(false);
  };

  const handleSkillInputClick = () => {
    if (skillValue.trim()) {
      setShowSkillDropdown(true);
    }
  };

  const handleCloseSearchResultModal = () => {
    setShowSearchResultModal(false);
    setSelectedGeoLocation(null);
    if (locationInputRef.current) {
      locationInputRef.current.value = "";
      setValue("location", "");
    }
  };

  const handleSearch = async () => {
    if (!skillId) {
      toast.error("Please select a skill from the list");
      return;
    }
    if (!selectedGeoLocation) {
      toast.error("Please select a valid location");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        longitude: selectedGeoLocation.lng,
        latitude: selectedGeoLocation.lat,
        skillId,
        offset: 0,
        limit: 4,
        country: selectedGeoLocation.country,
        type: selectedGeoLocation.searchType,
      };

      const response = await axios.post(
        get_profile_list_with_location,
        payload,
      );

      if (response.data.code === 200) {
        const profileData = response.data.data?.data || [];
        console.log("profileData", profileData);
        if (profileData.length > 0) {
          navigate("/skill-profiles", {
            state: { profileData, selectedGeoLocation },
          });
        } else {
          setShowSearchResultModal(true);
        }
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      toast.error("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero_section">
        <div className="hero_content">
          <div className="hero_card">
            <h1>
              Find Africa's{" "}
              <span className="best-skills">Best Skills in all </span>
              54 Countries
            </h1>

            <p>
              We are the leading online marketplace for local and international
              clients looking for the best skills in all 54 African countries.
              We have made it super easy to find local professionals and skilled
              people near you, in a fast, reliable and safe way. Whether you are
              looking for an architect, agronomist, builder, hairstylist, mining
              engineer or plumber, Skills &amp; Trades connects you with
              verified and reviewed experts in your area of interest.
            </p>

            <div className="search_box">
              {/* Skill Input with Dropdown */}
              <div className="skill-input-wrapper" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Skill or Trade"
                  {...register("skill")}
                  autoComplete="off"
                  className="dd"
                  onClick={handleSkillInputClick}
                  onFocus={() =>
                    skillValue.trim() && setShowSkillDropdown(true)
                  }
                />

                {showSkillDropdown && (
                  <div className="skills-dropdown">
                    {loading ? (
                      <div className="dropdown-item disabled">
                        Loading skills...
                      </div>
                    ) : filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="dropdown-item"
                          onClick={() => handleSkillSelect(skill)}
                        >
                          {skill.title}
                        </div>
                      ))
                    ) : skillValue.trim() ? (
                      <div className="dropdown-item disabled">
                        No skills found
                      </div>
                    ) : (
                      <div className="dropdown-item disabled">
                        Type to search skills...
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="divider"></div>

              {/* Location Input */}
              <input
                type="text"
                placeholder="Enter location"
                ref={locationInputRef}
                className="location-input"
                autoComplete="off"
              />

              {/* Search Button */}
              <button
                type="button"
                className="search_btn"
                onClick={handleSearch}
                disabled={loading}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>

            <GradientButton
              className="change-password-btn"
              text="Search by category"
              onClick={() => navigate("/all-categories")}
            />

            <div
              className="bottom-row"
              style={
                localStorage.getItem("accessToken")
                  ? { justifyContent: "flex-start" }
                  : {}
              }
            >
              <p className="bottom-text">
                Freelancers, Professionals, SMEs & Trades Companies — Join
                Today!
              </p>
              {!localStorage.getItem("accessToken") && (
                <GradientButton
                  className="signup-btn"
                  text="Sign Up"
                  onClick={() => navigate("/member-resource-login")}
                />
              )}
            </div>
            {(!localStorage.getItem("accessToken") ||
              (localStorage.getItem("accessToken") &&
                userType === "client")) && (
                <div className="cne">
                  <div className="cp">
                    <p>
                      Client & Employers Get Job Applications & Project Quotes
                    </p>
                  </div>
                  <div>
                    <GradientButton
                      className="signup-btn"
                      text="Post a Job or Project"
                      onClick={() => setShowPostModal(true)}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {showSearchResultModal && (
        <SearchResult onClose={handleCloseSearchResultModal} show={false} />
      )}
      {showPostModal && (
        <div className="post-modal-overlay">
          <div className="post-modal">
            <h3>Select an Option</h3>

            <div className="post-modal-buttons">
              <button
                className="modal-btn"
                onClick={() => {
                  setShowPostModal(false);
                  navigate("/post-job");
                }}
              >
                Post a Job
              </button>

              <button
                className="modal-btn"
                onClick={() => {
                  setShowPostModal(false);
                  navigate("/post-project");
                }}
              >
                Post a Project
              </button>
            </div>

            <button
              className="modal-close"
              onClick={() => setShowPostModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
