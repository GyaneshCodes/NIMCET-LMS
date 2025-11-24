import React, { useState, useEffect } from "react";
import Navbar from "../components/Dashboard/Navbar";
import AnalyticsDashboard from "../components/Analytics/AnalyticsDashboard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Analytics = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/auth/users/current-user");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Please login to view analytics");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#0f0f0f", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: "#fff" 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="analytics-page" style={{ backgroundColor: "#0f0f0f", minHeight: "100vh" }}>
      <Navbar />
      {user && <AnalyticsDashboard userId={user._id} />}
    </div>
  );
};

export default Analytics;
