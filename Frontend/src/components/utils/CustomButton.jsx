import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

const CustomButton = ({ className, onClick, title, variant, type }) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={"p-2" + className}
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
