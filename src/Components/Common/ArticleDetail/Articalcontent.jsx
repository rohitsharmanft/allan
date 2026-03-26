import React from "react";

const ArticleContent = ({ image, content }) => {
  return (
    <div className="article-content">
      <img src={image} alt="article" className="main-image" />
      <div className="content-text" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};        

export default ArticleContent;
