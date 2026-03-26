import "./ManageMembers.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import basic from "../../assets/basic.png";
import premium from "../../assets/premium.png";
import StatsCards from "../../common/Cards/StatsCards";
import MemberTable from "./MemberTable";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const ManageMembers = () => {
  const { Count, thisWeekRevenue, totalRevenueCollected } = useContext(AuthContext)
  const totalCount = Count?.freeCount + Count?.premiumCount + Count?.basicCount
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
          <div className="breakdown-container">
            {/* <h3 className="breakdown-title">Profile Status Breakdown</h3>
            <div className="breakdown-box">
              <div className="breakdown-row">
                <div>
                  <span>Active</span>
                  <p>2</p>
                </div>
                <div>
                  <span>Incomplete</span>
                  <p>2</p>
                </div>
                <div>
                  <span>Inactive</span>
                  <p>2</p>
                </div>
                <div>
                  <span>With Profiles</span>
                  <p>1</p>
                </div>
                <div>
                  <span>Completed</span>
                  <p>2</p>
                </div>
                <div>
                  <span>Without Profiles</span>
                  <p>10</p>
                </div>
              </div>
            </div> */}
            <div className="text">
              <h3 className="breakdown-title1">Membership Type Breakdown</h3>
            </div>

            <div className="breakdown-box1">
              <div className="breakdown-row">
                <div>
                  <span>Premium Users</span>
                  <p>{Count?.premiumCount}</p>
                </div>
                <div>
                  <span>Premium %</span>
                  <p>{((Count?.premiumCount / totalCount) * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <span>Basic Users</span>
                  <p>{Count?.basicCount}</p>
                </div>
                <div>
                  <span>Basic %</span>
                  <p>{((Count?.basicCount / totalCount) * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <span>Free Users</span>
                  <p>{Count?.freeCount}</p>
                </div>
                <div>
                  <span>Free %</span>
                  <p>{((Count?.freeCount / totalCount) * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          <MemberTable />
        </div>
      </div>
    </>
  );
};

export default ManageMembers;
