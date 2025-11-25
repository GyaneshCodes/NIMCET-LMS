import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Dashboard/Navbar.jsx";
import QuickStats from "../components/Dashboard/QuickStats.jsx";
import ActionItems from "../components/Dashboard/ActionItems.jsx";
import ProgressSection from "../components/Dashboard/ProgressSection.jsx";
import AchievementsSection from "../components/Dashboard/AchievementsSection.jsx";
import PracticeZones from "../components/Dashboard/PracticeZones.jsx";
import QuizConfig from "../components/QuizConfig/QuizConfig.jsx";
import QuizInterface from "../components/Quiz/QuizInterface.jsx";
import QuizResults from "../components/QuizResults/QuizResults.jsx";
import QuizReview from "../components/Quiz/QuizReview.jsx";
import { useAuth } from "../context/AuthContext";
import "./DashboardRebuild.css";
import "../components/Dashboard/TopicSelection.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizSettings, setQuizSettings] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user stats to determine beginner state
  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`/api/v1/analytics/user/${currentUser._id}`);
        const data = await response.json();
        if (data.success) {
          setUserStats(data.data.overall);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [currentUser]);

  // Handle routing for practice topics
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subject = params.get("subject");
    if (subject) {
      handleLaunchQuiz(subject);
    }
  }, [location.search]);

  const handleLaunchQuiz = async (subject) => {
    setSelectedSubject(subject);
    setLoadingTopics(true);
    try {
      const response = await fetch(`/api/v1/topics/subject/${subject}`);
      const data = await response.json();
      if (data.success) {
        setAvailableTopics(data.data);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleTopicSelect = (topic) => {
    setQuizConfig({ topic });
    setSelectedSubject(null);
    navigate("/dashboard", { replace: true });
  };

  const handleCloseConfig = () => {
    setQuizConfig(null);
  };

  const handleStartQuiz = (settings) => {
    setQuizConfig(null);
    setQuizSettings(settings);
    setQuizResults(null);
    setIsReviewing(false);
  };

  const handleExitQuiz = () => {
    setQuizSettings(null);
  };

  const handleQuizComplete = (results) => {
    setQuizSettings(null);
    setQuizResults(results);
    // Refresh stats after quiz
    // In a real app, we'd refetch or update context
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleMoreQuestions = () => {
    setQuizResults(null);
    setIsReviewing(false);
  };

  // Determine if user is a beginner (no quizzes taken)
  const isBeginner = !userStats || userStats.totalQuestionsAttempted === 0;

  // Quiz Interface Views
  if (quizSettings) {
    return <QuizInterface settings={quizSettings} onExit={handleExitQuiz} onComplete={handleQuizComplete} />;
  }

  if (isReviewing && quizResults) {
    return <QuizReview questions={quizResults.questions} userAnswers={quizResults.userAnswers} onExit={() => setIsReviewing(false)} />;
  }

  if (quizResults) {
    return <QuizResults {...quizResults} onReview={handleReview} onMoreQuestions={handleMoreQuestions} />;
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {currentUser?.fullName?.split(" ")[0] || "Student"}!</h1>
          <p>{isBeginner ? "Ready to start your learning journey?" : "Keep up the momentum! You're doing great."}</p>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={{
          totalQuizzes: userStats?.totalQuizzes || 0, // Assuming backend provides this or we derive it
          accuracy: userStats?.overallAccuracy ? parseFloat(userStats.overallAccuracy).toFixed(1) : 0,
          avgSpeed: userStats?.averageTimePerQuestion ? parseFloat(userStats.averageTimePerQuestion).toFixed(1) : 0,
          strongestArea: "Calculating..." // Placeholder until backend provides this specific metric
        }} isBeginner={isBeginner} />

        {/* Action Items */}
        <ActionItems 
          isBeginner={isBeginner} 
          onStartQuiz={() => handleLaunchQuiz("Mathematics")} // Default to Math for "Start Quiz"
          onReview={() => navigate("/analytics")} // Redirect to analytics for review for now
        />

        {/* Progress & Achievements Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
          <ProgressSection progress={{}} isBeginner={isBeginner} />
          <AchievementsSection isBeginner={isBeginner} />
        </div>

        {/* Practice Zones */}
        <PracticeZones onSelectSubject={handleLaunchQuiz} />
      </div>

      {/* Topic Selection Modal */}
      {selectedSubject && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Select a Topic in {selectedSubject}</h2>
              <button onClick={() => {
                setSelectedSubject(null);
                navigate("/dashboard", { replace: true });
              }} className="close-button">×</button>
            </div>
            <div className="topic-list">
              {loadingTopics ? (
                <div>Loading topics...</div>
              ) : availableTopics.length > 0 ? (
                availableTopics.map((topic) => (
                  <div 
                    key={topic._id} 
                    className="topic-item"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    <h3>{topic.topicName}</h3>
                    <p>{topic.description}</p>
                  </div>
                ))
              ) : (
                <div>No topics found for this subject.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {quizConfig && (
        <QuizConfig
          topic={quizConfig.topic.topicName}
          onClose={handleCloseConfig}
          onStartQuiz={(settings) => handleStartQuiz({ ...settings, topic: quizConfig.topic })}
        />
      )}
    </div>
  );
};

export default Dashboard;
