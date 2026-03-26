import React from "react";
import ArticleCard from "../../Common/ArticleCard/ArticleCard"; 

const RelatedArticles = ({ articles }) => {
  return (
    <div className="related-section">
      <h2>You May Also Like</h2>

      <div className="related-grid">
        {articles.map((item, i) => (
          <ArticleCard
            key={i}
            image={item.image}
            tag={item.tag}
            title={item.title}
            description={item.description}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
