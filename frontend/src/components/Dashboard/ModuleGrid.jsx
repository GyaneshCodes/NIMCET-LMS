import React from "react";
import {
  FaCalculator,
  FaBrain,
  FaDesktop,
  FaBook,
  FaRocket,
} from "react-icons/fa";

const ModuleGrid = ({ onLaunchQuiz }) => {
  const modules = [
    {
      id: "mathematics",
      title: "Mathematics",
      subtitle: "Probability & Statistics",
      progress: 75,
      icon: <FaCalculator />,
      color: "#a78bfa",
      borderColor: "#4c1d95",
      gradient:
        "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)",
    },
    {
      id: "analytical-ability",
      title: "Analytical Ability",
      subtitle: "Critical Thinking",
      progress: 60,
      icon: <FaBrain />,
      color: "#c084fc",
      borderColor: "#4c1d95",
      gradient:
        "linear-gradient(135deg, rgba(192, 132, 252, 0.1) 0%, transparent 100%)",
    },
    {
      id: "computer-awareness",
      title: "Computer Awareness",
      subtitle: "Networking & Computer Basics",
      progress: 30,
      icon: <FaDesktop />,
      color: "#22d3ee",
      borderColor: "#164e63",
      gradient:
        "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, transparent 100%)",
    },
    {
      id: "general-english",
      title: "General English",
      subtitle: "Grammar Essentials",
      progress: 10,
      icon: <FaBook />,
      color: "#fbbf24",
      borderColor: "#78350f",
      gradient:
        "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%)",
    },
  ];

  return (
    <div className="module-grid">
      {modules.map((module) => (
        <div
          key={module.id}
          className="module-card"
          style={{
            "--border-color": module.borderColor,
            "--icon-color": module.color,
            "--gradient": module.gradient,
          }}
        >
          <div className="module-icon">{module.icon}</div>
          <h3>{module.title}</h3>
          <p>{module.subtitle}</p>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
          <button
            className="launch-button"
            onClick={() => onLaunchQuiz(module.title)}
          >
            <FaRocket />
            Dive In
          </button>
        </div>
      ))}
    </div>
  );
};

export default ModuleGrid;
