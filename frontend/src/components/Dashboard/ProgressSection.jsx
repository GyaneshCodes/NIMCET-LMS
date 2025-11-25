import React from "react";

const ProgressSection = ({ progress, isBeginner }) => {
  const subjects = [
    { name: "Mathematics", key: "math" },
    { name: "Computer Awareness", key: "computer" },
    { name: "General English", key: "english" },
    { name: "Quantitative/Logical", key: "logic" }
  ];

  if (isBeginner) {
    return (
      <div className="progress-section">
        <div className="section-header">
          <h2 className="section-title">Your Progress</h2>
        </div>
        <div className="progress-grid">
          {subjects.map((sub) => (
            <div key={sub.key} className="subject-progress">
              <div className="progress-label">
                <span>{sub.name}</span>
                <span style={{ color: "var(--color-text-muted)" }}>Not started</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "0%" }}></div>
              </div>
              <small style={{ color: "var(--color-text-secondary)" }}>Your journey begins here!</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="progress-section">
      <div className="section-header">
        <h2 className="section-title">Subject Mastery</h2>
      </div>
      <div className="progress-grid">
        {subjects.map((sub) => {
          const percent = progress?.[sub.key] || 0;
          return (
            <div key={sub.key} className="subject-progress">
              <div className="progress-label">
                <span>{sub.name}</span>
                <span>{percent}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSection;
