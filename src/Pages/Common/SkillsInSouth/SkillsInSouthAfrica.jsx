import React, { useState } from "react";
import "./SkillsInSouthAfrica.css";
import CompanyCard from "../../../Components/Common/CompanyCard";
import logo from "../../../assets/images/logo.png";
import call from "../../../assets/icons/phone.png";
import mail from "../../../assets/icons/email.png";
import whatsapp from "../../../assets/icons/whatsapp.png";
import web from "../../../assets/icons/message.png";
import Header from "../../../Components/Common/Header/Header";
import Footer from '../../../Components/Common/Footer/Footer';
import { Breadcrumb, Pagination } from "antd";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const SkillsInSouthAfrica = () => {
  const location = useLocation();
  const [allProfiles, setAllProfiles] = useState(location?.state.profileData || []);
  const locationName = location?.state?.profileData[0].workLocation || "";
  const [category, setCategory] = useState(location?.state.category)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCompanies = allProfiles.slice(startIndex, startIndex + pageSize);
  console.log(allProfiles)
  console.log(category)
  console.log(":::::::::>>>", locationName)
  return (
    <>
      <Header />
      <div className="skills-page">
        <div
          className="hero-section"
        >
          <div className="overlay"></div>
          <h1>Skills in {locationName}</h1>
        </div>

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
              ...(category ? [{
                title: <Link to="/administration" state={category}>Administration Skills</Link>,
              }] : []),
              {
                title: `Skills in ${locationName}`,
              },
            ]}
          />
        </div>
        {/* <h2 className="page-title">Skills In {locationName}</h2>   */}
        <div className="card-container">
          {paginatedCompanies.map((company, index) => (
            <CompanyCard
              key={index}
              {...company}
              phoneIcon={call}
              mailIcon={mail}
              whatsappIcon={whatsapp}
              webIcon={web}
              logo={company?.image || logo}
              companyData={company}
              profileData={allProfiles}
              categoryData={category}
              locationName={locationName}
            />
          ))}
        </div>


        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={allProfiles.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            itemRender={(page, type, originalElement) => {
              if (type === "prev") {
                return <LeftOutlined />;
              }
              if (type === "next") {
                return <RightOutlined />;
              }
              if (type === "jump-prev") {
                return <DoubleLeftOutlined />;
              }
              if (type === "jump-next") {
                return <DoubleRightOutlined />;
              }
              return originalElement;
            }}
          />
        </div>

      </div>
      <Footer />
    </>
  );
};

export default SkillsInSouthAfrica;
