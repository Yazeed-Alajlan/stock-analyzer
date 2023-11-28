import { useState } from "react";
import { motion } from "framer-motion";

import "./CardFlip.scss";
const CardFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFlip() {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }
  return (
    <div
      className="d-flex align-items-center justify-content-center "
      style={{ height: "100px", width: "100px", cursor: "pointer" }}
    >
      <div className=" w-100 h-100" onClick={handleFlip}>
        <motion.div
          className="flip-card-inner w-100 h-100"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 360 }}
          transition={{ duration: 0.6, animationDirection: "normal" }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="flip-card-front ">
            <p className="">Sky</p>
            <p>Live on top of the world</p>
          </div>

          <div className="flip-card-back ">
            <p className=" font-bold">Earth</p>
            <p>Or in the maze of the city</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardFlip;
