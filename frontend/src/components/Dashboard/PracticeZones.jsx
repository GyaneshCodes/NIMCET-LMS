import React from "react";
import { FiCode, FiCpu, FiBookOpen, FiActivity } from "react-icons/fi";

const PracticeZones = ({ onSelectSubject }) => {
  const zones = [
    { 
      name: "Mathematics", 
      icon: <FiActivity />, 
      desc: "Master Calculus, Vectors, and Set Theory.",
      color: "#8b5cf6"
    },
    { 
      name: "Computer Awareness", 
      icon: <FiCpu />, 
      desc: "Data Representation, Boolean Algebra, and more.",
      color: "#22d3ee"
    },
    { 
      name: "General English", 
      icon: <FiBookOpen />, 
      desc: "Improve your grammar, vocabulary, and comprehension.",
      color: "#f472b6"
    },
    { 
      name: "Quantitative/Logical", 
      icon: <FiCode />, 
      desc: "Sharpen your logical reasoning and problem solving.",
      color: "#fbbf24"
    }
  ];

  return (
    <div className="practice-zones-section">
      <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>Practice Zones</h2>
      <div className="practice-zones-grid">
        {zones.map((zone) => (
          <div 
            key={zone.name} 
            className="zone-card"
            onClick={() => onSelectSubject(zone.name)}
          >
            <div className="zone-icon" style={{ color: zone.color }}>{zone.icon}</div>
            <div className="zone-title">{zone.name}</div>
            <div className="zone-desc">{zone.desc}</div>
            <button className="zone-btn">Dive In</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeZones;
