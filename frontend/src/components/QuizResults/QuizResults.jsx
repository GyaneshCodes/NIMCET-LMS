import React from "react";
import "./QuizResults.css";

const QuizResults = ({ correct, total, onReview, onMoreQuestions }) => {
  const accuracy =
    total > 0 ? ((correct / total) * 100).toFixed(0) : 0;
  const wrong = total - correct;

  return (
    <div className="results-container">
      <div className="completion-header">
        <h1>You did it! Quiz complete.</h1>
      </div>

      <div className="statistics-card">
        <div className="metric">
          <label>Score</label>
          <div className="value">
            {correct}/{total}
          </div>
        </div>
        <div className="metric">
          <label>Accuracy</label>
          <div className="value">{accuracy}%</div>
        </div>
        <div className="metric">
          <label>Right / Wrong / Skipped</label>
          <div className="value">
            {correct} / {wrong} / 0
          </div>
        </div>
      </div>

      <div className="analysis-card">
        <h2>Analyze my performance</h2>
        <p>Strengths and Growth Areas</p>
        <button className="analysis-button">Start Analysis</button>
      </div>

      <div className="action-buttons">
        <button onClick={onReview}>Review quiz</button>
        <button onClick={onMoreQuestions}>More questions</button>
      </div>
    </div>
  );
};

export default QuizResults;
