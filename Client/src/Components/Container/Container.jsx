import React from "react";
import PropTypes from "prop-types";

const Container = ({ children, className, maxWidth, padding }) => {
  const containerClasses = `w-full mx-auto px-4 ${className || ""}`;
  const containerStyle = {
    maxWidth: maxWidth || "7xl",
    padding: padding || "4",
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.string,
  padding: PropTypes.string,
};

export default Container;
