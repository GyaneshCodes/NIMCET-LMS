import React, { useState, useEffect } from "react";
import Navbar from "../components/Dashboard/Navbar.jsx";
import "./Profile.css";

const Profile = () => {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "Student",
    email: "student@example.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    joinedDate: "Nov 2025"
  });

  useEffect(() => {
    fetchRecentAttempts();
    // Fetch user details if available from an endpoint, otherwise using placeholder/localStorage
    const storedUser = localStorage.getItem("user"); // Assuming we might store basic info
    if (storedUser) {
        // setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchRecentAttempts = async () => {
    try {
      const response = await fetch("/api/v1/questions/quiz/attempts/recent?limit=10");
      const data = await response.json();
      if (data.success) {
        setRecentAttempts(data.data);
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
            <div className="profile-details">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <span className="joined-badge">Joined {user.joinedDate}</span>
            </div>
          </div>
          <div className="profile-stats-summary">
            <div className="stat-card">
              <h3>{recentAttempts.length}</h3>
              <p>Quizzes Taken</p>
            </div>
            {/* Add more summary stats if available */}
          </div>
        </div>

        <div className="recent-activity-section">
          <h2>Recent Activity</h2>
          <div className="attempts-list">
            {loading ? (
              <div className="loading-state">Loading history...</div>
            ) : recentAttempts.length > 0 ? (
              recentAttempts.map((attempt) => (
                <div key={attempt._id} className="attempt-card">
                  <div className="attempt-info">
                    <span className="attempt-topic">{attempt.topicName || "Unknown Topic"}</span>
                    <span className="attempt-date">{formatDate(attempt.attemptedAt)}</span>
                  </div>
                  <div className="attempt-result">
                    <span className={`result-badge ${attempt.isCorrect ? "correct" : "incorrect"}`}>
                      {attempt.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                    <span className="attempt-time">{formatTime(attempt.timeTaken)}</span>
                  </div>
                  <div className="attempt-details">
                    <p className="question-preview">{attempt.questionText}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No recent activity found. Start a quiz!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
