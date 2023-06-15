import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

const CustomButton = ({ className, onClick, title, variant, type }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button
        className={"p-2 " + className}
        onClick={onClick}
        variant={variant}
        type={type}
      >
        {title}
      </Button>
    </motion.div>
  );
};

export default CustomButton;
