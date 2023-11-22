import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CusotmModal = ({ modal, setModal, children }) => {
  // useEffect(() => {
  //   if (modal) {
  //     document.body.style.overflow = "hidden"; // Disable scrolling when the modal is open
  //   } else {
  //     document.body.style.overflow = "auto"; // Enable scrolling when the modal is closed
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto"; // Enable scrolling when the component unmounts
  //   };
  // }, [modal]);
  return (
    <AnimatePresence>
      {modal && (
        <>
          <div className="px-5 w-100 d-flex align-items-center justify-content-center ">
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
              className=" bg-white position-fixed bg-indigo-600  rounded text-white  bottom-50 start-50 translate-middle"
              style={{ zIndex: 10 }}
            >
              <div className="">
                {children}
                <button
                  onClick={() => setModal((modal) => !modal)}
                  className=" top-0 start-0 -mt-4 -mr-4 bg-white text-indigo-600 border border-indigo-600 h-8 w-8 block mb-2 rounded-full"
                >
                  &times;
                </button>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>
              </div>
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
              className="bg-dark bg-opacity-50 px-5 position-fixed  h-100 w-100 d-flex align-items-center justify-content-center top-0 start-0"
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CusotmModal;
