import React, { useState, useEffect, useContext } from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import { Table, Avatar, Space, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import GradientButton from "../../common/GradientButton/GradientButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_URL,
  admin_get_all_category,
  admin_delete_category,
} from "../../api";
// import { API_URL, admin_delete_category } from '../../api';
import { AuthContext } from "../../contexts/AuthContext";
import { Modal } from "antd";
import { toast } from "react-toastify";
import "./CreateCategory.css";
function CategoryMangement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow(true);
  };
  const onCancel = () => {
    setShow(false);
  };
  const [categoryId, setCategoryId] = useState("");
  const deleteCategory = async () => {
    try {
      const response = await axios.delete(
        `${admin_delete_category}/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status === true && response.data.code === 200) {
        toast.success("Deleted successfully");
        setShow(false);
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting");
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(admin_get_all_category, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === true && response.data.code === 200) {
        const formattedData = response.data.data.map((item, index) => ({
          key: item._id || index,
          srNo: index + 1,
          title: item.title || "N/A",
          // description: item.description.slice(0, 70) + '...' || 'No description',
          description: item.description
            ? item.description.slice(0, 70) + "..."
            : "No description",

          icon: item.icon
            ? `${item.icon}`
            : "https://via.placeholder.com/40?text=No+Icon",
        }));
        setCategories(formattedData);
      } else {
        message.error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "srNo",
      key: "srNo",
      width: 80,
      align: "center",
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => (
        <img
          src={icon}
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
      ),
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    // {
    //     title: 'Description',
    //     dataIndex: 'description',
    //     key: 'description',
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/update-category`, { state: record })}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => {
              setCategoryId(record.key);
              setShow(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader />
      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>
        <div className="dashboard-right">
          <div
            className="bb"
            style={{
              padding: "24px 10px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <div className="abc">
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
                Category Management
              </h2>

              <GradientButton
                text="Add new category"
                className="btn-export"
                onClick={() => navigate("/create-category")}
              />
            </div>

            <div className="table-box">
              <Table
                dataSource={categories}
                columns={columns}
                pagination={{ pageSize: 8 }}
                loading={loading}
                bordered
                rowKey="key"
                locale={{ emptyText: "No categories found" }}
              />
            </div>
          </div>
          <Modal
            open={show}
            onCancel={onCancel}
            footer={null}
            centered
            closable={false}
            className="delete-modal"
          >
            <h3 className="delete-text">Are you sure you want to Delete?</h3>

            <div className="delete-actions">
              <GradientButton
                className="btn-yes"
                onClick={deleteCategory}
                text={"Yes"}
              ></GradientButton>
              <GradientButton
                className="btn-no"
                onClick={onCancel}
                text={" No"}
              ></GradientButton>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default CategoryMangement;
