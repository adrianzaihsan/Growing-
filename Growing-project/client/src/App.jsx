import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import AuthProvider from "./contexts/AuthProvider";
import NoteProvider from "./contexts/NoteProvider";
import { ThemeProvider } from "./contexts";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotesPage from "./pages/NotesPage";
import ArchivePage from "./pages/ArchivePage";
import NotFound from "./pages/NotFound";

// Setup axios defaults
axios.defaults.baseURL = "http://localhost:5001";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading, token } = useAuth();

  // Ensure token is in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  const { token } = useAuth();

  // Setup axios defaults whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token set in axios headers:", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      console.log("Token removed from axios headers");
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <ArchivePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function App() {
  // Setup axios interceptor on app initialization
  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Initial token loaded:", token);
    }

    // Setup request interceptor to always include token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("Request URL:", config.url);
        console.log("Request headers:", config.headers);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Setup response interceptor for handling errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "Response error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          // Only redirect if we're not already on login/register page
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/register") {
            console.error("Authentication failed - redirecting to login");
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NoteProvider>
          <AppContent />
        </NoteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
