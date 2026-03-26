import React, { useContext, useEffect, useState } from "react";
import "./MemberAdviceCenter.css";
import img from "../../../../assets/images/img7.png";
import Header from "../../../../Components/Common/Header/Header";
import Footer from "../../../../Components/Common/Footer/Footer";
import ArticleCard from "../../../../Components/Common/ArticleCard/ArticleCard";
import { get_all_categories } from "../../../../api";
import axios from "axios";
import { AppContext } from "../../../../contexts/AppContexts";

const MemberAdviceCenter = () => {
  const [categories, setCategories] = useState([]);
  const { fetchAdvisory, advisory, loadingProfile } = useContext(AppContext);
  const [categoryId, setCategoryId] = useState("690ded0237f3dcf8e1390991");
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(get_all_categories)
        if (response.data.code === 200) {
          const sortedCategories = [...response.data.data].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          setCategories(sortedCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  useEffect(() => { fetchAdvisory("Member", categoryId) }, [categoryId])

  console.log("===========>>>>>>>>>>>>", advisory)

  return (
    <>

      <Header />
      <div>
        <div className="hero-section">
          <div className="overlay"></div>
          <h1> Member Advice Center</h1>
        </div>
        <div className="articles-section">
          <h2>Explore Our Latest Articles</h2>
          <div className="articles-layout">
            <div className="left-sidebar">
              {categories.map((category, index) => (
                <div key={index} className="category_btn" onClick={() => { setCategoryId(category._id) }}>
                  <span>{category.title}</span>
                </div>
              ))}
            </div>

            <div className="right-content">
              {loadingProfile ? (
                <div className="content-loader">
                  <div className="spinner"></div>
                  <p>Loading advisory content...</p>
                </div>
              ) : advisory && advisory.length > 0 ? (
                advisory.map((article, index) => (
                  <ArticleCard
                    key={article._id || index}
                    tag={article.tag || article.type || "Member Advisory"}
                    image={article.image}
                    title={article.title || "Untitled"}
                    description={article.description || ""}
                    link={article.link || "/article-details"}
                  />
                ))
              ) : (
                <div className="no-advisory centered">
                  <p>No Advisory Available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MemberAdviceCenter;
