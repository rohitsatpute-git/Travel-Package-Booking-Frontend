// src/utils/auth.js
import {jwtDecode} from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getUserFromToken();
  return user?.role === "admin";
};
