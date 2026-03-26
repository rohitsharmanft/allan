// src/services/fetch_member_profile.js
import axios from "axios";
import { fetch_member_profile, update_profile_member } from "../api";

export const getAccessToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * fetchMemberProfile
 * - returns single profile object or null
 */
export const fetchMemberProfile = async () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await axios.get(fetch_member_profile, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const payload = res?.data?.data;
    if (!payload) return null;
    return Array.isArray(payload) ? payload[0] || null : payload;
  } catch (err) {
    console.error("fetchMemberProfile error:", err);
    return null;
  }
};

/**
 * updateMemberProfile
 * - sends body to the member update endpoint, returns response.data or null
 */
export const updateMemberProfile = async (body) => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await axios.put(update_profile_member, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res?.data || null;
  } catch (err) {
    console.error("updateMemberProfile error:", err);
    return null;
  }
};
