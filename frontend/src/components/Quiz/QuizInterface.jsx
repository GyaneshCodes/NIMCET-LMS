import React, { useState, useEffect, useRef } from "react";
import "./QuizInterface.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const QuizInterface = ({ settings, onExit, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({
    correct: 0,
    total: 0,
    timeTaken: 0,
  });
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question default
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/api/v1/questions/quiz/questions?topicId=${settings.topic._id}&limit=${settings.questionCount || 10}`,
          {
            credentials: 'include' // Send cookies with request
          }
        );
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
        } else {
          setError("Failed to load questions");
        }
      } catch (err) {
        setError("Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [settings.topic._id]);

  const [submitting, setSubmitting] = useState(false);

  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    if (isAnswered) {
      clearInterval(timerRef.current);
      return;
    }

    // Reset timer for new question
    const currentQ = questions[currentQuestionIndex];
    if (currentQ) {
        setTimeLeft(currentQ.timeLimit || 120);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex, questions, isAnswered]);

  const handleTimeUp = () => {
      if (!isAnswered) {
          setIsAnswered(true);
          // Record timeout answer
          setUserAnswers(prev => [...prev, {
              questionId: questions[currentQuestionIndex]._id,
              userAnswer: null,
              isCorrect: false,
              timeTaken: questions[currentQuestionIndex].timeLimit || 120,
              correctAnswer: null, // Will be populated if we had it, but backend handles logic
              explanation: "Time's up!"
          }]);
          
          setResults((prev) => ({
            ...prev,
            total: prev.total + 1,
            timeTaken: prev.timeTaken + (questions[currentQuestionIndex].timeLimit || 120),
          }));
      }
  };

  const handleAnswerSelect = async (optionId) => {
    if (isAnswered || submitting) return;
    setSubmitting(true);
    setSelectedAnswer(optionId);
    clearInterval(timerRef.current);

    const currentQuestion = questions[currentQuestionIndex];
    const timeTaken = (currentQuestion.timeLimit || 120) - timeLeft;

    // Submit answer to backend
    try {
      const response = await fetch("/api/v1/questions/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Send cookies
        body: JSON.stringify({
          questionId: currentQuestion._id,
          userAnswer: optionId,
          timeTaken: timeTaken,
        }),
      });
      const data = await response.json();

      if (data.success) {
        const { isCorrect, feedback } = data.data;
        
        // Store answer details for review (but don't show feedback yet)
        setUserAnswers(prev => [...prev, {
            questionId: currentQuestion._id,
            userAnswer: optionId,
            isCorrect: isCorrect,
            timeTaken: timeTaken,
            correctAnswer: feedback.correctAnswer, // Backend sends this if wrong, or we might need to ensure it sends it always or we infer it
            explanation: feedback.explanation
        }]);

        // Update local results
        setResults((prev) => ({
          ...prev,
          correct: prev.correct + (isCorrect ? 1 : 0),
          total: prev.total + 1,
          timeTaken: prev.timeTaken + timeTaken,
        }));
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setSubmitting(false);
      setIsAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback(null);
    } else {
      onComplete({ ...results, questions, userAnswers });
    }
  };

  const getOptionState = (optionId) => {
    if (isAnswered) {
      return selectedAnswer === optionId ? "selected" : "default";
    }
    return "default";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="quiz-loading">Loading questions...</div>;
  if (error) return <div className="quiz-error">{error}</div>;
  if (questions.length === 0) return <div className="quiz-error">No questions found for this topic.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress-section">
            <div className="progress-text">
            Question {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>
        </div>
        
        <div className={`timer ${timeLeft < 10 ? "warning" : ""}`}>
            <FaClock /> {formatTime(timeLeft)}
        </div>

        <button onClick={onExit} className="quiz-close-button">
          ×
        </button>
      </div>

      <div className="question-card">
        <div className="question-text">
          <span className="question-number">{currentQuestionIndex + 1}.</span>
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
              onClick={() => handleAnswerSelect(option.value)}
            >
              <div className="option-content">
                <span className="option-label">{option.value}</span>
                <span className="option-value">{option.text}</span>
                {state === "correct" && (
                  <FaCheckCircle className="option-icon correct" />
                )}
                {state === "incorrect" && (
                  <FaTimesCircle className="option-icon incorrect" />
                )}
              </div>
              {/* Explanation removed for quiz mode */}
            </div>
          );
        })}
      </div>

      {isAnswered && (
        <button className="next-button" onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      )}
    </div>
  );
};

export default QuizInterface;
