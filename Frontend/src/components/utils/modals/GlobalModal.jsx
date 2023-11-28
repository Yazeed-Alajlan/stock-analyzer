import React from "react";
import { Modal as BootstrapModal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import IconButton from "../buttons/IconButton";

const GlobalModal = ({
  children,
  title,
  footerContent,
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <BootstrapModal
      show={isModalOpen}
      onHide={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
      centered
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <BootstrapModal.Header className="border-bottom-4">
          <BootstrapModal.Title>{title}</BootstrapModal.Title>
          <IconButton
            onClick={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
            icon={TbX}
          />
        </BootstrapModal.Header>
        <BootstrapModal.Body>{children}</BootstrapModal.Body>
        {footerContent && (
          <BootstrapModal.Footer>{footerContent}</BootstrapModal.Footer>
        )}
      </motion.div>
    </BootstrapModal>
  );
};

export default GlobalModal;
