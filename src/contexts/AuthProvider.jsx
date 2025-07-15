import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

// Setup axios interceptor untuk selalu mengirim token
const setupAxiosInterceptors = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Komponen Provider saja (tidak mengekspor context di sini)
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5001/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Only logout if it's an auth error
      if (error.response?.status === 401) {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Clear axios headers
        setupAxiosInterceptors(null);
        // Reset state
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Setup axios default headers
    setupAxiosInterceptors(token);

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      const { token: newToken, user: userData } = res.data;

      // Store token in localStorage
      localStorage.setItem("token", newToken);

      // Update axios headers immediately
      setupAxiosInterceptors(newToken);

      // Update state
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        username,
        email,
        password,
      });

      const { token: newToken, user: userData } = res.data;

      // Store token in localStorage
      localStorage.setItem("token", newToken);

      // Update axios headers immediately
      setupAxiosInterceptors(newToken);

      // Update state
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = useCallback(() => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear axios headers
    setupAxiosInterceptors(null);

    // Reset state
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
