import React, { useState } from "react";
import "./QuizInterface.css"; // Reuse basic styles
import "./QuizReview.css"; // Add specific review styles
import { FaCheckCircle, FaTimesCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const QuizReview = ({ questions, userAnswers, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const userAnswerData = userAnswers.find(a => a.questionId === currentQuestion._id);
  
  // If we don't have answer data (e.g. skipped), handle gracefully
  const userAnswer = userAnswerData ? userAnswerData.userAnswer : null;
  const isCorrect = userAnswerData ? userAnswerData.isCorrect : false;
  const correctAnswer = userAnswerData ? userAnswerData.correctAnswer : null; // This might be null if we answered correctly? 
  // Actually, backend only sends correctAnswer if wrong. 
  // But for review, we need to know the correct answer to highlight it.
  // If isCorrect is true, then userAnswer IS the correct answer.
  
  const effectiveCorrectAnswer = isCorrect ? userAnswer : correctAnswer;
  const explanation = userAnswerData ? userAnswerData.explanation : "";

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getOptionState = (optionId) => {
    if (optionId === effectiveCorrectAnswer) return "review-correct";
    if (optionId === userAnswer && !isCorrect) return "review-incorrect";
    return "default";
  };

  return (
    <div className="quiz-container review-mode">
      <div className="quiz-header">
        <div className="progress-text">
          Reviewing Question {currentIndex + 1}/{questions.length}
        </div>
        <button onClick={onExit} className="quiz-close-button">
          ×
        </button>
      </div>

      <div className="question-card">
        <div className="question-text">
          <span className="question-number">{currentIndex + 1}.</span>
          {currentQuestion.questionText}
        </div>
      </div>

      <div className="answer-options">
        {currentQuestion.options.map((option) => {
          const state = getOptionState(option.value);
          return (
            <div
              key={option.value}
              className={`answer-option ${state}`}
            >
              <div className="option-content">
                <span className="option-label">{option.value}</span>
                <span className="option-value">{option.text}</span>
                {state === "review-correct" && (
                  <FaCheckCircle className="option-icon correct" />
                )}
                {state === "review-incorrect" && (
                  <FaTimesCircle className="option-icon incorrect" />
                )}
              </div>
              
              {state === "review-correct" && (
                  <div className="review-feedback correct">
                      <div className="feedback-label"><FaCheckCircle /> Right answer</div>
                      <div className="feedback-text">{explanation}</div>
                  </div>
              )}
              
              {state === "review-incorrect" && (
                  <div className="review-feedback incorrect">
                      <div className="feedback-label"><FaTimesCircle /> Not quite</div>
                      <div className="feedback-text">{explanation}</div>
                  </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="review-controls">
        <button 
            className="nav-button" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
        >
            <FaArrowLeft /> Previous
        </button>
        <button 
            className="nav-button next" 
            onClick={currentIndex === questions.length - 1 ? onExit : handleNext}
        >
            {currentIndex === questions.length - 1 ? "Finish Review" : "Next"} <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default QuizReview;
