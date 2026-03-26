import React from 'react'
import './MemberPricingCard.css'
import { CheckCircleOutlined } from "@ant-design/icons";
import GradientButton from './GradientButton';


const MemberPricingCard = ({ plan, price, usdPrice, benefits, onClick, buttonText, disabled }) => {
  return (
    <div className="pricing-card">
      <div className="pricing-left">
        <h3 className="plan">{plan}</h3>
        <div className="price-year">
          <p className="price">R{price}/per year</p>
        </div>

        <div className='cate-btn'>
          <GradientButton
            text={buttonText}
            onClick={onClick}
            disabled={disabled}
          />
        </div>

      </div>

      <div className="pricing-right">
        <h3 className="benefits-title">Benefits</h3>
        <ul className="benefits-list">
          {benefits.map((item, index) => (
            <li key={index}>
              <CheckCircleOutlined className="check-icon" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberPricingCard;