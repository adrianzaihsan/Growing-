import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import {
  FiHome,
  FiBook,
  FiArchive,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <FiHome className="text-xl" />,
    },
    {
      path: "/notes",
      label: "My Notes",
      icon: <FiBook className="text-xl" />,
    },
    {
      path: "/archive",
      label: "Archive",
      icon: <FiArchive className="text-xl" />,
    },
  ];

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="mobile-header glass-card md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mobile-menu-button"
        >
          <FiMenu />
        </button>

        <h1 className="text-xl font-bold text-primary">GROWING</h1>

        <button onClick={toggleTheme} className="mobile-menu-button">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </header>
      {isSidebarOpen && (
        <div className="mobile-sidebar-backdrop" onClick={closeSidebar} />
      )}

      <div
        className={`mobile-sidebar glass-card md:hidden ${
          isSidebarOpen ? "open" : ""
        }`}
        style={{
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="sidebar-header">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Menu</h2>
            <button onClick={closeSidebar} className="mobile-menu-button">
              <FiX />
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="user-profile glass-card">
            <div className="user-avatar">
              <FiUser />
            </div>
            <div className="user-info">
              <p className="user-name">{user?.username}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              right: "1rem",
            }}
          >
            <button
              onClick={handleLogout}
              className="sidebar-item text-danger w-full"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex"
        style={{ paddingTop: "4rem", paddingBottom: "1rem" }}
      >
        <div className="sidebar glass-card hidden md:flex">
          <div className="sidebar-header">
            <h1 className="text-xl font-bold text-primary">GROWING</h1>
          </div>

          <div className="sidebar-content">
            <div className="user-profile glass-card">
              <div className="user-avatar">
                <FiUser />
              </div>
              <div className="user-info">
                <p className="user-name">{user?.username}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>

            <nav>
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="sidebar-footer">
            <div className="flex items-center justify-between mb-4">
              <span>Theme</span>
              <button onClick={toggleTheme} className="mobile-menu-button">
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="sidebar-item text-danger w-full"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <main className="main-content">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
