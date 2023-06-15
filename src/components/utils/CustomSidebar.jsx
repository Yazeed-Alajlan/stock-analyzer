import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const CustomSidebar = ({ sideBar = false, setSideBar = () => {} }) => {
  return (
    <AnimatePresence>
      {sideBar && (
        <>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed-top bg-light text-dark shadow-lg p-5 "
            style={{ width: "20%", height: "100vh" }}
          >
            <button
              onClick={() => setSideBar((sideBar) => !sideBar)}
              className="bg-white text-black  mb-2 rounded-full"
            >
              &times;
            </button>
            <h2 className="text-4xl capitalize leading-loose">fgh!</h2>
            <p className="leading-relaxed">Lorem</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            onClick={() => setSideBar((sideBar) => !sideBar)}
            className="bg-transparent px-5 position-fixed  h-100 w-100 d-flex align-items-center justify-content-center top-0 start-0"
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomSidebar;
