import React, { useEffect, useRef, useState } from "react";
import "./CategorySection.css";
import CategoryCard from "../CategoryCard";
import GradientButton from "../GradientButton";
import axios from "axios";
import { get_all_categories } from "../../../api";
import { HiArrowLongRight, HiOutlineArrowLongLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const CategorySection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const scrollLeft = () => { scrollRef.current.scrollBy({ left: -300, behavior: "smooth" }); };

  const scrollRight = () => { scrollRef.current.scrollBy({ left: 300, behavior: "smooth" }); };

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(get_all_categories);
        if (response.data.code === 200) {
          // Sort alphabetically by title
          const sortedCategories = [...response.data.data].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          setCategories(sortedCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
    window.scroll(0, 0);
  }, []);

  // --- Drag Scroll Handlers ---
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftStart(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => { setIsDragging(false); };

  const onMouseUp = () => { setIsDragging(false); };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeftStart - walk;
  };

  // Touch events for mobile
  const onTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeftStart(scrollRef.current.scrollLeft);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const onTouchEnd = () => { setIsDragging(false); };

  const onLearnMore = (cat) => { navigate("/administration", { state: cat }); };

  return (
    <div className="category-section">
      <h2 className="section-title">Categories</h2>

      <div className="slider-container">
        <button className="arrow-btn left" onClick={scrollLeft}>
          <HiOutlineArrowLongLeft className="b" />
        </button>

        <div
          className="cards-container"
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {!loading && categories?.length === 0 && "No Categories Found"}
          <Spin spinning={loading} />
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              icon={cat.icon}
              title={cat.title}
              description={cat.description}
              onLearnMore={() => onLearnMore(cat)}
            />
          ))}
        </div>

        {!loading && <button className="arrow-btn right" onClick={scrollRight}>
          <HiArrowLongRight className="b" />
        </button>}
      </div>

      <div className="cate-btn">
        <GradientButton
          onClick={() => navigate("/all-categories")}
          className="category-btn"
          text="View All Categories"
        />
      </div>
    </div>
  );
};

export default CategorySection;
