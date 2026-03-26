// src/utils/validateToken.js
import axios from "axios";
import { login } from "../slices/authSlice";
import { API_URL } from "../../api";
export async function validateToken(dispatch, setLoading) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    setLoading(false);
    return;
  }
  try {
    // If token is present
    if (token) {
      dispatch(
        login({
          isAuthenticated: true,
          user:  null,
          token: token,
          role: null,
        })
      );
    }
  } catch (err) {
    console.log("Token validation error:", err);
  }

  setLoading(false);
}
