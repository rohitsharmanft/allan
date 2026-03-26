import React from "react";
import "./FAQItem.css";

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <div className="faq-question" onClick={onToggle}>
        <div className="faq-toggle">
          <span className="faq-icon">{isOpen ? "×" : "+"}</span>
        </div>
        <span className="faq-text">{question}</span>
      </div>

      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

export default FAQItem;
