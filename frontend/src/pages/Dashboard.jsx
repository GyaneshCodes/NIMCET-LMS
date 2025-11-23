import React, { useState, useEffect } from "react";
import Navbar from "../components/Dashboard/Navbar.jsx";
import WelcomeBanner from "../components/Dashboard/WelcomeBanner.jsx";
import AchievementsSection from "../components/Dashboard/AchievementsSection.jsx";
import ModuleGrid from "../components/Dashboard/ModuleGrid.jsx";
import ExploreButton from "../components/Dashboard/ExploreButton.jsx";
import QuizConfig from "../components/QuizConfig/QuizConfig.jsx";
import "./Dashboard.css";
import "../components/Dashboard/TopicSelection.css";

import QuizInterface from "../components/Quiz/QuizInterface.jsx";
import QuizResults from "../components/QuizResults/QuizResults.jsx";
import QuizReview from "../components/Quiz/QuizReview.jsx";

const Dashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizSettings, setQuizSettings] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);

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
    setSelectedSubject(null); // Close subject selection
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
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleExitReview = () => {
    setIsReviewing(false);
    // Optionally keep results open or go back to dashboard
    // For now, let's go back to results page? Or dashboard?
    // Usually review closes back to results or dashboard. 
    // Let's close to dashboard for now as per "Finish Review" button text implies done.
    // Or better, toggle isReviewing false to go back to Results page?
    // The user flow usually is Results -> Review -> Results (or Dashboard).
    // Let's make "Finish Review" go back to Results.
  };

  const handleMoreQuestions = () => {
    setQuizResults(null);
    setIsReviewing(false);
  };

  if (quizSettings) {
    return (
      <QuizInterface
        settings={quizSettings}
        onExit={handleExitQuiz}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (isReviewing && quizResults) {
      return (
          <QuizReview 
            questions={quizResults.questions}
            userAnswers={quizResults.userAnswers}
            onExit={() => setIsReviewing(false)}
          />
      );
  }

  if (quizResults) {
    return (
      <QuizResults
        {...quizResults}
        onReview={handleReview}
        onMoreQuestions={handleMoreQuestions}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <WelcomeBanner />
      <AchievementsSection />
      <ModuleGrid onLaunchQuiz={handleLaunchQuiz} />
      <ExploreButton />
      
      {/* Topic Selection Modal */}
      {selectedSubject && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Select a Topic in {selectedSubject}</h2>
              <button onClick={() => setSelectedSubject(null)} className="close-button">×</button>
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
