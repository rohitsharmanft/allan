import React, { useContext } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import "./RevenueCharts.css";
import { AuthContext } from "../../contexts/AuthContext";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const tooltipStyle = {
  borderRadius: "10px",
  border: "none",
  backgroundColor: "rgba(255,255,255,0.9)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const RevenueCharts = () => {
  const { monthlyRevenue, loading, error, weeklyData } = useContext(AuthContext);

  // Always 12 months — missing months default to 0
  const paddedMonthlyRevenue = MONTHS.map((month, index) => {
    const found = (monthlyRevenue || []).find((d) => {
      const monthNum = String(index + 1).padStart(2, "0");
      return d.month === month || d.month?.endsWith(`-${monthNum}`);
    });
    return { month, revenue: found ? found.revenue : 0 };
  });



  const renderState = (isEmpty) => {
    if (loading) return <div className="chart-loading">Loading...</div>;
    if (error)   return <div className="chart-error">Error: {error}</div>;
    if (isEmpty) return <div className="chart-empty">No data available</div>;
    return null;
  };

  return (
    <div className="revenue-row">

      {/* Weekly Revenue */}
      <div className="revenue-card">
        <h3 className="chart-title">Weekly Revenue</h3>
        {renderState(!weeklyData || weeklyData.length === 0) || (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid stroke="#E5E7EB" strokeWidth={0.1} vertical={false} />
              <XAxis dataKey="day" stroke="#D1D5DB" strokeWidth={0.1} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis stroke="#D1D5DB" strokeWidth={0.1} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`£${value.toLocaleString()}`, "Revenue"]}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="revenue" fill="#8658EB" barSize={14} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly Revenue */}
      <div className="revenue-card">
        <div className="chart-header">
          <h3 className="chart-title">Monthly Revenue</h3>
        </div>
        {renderState(loading ? true : false) || (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paddedMonthlyRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5E7EB" strokeWidth={0.1} vertical={false} />
              <XAxis dataKey="month" stroke="#D1D5DB" strokeWidth={0.1} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis stroke="#D1D5DB" strokeWidth={0.1} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`£${value.toLocaleString()}`, "Revenue"]}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED" strokeWidth={2}
                dot={{ fill: "#7C3AED", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#7C3AED" }}
                fill="url(#colorRevenue)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};

export default RevenueCharts;