import React from "react";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import "./Reviews.css";
import GradientButton from "../../common/GradientButton/GradientButton";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard1 from "../../common/ReviewCard/ProfileCard1";
import { Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";
const MissedAppointment = () => {
  const navigate = useNavigate();
  const profiles = [
    {
      name: "Allan",
      reviews: 1,
      rating: 4.75,
      description: "Online skills platform",
      location: "South Africa",
      image: logo,
    },
    {
      name: "James",
      reviews: 1,
      rating: 4.75,
      description: "Experienced architect",
      location: "Harare",
      image: logo,
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
          <div className="views">
             
           <div className="bread-crumb_">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/reviews">All Profiles</Link>,
                },

                {
                  title: "View Profile",
                },
              ]}
            />
          </div>
          </div>

          <div className="profile_content">
            <div className="profile_header">
              <div>
                <div className="all-btn">
                  <GradientButton
                    text={"Reviews"}
                    onClick={() => navigate("/reviews")}
                    className="button"
                  />
                  <GradientButton
                    text={"Missed Appointment"}
                    onClick={() => navigate("/missed-appointment")}
                    className="btn1"
                  />
                  <GradientButton
                    text={"Complaints"}
                    onClick={() => navigate("/complaint")}
                    className="button"
                  />
                </div>
              </div>
            </div>
            <div className="profile-cards">
              {profiles.map((p, index) => (
                <ProfileCard1
                  key={index}
                  {...p}
                  onEdit={() => navigate("/view-missed-appointment")}
                  buttonText="View Missed Appointment →"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MissedAppointment;
