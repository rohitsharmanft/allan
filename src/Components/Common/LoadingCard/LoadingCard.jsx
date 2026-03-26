import React from "react";
import { Spin } from "antd";
import "./LoadingCard.css";

const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="pageWrapper">
      <div className="loadingCardWrapper">
        <div className="loadingCardBox">
          <Spin size="large" />
          <p className="loadingMessage">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
