import React from "react";
import "./PolicyPageLayout.css";

const PolicyPageLayout = ({ title, sections }) => {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <h1>{title}</h1>     
      </div>

      <div className="policy-content">
        {sections.map((section, i) => (
          <div key={i} className="policy-section">
            {section.heading && <h2>{section.heading}</h2>}
            {section.subHeading && <h3>{section.subHeading}</h3>}
            {section.paragraphs &&
              section.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            {section.list && (
              <ul>
                {section.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>     
    </div>
  );
};

export default PolicyPageLayout;
