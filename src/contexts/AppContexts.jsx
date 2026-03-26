// src/contexts/AppContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { fetch_member_profile, fetch_client_profile, advisory_list } from "../api";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [userType, setUserType] = useState(localStorage.getItem("userType") || '');
  const token = localStorage.getItem("accessToken");
  const [user, setUser] = useState(undefined);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [advisory, setAdvisory] = useState([])
  const subscriptionData = user?.subscriptionsData

  async function refreshProfile() {
    setLoadingProfile(true);
    try {
      let endpoint = null;
      if (userType === "member") { endpoint = fetch_member_profile; }
      else if (userType === "client") { endpoint = fetch_client_profile; }

      if (!token || !userType || !endpoint) {
        setUser(null);
        return null;
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let payload = res?.data?.data ?? null;
      if (Array.isArray(payload)) {
        payload = payload[0] || null;
      }
      setUser(payload);
      return payload;
    } catch (err) {
      console.error("refreshProfile error:", err);
      setUser(null);
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchAdvisory = async (type, id) => {
    setLoadingProfile(true)
    const payloads = {
      type: type,
      id: id
    }
    try {
      const response = await axios.post(advisory_list, payloads);
      setAdvisory(response.data.data.advisories.data)
    } catch (error) {

    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (userType && token) {
      refreshProfile();
    }
  }, [userType, token]);

  return (
    <AppContext.Provider
      value={{
        user, setUser, userType, setUserType, token,
        loadingProfile, refreshProfile, fetchAdvisory, advisory, subscriptionData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};