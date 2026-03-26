import React, { useEffect, useState } from "react";
import "./Blog.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import MemberCard from "../../common/MemberCard/MemberCard";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import { useNavigate } from "react-router-dom";
import { API_URL, admin_get_all_blog } from "../../api";
import axios from "axios";
import { Spin } from "antd";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const stripHtml = (html) => html.replace(/<[^>]+>/g, "");
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(admin_get_all_blog);
        setBlogs(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          <div className="blog-section">
            <div className="blog-header">
              <h2>Blog</h2>
              <GradientButton text="Add Blogs" variant="filled" className="btn-add" onClick={() => navigate("/add-blog")} />
            </div>

            {loading ? (
              <div className="spinner-container">
                
                <Spin size="large"center/>
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="blog-card-grid">
                {blogs.map((item, index) => (
                  <MemberCard
                    key={index}
                    id={item._id}
                    image={item.image}
                    tag={item.categoryId?.title || "Unkown Category"}
                    categoryId={item.categoryId?._id||""}
                    title={item.heading}
                    description={stripHtml(item.description).length > 50
                      ? stripHtml(item.description).slice(0, 50) + ".."
                      : stripHtml(item.description)
                    }
                    content={item.description}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;