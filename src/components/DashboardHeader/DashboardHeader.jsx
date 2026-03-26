  import React from "react";
  import "./DashboardHeader.css";
  import logo from "../../assets/logo.png";

  const DashboardHeader = () => {
    const today = new Date();
    const day = today.getDate();
    const weekday = today.toLocaleString("default", { weekday: "short" });
    const month = today.toLocaleString("default", { month: "long" });

    return (
      <>
      
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Skills & Trades Africa" className="header-logo" />

          <div className="header-date">
            <div className="date-circle">{day}</div>
            <div className="date-text">
              <p>{weekday}</p>
              <span>{month}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <h4>
            Hello <span role="img" aria-label="wave"></span>
          </h4>
          <p>Welcome Back to the Skills & Trades</p>
        </div>
      

      </header>
      </>
    );
  };

  export default DashboardHeader;
