import React from "react";
import "./CardWithLink.scss";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CardWithLink = ({ to, label, icon, color }) => {
  const cardStyle = {
    borderColor: color || "default-color", // Provide a default color if not specified.
  };

  return (
    <div>
      <Link
        to={to}
        className={`d-flex flex-column justify-content-center align-items-center position-relative custom-card human-resources ${
          color ? "custom-color" : ""
        }`}
        style={cardStyle}
      >
        <div className="d-flex flex-column align justify-content-center align-items-center">
          <div className="overlay" />
          <div className="circle ">
            <div className="icon">{icon}</div>
          </div>
        </div>
        <p>{label}</p>
      </Link>
    </div>
  );
};

export default CardWithLink;
