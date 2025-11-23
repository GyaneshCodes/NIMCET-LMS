import React, { useState } from "react";
import "./QuizConfig.css";

const QuizConfig = ({ topic, onClose, onStartQuiz }) => {
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);

  const handleStart = () => {
    onStartQuiz({ topic, difficulty, questionCount: numQuestions });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Configure Your Quiz: {topic}</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        <div className="divider"></div>
        <div className="difficulty-selector">
          <label>Select Difficulty</label>
          <div className="options">
            <button
              className={`difficulty-button ${
                difficulty === "easy" ? "active" : ""
              }`}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </button>
            <button
              className={`difficulty-button ${
                difficulty === "medium" ? "active" : ""
              }`}
              onClick={() => setDifficulty("medium")}
            >
              Medium
            </button>
            <button
              className={`difficulty-button ${
                difficulty === "hard" ? "active" : ""
              }`}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </button>
          </div>
        </div>
        <div className="question-count-selector">
          <label htmlFor="question-count">Number of Questions</label>
          <select
            id="question-count"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          >
            <option value="5">5 Questions</option>
            <option value="10">10 Questions</option>
            <option value="15">15 Questions</option>
            <option value="20">20 Questions</option>
            <option value="25">25 Questions</option>
            <option value="30">30 Questions</option>
          </select>
        </div>
        <button className="submit-button" onClick={handleStart}>
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default QuizConfig;
