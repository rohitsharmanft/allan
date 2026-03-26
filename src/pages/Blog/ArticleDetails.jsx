  import React, { useContext, useState } from "react";
  import img3 from "../../assets/blog3.png";
  import "./ArticleDetails.css";
  import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
  import Sidebar from "../../components/SideBar/Sidebar";
  import ArticleContent from "../../common/ArticleDetail/Articalcontent";
  import GradientButton from "../../common/GradientButton/GradientButton";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import DeleteConfirmModal from "../../common/Modal/DeleteConfirmModal";
  import { toast } from "react-toastify";
  import axios from "axios";
  import { API_URL } from "../../api";
  import { AuthContext } from "../../contexts/AuthContext";
import { Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";
  const ArticleDetail = () => {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useContext(AuthContext);

    const data = location.state
    console.log("datataataata", data)
    const article = {
      id: data?.id,
      title: data?.heading,
      image: data?.image,
      content: data?.content
    };

    const handleDelete = async () => {
      if (deleting) return;

      setDeleting(true);
      try {
        const response = await axios.delete(
          `${API_URL}/Admin/api/delete-blogs/${data.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code === 200) {
          toast.success("Blog deleted successfully!");
          navigate("/blog");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error. Could not delete blog.");
      } finally {
        setDeleting(false);
        setOpen(false);
      }
    };

    const handleEdit = () => {
      navigate("/edit-detail", { state: data });
    };

    return (
      <>
        <DashboardHeader />

        <div className="dashboard-main">
          <div className="dashboard-left">
            <Sidebar />
          </div>

          <div className="dashboard-right">
            <div className="article-detail-page">
              <div className="blog-bread">
               <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/blog">Blog</Link>,
                  },

                  {
                    title: "Blog Details",
                  },
                ]}
              />
            </div>
            </div>

              <h3 className="blog-details">Blog Details</h3>
              <ArticleContent image={article.image} content={article.content} />
              <div className="btn">
                <GradientButton text={"Edit"} className="btn-edit" onClick={handleEdit} />
                <GradientButton text={"Delete"} className="btn-delete" onClick={() => setOpen(true)} />
              </div>
            </div>
          </div>
        </div>
        <DeleteConfirmModal
          open={open}
          onCancel={() => setOpen(false)}
          onConfirm={handleDelete}
          text={'Are You Sure You Want To Delete This Blog?'}
        />
      </>
    );
  };

  export default ArticleDetail;
