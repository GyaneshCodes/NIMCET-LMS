import React from "react";

const AchievementsSection = ({ isBeginner }) => {
  const achievements = [
    { icon: "🚀", title: "First Steps", unlocked: !isBeginner },
    { icon: "🔥", title: "On Fire", unlocked: false },
    { icon: "🎯", title: "Sharpshooter", unlocked: false },
    { icon: "📚", title: "Scholar", unlocked: false },
    { icon: "⚡", title: "Speedster", unlocked: false },
  ];

  return (
    <div className="achievements-section">
      <h2 className="section-title" style={{ marginBottom: "1rem" }}>Achievements</h2>
      <div className="achievements-grid">
        {achievements.map((ach, index) => (
          <div 
            key={index} 
            className={`achievement-badge ${ach.unlocked ? "" : "locked"}`}
            title={ach.title}
          >
            {ach.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
