import React, { useEffect, useState } from "react";
import "./Administration.css";
import Footer from '../../../Components/Common/Footer/Footer';
import Header from "../../../Components/Common/Header/Header";
import { useLocation } from "react-router-dom";
import { get_all_skills } from "../../../api";
import axios from "axios";
import { Breadcrumb, Spin } from "antd";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

import LocationModal from "../../../Components/Common/LocationModal";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ===== Helper function to capitalize first letter =====
const capitalizeFirstLetter = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const Administration = () => {
  const location = useLocation();
  const [category, setCategory] = useState(location?.state || [])
  const [allSkills, setAllSkills] = useState([])
  const [alphabetSkills, setAlphabetSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAlphabet, setSelectedAlphabet] = useState('A')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [skillName, setSkillName] = useState('')
  const [skillId, setSkillId] = useState(null)
  console.log("allSkills: ", allSkills)
  console.log("alphabetSkills: ", alphabetSkills)
  console.log("category", category)
  const categoryId = category._id || ""

  useEffect(() => {
    const fetchAllSkills = async () => {
      setLoading(true);
      try {
        const response = await axios.post(get_all_skills, { categoryId });
        console.log("response: ", response)
        if (response.data.code === 200) {
          setAllSkills(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchAllSkills();
    }
  }, [categoryId]);

  useEffect(() => {
    if (allSkills && selectedAlphabet) {
      const filtered = allSkills.filter(skill =>
        skill?.title?.[0]?.toUpperCase() === selectedAlphabet.toUpperCase()
      );
      setAlphabetSkills(filtered);
    } else {
      setAlphabetSkills([]);
    }
  }, [allSkills, selectedAlphabet]);

  return (
    <>
      <Header />

      <div className="admin-page">
        <section className="hero-section">
          <div className="overlay"></div>
          {/* Use helper function here */}
          <h1>{capitalizeFirstLetter(category.title)}</h1>
        </section>

        <div className="breadcrumb">
          <Breadcrumb
            separator={<FiChevronRight size={14} className="ss" />}
            items={[
              {
                title: <Link to="/">Homepage</Link>,
              },
              {
                title: <Link to="/all-categories">All Categories</Link>,
              },
              {
                title: `${capitalizeFirstLetter(category?.title || "Administration")} Skills`,
              },
            ]}
          />
        </div>

        <div className="admin-container">
          {/* Use helper function here */}
          <h2>{capitalizeFirstLetter(category?.title)} Skills</h2>

          <div className="alphabet-filter">
            {alphabet.map((letter) => (
              <button key={letter} onClick={() => setSelectedAlphabet(letter)}
                className={selectedAlphabet === letter ? "selected" : ""}
              >{letter}</button>
            ))}
          </div>

          <Spin spinning={loading}>
            <div className="skills-list">
              {!loading && alphabetSkills.length == 0 && "No Skills"}
              {alphabetSkills.map((skill, index) => (
                <div key={index} className="skill-card" style={{textTransform:'capitalize'}} onClick={() => {
                  setSkillName(skill?.title);
                  setSkillId(skill?._id);
                  setIsModalOpen(true);
                }}>
                  {skill?.title}
                </div>
              ))}
            </div>
          </Spin>
        </div>
      </div>

      {
        isModalOpen &&
        <LocationModal skillId={skillId} jobTitle={skillName} onClose={() => setIsModalOpen(false)} category={category} />
      }

      <Footer />
    </>
  );
};

export default Administration;
