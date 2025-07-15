import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotes } from "../hooks/useNotes";
import Layout from "../components/Layout";
import { format } from "date-fns";
import axios from "axios";
import {
  FiPlus,
  FiBookOpen,
  FiArchive,
  FiCalendar,
  FiArrowRight,
  FiClock,
  FiTag,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, loading, refreshData } = useNotes();
  const [allNotes, setAllNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // Fetch all notes without filters for Recent Notes
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        setLoadingNotes(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5001/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAllNotes(res.data.notes || []);
      } catch (error) {
        console.error("Error fetching all notes:", error);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchAllNotes();
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Recent notes - ambil 8 untuk 2 baris x 4 kolom dari semua notes (tanpa filter)
  const recentNotes = allNotes
    .filter((note) => !note.is_archived)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  // Prepare chart data
  const prepareMonthlyData = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = Array(12).fill(0);

    if (stats?.monthlyStats) {
      stats.monthlyStats.forEach((stat) => {
        data[stat.month - 1] = stat.count;
      });
    }

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Notes Created",
          data,
          backgroundColor: "rgba(14, 165, 233, 0.5)",
          borderColor: "rgb(14, 165, 233)",
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareCategoryData = () => {
    if (!stats?.categoryStats || stats.categoryStats.length === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e5e7eb"],
            borderWidth: 0,
          },
        ],
      };
    }

    return {
      labels: stats.categoryStats.map((stat) => stat.name),
      datasets: [
        {
          data: stats.categoryStats.map((stat) => stat.count),
          backgroundColor: [
            "rgba(14, 165, 233, 0.7)",
            "rgba(249, 115, 22, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(239, 68, 68, 0.7)",
            "rgba(251, 191, 36, 0.7)",
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
          },
          color: document.body.classList.contains("dark-mode")
            ? "white"
            : "black",
        },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: document.body.classList.contains("dark-mode")
            ? "white"
            : "black",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: document.body.classList.contains("dark-mode")
            ? "white"
            : "black",
        },
      },
    },
  };

  if (loading || loadingNotes) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center"
          style={{ height: "16rem" }}
        >
          <p className="text-light">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-light mt-1">
            Here's an overview of your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card stats-card stats-card-primary slide-up">
            <div className="stats-card-header">
              <div>
                <p className="text-light">Total Notes</p>
                <h2 className="text-3xl font-bold mt-1">
                  {stats?.totalStats?.total_notes || 0}
                </h2>
              </div>
              <div className="stats-card-icon">
                <FiBookOpen />
              </div>
            </div>
          </div>

          <div className="glass-card stats-card stats-card-orange slide-up">
            <div className="stats-card-header">
              <div>
                <p className="text-light">Archived Notes</p>
                <h2 className="text-3xl font-bold mt-1">
                  {stats?.totalStats?.archived_notes || 0}
                </h2>
              </div>
              <div className="stats-card-icon">
                <FiArchive />
              </div>
            </div>
          </div>

          <div className="glass-card stats-card stats-card-purple slide-up">
            <div className="stats-card-header">
              <div>
                <p className="text-light">Active Days</p>
                <h2 className="text-3xl font-bold mt-1">
                  {stats?.totalStats?.active_days || 0}
                </h2>
              </div>
              <div className="stats-card-icon">
                <FiCalendar />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 slide-up">
            <h3 className="text-lg font-medium mb-4">Monthly Activity</h3>
            <div className="chart-container">
              <Line data={prepareMonthlyData()} options={lineOptions} />
            </div>
          </div>

          <div className="glass-card p-6 slide-up">
            <h3 className="text-lg font-medium mb-4">Notes by Category</h3>
            <div className="chart-container">
              <Pie data={prepareCategoryData()} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Notes with Grid Layout */}
        <div className="glass-card p-6 slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Notes</h3>
            <Link
              to="/notes"
              className="text-primary text-sm flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {recentNotes.length > 0 ? (
            <div className="recent-notes-grid">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  to={`/notes?id=${note.id}`}
                  className="recent-note-card group"
                >
                  <h4 className="recent-note-title group-hover:text-primary transition-colors">
                    {note.title}
                  </h4>
                  <p className="recent-note-content">{note.content}</p>
                  <div className="recent-note-footer">
                    <span className="recent-note-category">
                      <FiTag className="recent-note-icon" />
                      {note.category_name || "Uncategorized"}
                    </span>
                    <span className="recent-note-date">
                      <FiClock className="recent-note-icon" />
                      {format(new Date(note.created_at), "MMM d")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="recent-notes-empty">
              <FiBookOpen
                style={{
                  fontSize: "2.5rem",
                  margin: "0 auto 1rem",
                  opacity: 0.5,
                }}
              />
              <p className="text-light mb-4">
                You haven't created any notes yet
              </p>
              <Link to="/notes" className="liquid-button">
                <FiPlus className="mr-2" /> Create Your First Note
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
