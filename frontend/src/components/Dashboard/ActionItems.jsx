import React from "react";
import { FiPlay, FiRotateCcw } from "react-icons/fi";

const ActionItems = ({ isBeginner, onStartQuiz, onReview }) => {
  if (isBeginner) {
    return (
      <div className="action-items-container">
        <button className="action-btn primary" onClick={onStartQuiz}>
          <h3><FiPlay /> Take Your First Quiz</h3>
          <p>Start your journey with a quick practice session.</p>
        </button>
        <button className="action-btn secondary" onClick={onStartQuiz}>
          <h3>Explore Subjects</h3>
          <p>Browse available topics and materials.</p>
        </button>
      </div>
    );
  }

  return (
    <div className="action-items-container">
      <button className="action-btn primary" onClick={onStartQuiz}>
        <h3><FiPlay /> Resume Practice</h3>
        <p>Jump back into your last practiced subject.</p>
      </button>
      <button className="action-btn secondary" onClick={onReview}>
        <h3><FiRotateCcw /> Review Mistakes</h3>
        <p>Go over incorrect answers from recent quizzes.</p>
      </button>
    </div>
  );
};

export default ActionItems;
