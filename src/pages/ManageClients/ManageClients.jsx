import "./ManageClients.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import basic from "../../assets/basic.png";
import premium from "../../assets/premium.png";
import StatsCards from "../../common/Cards/StatsCards";
import ClientTable from "./ClientTable";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const ManageClients = () => {
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
          <ClientTable />
        </div>
      </div>
    </>
  );
};

export default ManageClients;
