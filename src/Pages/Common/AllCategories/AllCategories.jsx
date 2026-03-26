import React, { useEffect, useRef, useState } from "react";
import Footer from '../../../Components/Common/Footer/Footer';
import wellbeingIcon from "../../../assets/images/wellbeing.png";
import "./AllCategories.css";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "../../../Components/Common/CategoryCard";
import Header from "../../../Components/Common/Header/Header";
import { get_all_categories } from "../../../api";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import { Breadcrumb, Spin } from "antd";
import st from '../../../assets/icons/st.png';

const AllCategories = () => {
  const myRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onLearnMore = (category) => {
    console.log('Navigate to:', category);
    navigate('/administration', { state: category });
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(get_all_categories);
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

  useEffect(() => {
    setTimeout(() => {
      myRef.current?.scrollIntoView({ behavior: 'instant' });
    }, 0);
  }, []);

  return (
    <>
      <Header />

      <div className="categories-page">
        <div className="hero-section">
          <div className="overlay"></div>
          <h1>All Categories</h1>
        </div>

        <div className="breadcrumb" ref={myRef}>
          <Breadcrumb
            separator={<FiChevronRight size={14} className="ss" />}
            items={[
              {
                title: <Link to="/">Homepage</Link>,
              },
              {
                title: "All Categories",
              },
            ]}
          />
        </div>

        <div className="st">
          <img src={st} alt="" />
        </div>

        <Spin spinning={loading}>
          <div className="categories-grid hover">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                title={cat.title}
                icon={cat.icon}
                description={cat.description}
                onLearnMore={() => onLearnMore(cat)}
              />
            ))}
          </div>
        </Spin>
      </div>

      <Footer />
    </>
  );
};

export default AllCategories;