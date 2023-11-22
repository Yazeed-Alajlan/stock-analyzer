import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

const CustomButton = ({
  className,
  onClick,
  text,
  variant,
  type,
  size,
  icon: Icon,
}) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={`p-2 px-4 ${className}`}
        onClick={onClick}
        variant={variant}
        type={type}
        size={size}
      >
        {Icon && <Icon className="me-1" />} {/* Render the icon if available */}
        {text}
      </Button>
    </motion.div>
  );
};

export default CustomButton;
