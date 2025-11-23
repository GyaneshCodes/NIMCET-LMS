import React from "react";
import {
  FaTrophy,
  FaLightbulb,
  FaLaptopCode,
  FaLanguage,
  FaStar,
} from "react-icons/fa";

const AchievementsSection = () => {
  const badges = [
    {
      id: "first-quiz",
      icon: <FaTrophy />,
      label: "First Quiz Completed",
      color: "#a78bfa",
      borderColor: "#4c1d95",
    },
    {
      id: "logical-master",
      icon: <FaLightbulb />,
      label: "Logical Master",
      color: "#22d3ee",
      borderColor: "#164e63",
    },
    {
      id: "computer-pro",
      icon: <FaLaptopCode />,
      label: "Computer Pro",
      color: "#c084fc",
      borderColor: "#4c1d95",
    },
    {
      id: "vocabulary-champ",
      icon: <FaLanguage />,
      label: "Vocabulary Champ",
      color: "#fbbf24",
      borderColor: "#78350f",
    },
    {
      id: "consistency-star",
      icon: <FaStar />,
      label: "Consistency Star",
      color: "#34d399",
      borderColor: "#065f46",
    },
  ];

  return (
    <div className="achievements-section">
      <h2>Star Chart Discoveries</h2>
      <div className="badges-container">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="badge"
            style={{
              "--border-color": badge.borderColor,
              "--icon-color": badge.color,
            }}
          >
            <div className="badge-icon">{badge.icon}</div>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
