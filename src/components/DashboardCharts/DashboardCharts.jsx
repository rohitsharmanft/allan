import React, { useContext } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import "./DashboardCharts.css";
import { AuthContext } from "../../contexts/AuthContext";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLORS = ["#9C59B6", "#B7A7FF", "#0140A6"];

const countryData = [
  { name: "Algeria", value: 30 },
  { name: "South Africa", value: 50 },
  { name: "Zimbabwe", value: 20 },
];

const tooltipStyle = {
  borderRadius: "10px",
  border: "none",
  backgroundColor: "rgba(255,255,255,0.9)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};


const DashboardCharts = () => {
  const { memberDistribution, loading, error } = useContext(AuthContext);
  console.log(memberDistribution[0])

  const paddedDistribution = MONTHS.map((month, index) => {
    const found = (memberDistribution || []).find((d) => {
      // Handle both "Mar" and "2026-03" formats
      const monthNum = String(index + 1).padStart(2, "0");
      return d.month === month || d.month?.endsWith(`-${monthNum}`);
    });
    return { month, basic: found ? found.basic : 0, premium: found ? found.premium : 0 };
  });
  return (
    <div className="charts-row">

      {/* Monthly User Distribution */}
      <div className="chart-card">
        <div className="top">
          <h3 className="chart-title">Monthly User Distribution</h3>
        </div>

        {loading ? (
          <div className="chart-loading">Loading...</div>
        ) : error ? (
          <div className="chart-error">Error: {error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paddedDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid stroke="#E5E7EB" strokeWidth={0.1} vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#E5E7EB" strokeWidth={0.1}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB", strokeWidth: 0.1 }}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 0.1 }}
              />
              <YAxis
                stroke="#E5E7EB" strokeWidth={0.1}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickLine={{ stroke: "#E5E7EB", strokeWidth: 0.1 }}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 0.1 }}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="basic" fill="#8658EB" name="Basic Users" barSize={6} radius={[5, 5, 0, 0]} />
              <Bar dataKey="premium" fill="#C6A5F7" name="Premium Users" barSize={6} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Users By Country */}
      {/* <div className="chart-card">
        <h3 className="chart-title">Users By Country</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={countryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
            >
              {countryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <image
              href={logo}
              x="50%" y="50%"
              width="100" height="40"
              transform="translate(-50, -25)"
              style={{ pointerEvents: "none" }}
            />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div> */}

    </div>
  );
};

export default DashboardCharts;