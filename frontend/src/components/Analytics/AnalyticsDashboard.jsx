import React, { useState, useEffect } from "react";
import "./AnalyticsDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Skeleton from "../Common/Skeleton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboard = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overview"); // overview, topics
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/v1/analytics/user/${userId}`);
        const data = await response.json();
        if (data.success) {
          setAnalyticsData(data.data);
        } else {
          toast.error("Failed to load analytics data");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-content">
           <div className="view-selector">
             <Skeleton width="100px" height="40px" borderRadius="8px" />
             <Skeleton width="120px" height="40px" borderRadius="8px" />
           </div>
           <div className="analytics-grid">
             {[1, 2, 3].map((i) => (
               <div key={i} className="analytics-card">
                 <Skeleton width="60%" height="20px" style={{ marginBottom: "16px" }} />
                 <Skeleton width="40%" height="40px" style={{ marginBottom: "8px" }} />
                 <Skeleton width="30%" height="16px" />
               </div>
             ))}
             <div className="analytics-card wide">
                <Skeleton width="40%" height="20px" style={{ marginBottom: "16px" }} />
                <Skeleton width="100%" height="300px" />
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
     return (
       <div className="analytics-container">
         <div className="analytics-content" style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>No Data Available</h2>
            <p style={{ color: "#888", marginBottom: "24px" }}>It looks like you haven't taken any quizzes yet.</p>
            <button 
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#22d3ee",
                color: "#0f0f0f",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Start Your First Quiz
            </button>
         </div>
       </div>
     );
  }

  const { overall, topicWise } = analyticsData;
  const { overallAccuracy, totalQuestionsAttempted, averageTimePerQuestion } = overall || {};
  const topicPerformance = topicWise || [];

  // Check if user has any attempts
  if (totalQuestionsAttempted === 0) {
      return (
       <div className="analytics-container">
         <div className="analytics-content" style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Welcome to Analytics!</h2>
            <p style={{ color: "#888", marginBottom: "24px" }}>Start practicing to see your performance stats here.</p>
            <button 
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#22d3ee",
                color: "#0f0f0f",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Go to Dashboard
            </button>
         </div>
       </div>
     );
  }

  // Prepare data for charts
  const topicChartData = topicPerformance.map(topic => ({
    name: topic.topicName,
    accuracy: parseFloat(topic.accuracy),
    questions: topic.totalQuestionsAttempted
  }));

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        <div className="view-selector">
          <div 
            className={`view-option ${view === "overview" ? "active" : ""}`}
            onClick={() => setView("overview")}
          >
            Overview
          </div>
          <div 
            className={`view-option ${view === "topics" ? "active" : ""}`}
            onClick={() => setView("topics")}
          >
            Topic Analysis
          </div>
        </div>

        {view === "overview" && (
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Overall Accuracy</h3>
              <div className="card-value">{parseFloat(overallAccuracy).toFixed(1)}%</div>
              <div className="card-trend positive">Based on all attempts</div>
            </div>
            <div className="analytics-card">
              <h3>Total Questions</h3>
              <div className="card-value">{totalQuestionsAttempted}</div>
              <div className="card-trend">Questions answered</div>
            </div>
            <div className="analytics-card">
              <h3>Avg. Time / Question</h3>
              <div className="card-value">{parseFloat(averageTimePerQuestion).toFixed(1)}s</div>
              <div className="card-trend">Speed metric</div>
            </div>
            
            <div className="analytics-card wide">
              <h3>Performance by Topic</h3>
              <div className="chart-placeholder" style={{ height: "300px", background: "transparent" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="accuracy" fill="#22d3ee" name="Accuracy (%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {view === "topics" && (
          <div className="analytics-grid">
            {topicPerformance.map((topic, index) => (
              <div key={index} className="analytics-card">
                <h3>{topic.topicName}</h3>
                <div className="card-value">{parseFloat(topic.accuracy).toFixed(1)}%</div>
                <div className="card-trend">
                  {topic.totalQuestionsAttempted} questions attempted
                </div>
                <div style={{ marginTop: "16px", height: "150px" }}>
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Correct", value: topic.correctAnswers },
                            { name: "Incorrect", value: topic.totalQuestionsAttempted - topic.correctAnswers }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill="#10b981" />
                          <Cell key="cell-1" fill="#ef4444" />
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                           itemStyle={{ color: "#fff" }}
                        />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
