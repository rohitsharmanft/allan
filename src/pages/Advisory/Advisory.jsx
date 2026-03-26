import React, { useEffect, useState, useContext } from "react";
import "./Blog.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import MemberCard from "../../common/MemberCard1/MemberCard";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import { useNavigate } from "react-router-dom";
import { admin_get_all_advisory } from "../../api";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const Advisory = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("Client");

  const stripHtml = (html) => (html || "").replace(/<[^>]+>/g, "").trim();

  const truncate = (text, max = 120) =>
    text.length > max ? text.slice(0, max).trim() + "..." : text;

  useEffect(() => {
    const fetchAdvisory = async () => {
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          admin_get_all_advisory,
          { type },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.status === true) {
          setBlogs(response.data.data.data || []);
        } else {
          setError(response.data?.message || "Failed to fetch advisory");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong while loading advisory");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisory();
  }, [type, token]);

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
              <h2>Advisory</h2>
              <GradientButton
                text="Add Advisory Article"
                variant="filled"
                className="btn-add-"
                onClick={() => navigate("/add-advisory")}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", margin: "16px 0 24px" }}>
              <GradientButton
                text="Client Advisory"
                variant={type === "Client" ? "filled" : "outlined"}
                onClick={() => setType("Client")}
              />
              <GradientButton
                text="Member Advisory"
                variant={type === "Member" ? "filled" : "outlined"}
                onClick={() => setType("Member")}
              />
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                Loading advisory...
              </div>
            ) : error ? (
              <div style={{ color: "red", textAlign: "center", padding: "40px 0" }}>
                {error}
              </div>
            ) : blogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
                No {type} advisory found.
              </div>
            ) : (
              <div className="blog-card-grid">
                {blogs.map((item) => (
                  <MemberCard
                    key={item._id}
                    id={item._id}
                    image={item.image}
                    tag={item.categoryTitle || "Advisory"}
                    title={item.title || "Untitled"}
                    description={truncate(stripHtml(item.description), 110)}
                    content={item.description}
                    categoryId={item.categoryId}
                    categoryTitle={item.categoryTitle}
                    type={item.type}
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

export default Advisory;