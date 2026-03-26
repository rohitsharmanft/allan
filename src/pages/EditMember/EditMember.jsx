import React from "react";
import { Breadcrumb, Form } from "antd";
import InputField from "../../common/InputField/InputField";
import "./EditMember.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import GradientButton from "../../common/GradientButton/GradientButton";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const EditMember = () => {
  const [form] = Form.useForm();

  const handleUpdate = (values) => {
    console.log("Updated Details:", values);
  };

  const handleDiscard = () => {
    form.resetFields();
  };

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
        
         
            <div className="bread-crumb_">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/manage-members">Basic Member</Link>,
                },

                {
                  title: "View Profile",
                },
              ]}
            />
          </div>

          <div className="edit-member-container">
            <h3>Edit Member</h3>
            <div className="form">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                className="edit-form"
              >
                <div className="form-row">
                  <InputField label="Name" name="name" placeholder="John Doe" className="name" />
                  <InputField
                    label="Email Address"
                    name="email"
                    placeholder="Johndoe123@gmail.com"
                     className="name"
                  />
                </div>

                <div className="form-row">
                  <InputField
                    label="Membership Number"
                    name="membership"
                    placeholder="S2509010"
                     className="name"
                  />
                  <InputField
                    label="Status"
                    name="status"
                    placeholder="Active"
                     className="name"
                  />
                </div>

                <div className="button-row">
                  <GradientButton
                    text="Update Details →"
                    variant="filled"
                    htmlType="submit"
                    className="btn-update"
                  />
                  <GradientButton
                    text="Discard Changes →"
                    variant="outlined"
                    className="btn-discard"
                    onClick={handleDiscard}
                  />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMember;
