import React from "react";
import "./Card.scss";
import { FaRegIdBadge } from "react-icons/fa";

const Card2 = () => {
  return (
    <div>
      <a
        href="#"
        className="d-flex flex-column justify-content-center align-items-center custom-card human-resources"
      >
        <div className="overlay" />
        <div className="circle">
          <FaRegIdBadge />
        </div>
        <p>Human Resources</p>
      </a>
    </div>
  );
};

export default Card2;
