import React, { useContext } from "react";
import "./DashBoard.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import StatsCards from "../../common/Cards/StatsCards";
import basic from "../../assets/basic.png";
import premium from "../../assets/premium.png";
import DashboardCharts from "../../components/DashboardCharts/DashboardCharts";
import RevenueCharts from "../../components/RevenueCharts/RevenueCharts";
import UserTable from "../../components/UserTable/UserTable";
import { useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
const Dashboard = () => {
  const { Count, thisWeekRevenue, totalRevenueCollected } = useContext(AuthContext)
  const stats = [
    {
      title: "Free Members",
      value: Count?.freeCount,
      subtitle: `+ ${Count.freeThisWeek} THIS WEEK`,
      bgImage: premium,
    },
    {
      title: "Basic Members",
      value: Count?.basicCount,
      subtitle: `+ ${Count.basicThisWeek} THIS WEEK`,
      bgImage: basic,
    },
    {
      title: "Premium Members",
      value: Count?.premiumCount,
      subtitle: `+ ${Count.premiumThisWeek} THIS WEEK`,
      bgImage: premium,
    },
    {
      title: "Total Register Clients",
      value: Count?.clientCount,
      subtitle: `+ ${Count.clientThisWeek} THIS WEEK`,
      bgImage: basic,
    },
    {
      title: "Total Revenue Collected",
      value: `${totalRevenueCollected}`,
      subtitle: `+ ${thisWeekRevenue || "0"} THIS WEEK`,
      bgImage: premium,
    },
  ];

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>


        <div className="dashboard-right">
          <div className="stats-row">
            {stats.map((s, i) => (
              <StatsCards key={i} {...s} />
            ))}
          </div>
          <div className="charts-section">
            <DashboardCharts />
            <RevenueCharts />
          </div>
          <UserTable />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
