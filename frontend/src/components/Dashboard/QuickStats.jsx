import React from "react";
import { FiActivity, FiTarget, FiClock, FiTrendingUp } from "react-icons/fi";

const QuickStats = ({ stats, isBeginner }) => {
  if (isBeginner) {
    return (
      <div className="quick-stats-grid">
        <div className="stat-card">
          <div className="stat-label"><FiActivity /> Quizzes Completed</div>
          <div className="stat-value">0</div>
          <div className="stat-subtext">Start your first quiz today!</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><FiTarget /> Accuracy</div>
          <div className="stat-value">-</div>
          <div className="stat-subtext">No data yet</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><FiClock /> Avg Speed</div>
          <div className="stat-value">-</div>
          <div className="stat-subtext">No data yet</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><FiTrendingUp /> Strongest Area</div>
          <div className="stat-value">-</div>
          <div className="stat-subtext">Unlock by practicing</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-stats-grid">
      <div className="stat-card">
        <div className="stat-label"><FiActivity /> Quizzes Completed</div>
        <div className="stat-value">{stats.totalQuizzes || 0}</div>
        <div className="stat-subtext">Keep it up!</div>
      </div>
      <div className="stat-card">
        <div className="stat-label"><FiTarget /> Accuracy</div>
        <div className="stat-value">{stats.accuracy || 0}%</div>
        <div className="stat-subtext">Average performance</div>
      </div>
      <div className="stat-card">
        <div className="stat-label"><FiClock /> Avg Speed</div>
        <div className="stat-value">{stats.avgSpeed || 0}s</div>
        <div className="stat-subtext">Per question</div>
      </div>
      <div className="stat-card">
        <div className="stat-label"><FiTrendingUp /> Strongest Area</div>
        <div className="stat-value" style={{ fontSize: "1.2rem" }}>{stats.strongestArea || "N/A"}</div>
        <div className="stat-subtext">Based on accuracy</div>
      </div>
    </div>
  );
};

export default QuickStats;
