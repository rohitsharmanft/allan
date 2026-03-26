import React from "react";
import img7 from "../../../assets/images/img7.png";
import './ArticleDetails.css'
import ArticleContent from "../../../Components/Common/ArticleDetail/Articalcontent";
import RelatedArticles from "../../../Components/Common/ArticleDetail/RelatedArticles";
import Footer from "../../../Components/Common/Footer/Footer";
import Header from "../../../Components/Common/Header/Header";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
const ArticleDetail = () => {
  const location=useLocation();
  const data=location.state
  console.log(data)
  const article = {
    title: data.title,
    bgImage: img7,
    image: data.image||img7,
    content: data.description
  };

  const related = [
    {
      tag: "Member Advisory",
      image: img7,
      title: "Managing Your Money",
      description: "Effective tips for financial management and growth.",
      link: "#",
    },
    {
      tag: "Member Advisory",
      image: img7,
      title: "Smart Marketing Ideas",
      description: "Creative strategies to attract new clients.",
      link: "#",
    },
    {
      tag: "Member Advisory",
      image: img7,
      title: "Smart Marketing Ideas",
      description: "Creative strategies to attract new clients.",
      link: "#",
    },
  ];


  return (
    <>
  
    <Header/>
    <div className="article-detail-page">
        <div className="hero-section">
          <div className="overlay"></div>
          <h1>{data.title}</h1>
        </div>
        {/* <div className="breadcrumb">
          Member Advice Center&gt; <span>{data.title}</span>
        </div> */}
        <div className="breadcrumb">
  <Breadcrumb
    separator={<FiChevronRight size={14} className="ss" />}
    items={[
      {
        title: <Link to="/member-advice-center">Member Advice Center</Link>,
      },
      {
        title: <span>{data.title}</span>,
      },
    ]}
  />
</div>
      
      <ArticleContent image={article.image} content={article.content} />
      <RelatedArticles articles={related} />
    </div>
     <Footer/>
    </>
   
  );
};

export default ArticleDetail;
