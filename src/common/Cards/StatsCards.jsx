import React from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import "./StatsCards.css";

const StatsCards = ({ title, value, subtitle, bgImage }) => {
  return (
    <div
      className="stat-card"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
      }}
    >
      <div className="title">{title}</div>

      <div className="stats-data">
        <div className="value">{value}</div>
        <div className="subtitle">
          <ArrowUpOutlined style={{ color: "green", marginRight: "6px" }} />
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
