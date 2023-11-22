import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CustomCard } from "./CustomCard";
import CustomButton from "./CustomButton";
import { TbArrowBackUp } from "react-icons/tb";

const CusotmModal = ({ modal, setModal, children }) => {
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden"; // Disable scrolling when the modal is open
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when the modal is closed
    }

    return () => {
      document.body.style.overflow = "auto"; // Enable scrolling when the component unmounts
    };
  }, [modal]);
  return (
    <AnimatePresence>
      {modal && (
        <>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -50,
              opacity: 0,
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="position-fixed w-75  rounded text-white top-50 start-50  translate-middle"
            style={{ zIndex: 10 }}
          >
            <CustomCard>
              <CustomButton
                icon={TbArrowBackUp}
                onClick={() => setModal((modal) => !modal)}
                variant={"danger"}
              />

              {children}
            </CustomCard>
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
            onClick={() => setModal((modal) => !modal)}
            className="bg-dark bg-opacity-50 position-fixed  h-100 w-100 top-0 start-0"
          />
        </>
      )}
    </AnimatePresence>
  );
};
export default CusotmModal;
