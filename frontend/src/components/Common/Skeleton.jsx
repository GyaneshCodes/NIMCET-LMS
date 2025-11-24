import React from "react";
import "./Skeleton.css";

const Skeleton = ({ width, height, borderRadius, style, className }) => {
  const skeletonStyle = {
    width: width || "100%",
    height: height || "100%",
    borderRadius: borderRadius || "4px",
    ...style,
  };

  return (
    <div 
      className={`skeleton-loader ${className || ""}`} 
      style={skeletonStyle}
    />
  );
};

export default Skeleton;
