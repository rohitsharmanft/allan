// src/services/fetch_client_profile.js
import axios from "axios";
import { fetch_client_profile, update_profile_client } from "../api";

export const getAccessToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * fetchClientProfile
 * - returns single profile object or null
 */
export const fetchClientProfile = async () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await axios.get(fetch_client_profile, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const payload = res?.data?.data;
    if (!payload) return null;
    return Array.isArray(payload) ? payload[0] || null : payload;
  } catch (err) {
    console.error("fetchClientProfile error:", err);
    return null;
  }
};

/**
 * updateClientProfile
 * - sends body to the client update endpoint, returns response.data or null
 */
export const updateClientProfile = async (body) => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await axios.put(update_profile_client, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res?.data || null;
  } catch (err) {
    console.error("updateClientProfile error:", err);
    return null;
  }
};
