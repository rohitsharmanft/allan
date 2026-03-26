// src/contexts/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { admin_fetch_user_counts, admin_get_dashboard, admin_view_profile } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [Count, setCount] = useState([]);
  const [memberDistribution, setMemberDistribution] = useState([]);
  const headers = { Authorization: `Bearer ${token}` }
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenueCollected, setTotalRevenueCollected] = useState([]);
  const [thisWeekRevenue, setThisWeekRevenue] = useState([]);
  const DAY_MAP = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun" };
  const MONTH_MAP = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  useEffect(() => {
    if (token) { localStorage.setItem("accessToken", token); }
    else { localStorage.removeItem("accessToken"); }
  }, [token]);

  const fetchProfile = async () => {
    try {
      if (!token) { setLoadingProfile(false); return }
      const res = await axios.get(admin_view_profile, { headers });
      setUser(res.data.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
      setUser(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      if (!token) { setLoading(false); return }
      setLoading(true);
      setError(null);
      const res = await axios.get(admin_get_dashboard, { headers });
      if (res.data?.code === 200) {
        const { memberDistribution, weeklyRevenue, monthlyRevenue, totalRevenueCollected, thisWeekRevenue } = res.data.data;
        setMemberDistribution(memberDistribution || []);
        setWeeklyData(weeklyRevenue || []);
        setMonthlyRevenue(monthlyRevenue || []);
        setTotalRevenueCollected(totalRevenueCollected || "")
        setThisWeekRevenue(thisWeekRevenue || "")
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      console.error("Dashboard stats fetch failed", err);
      setError(err.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };



  console.log(memberDistribution  ,thisWeekRevenue)
  const fetchCount = async () => {
    try {
      const res = await axios.get(admin_fetch_user_counts, { headers });
      const data = res?.data?.data;
      setCount(data);

      const monthly = (data?.monthlyMembers || []).map((item) => ({
        month: MONTH_MAP[item.month] || `M${item.month}`,
        revenue: item.basicCount + item.premiumCount,
      }));
      setMonthlyData(monthly);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { if (token) fetchProfile(); }, [token]);
  useEffect(() => { if (token) fetchDashboardStats(); }, [token]);
  useEffect(() => { if (token) { fetchCount() } }, [token])

  return (
    <AuthContext.Provider value={{
      loading, error, weeklyData, monthlyData,
      user, setUser, loadingProfile, fetchProfile, token, fetchCount, Count,
      setToken, fetchDashboardStats, memberDistribution, monthlyRevenue, totalRevenueCollected, thisWeekRevenue
    }}>
      {children}
    </AuthContext.Provider>
  );
};
