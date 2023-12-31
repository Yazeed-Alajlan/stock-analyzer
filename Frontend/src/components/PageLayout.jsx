import React from "react";
import { Container } from "react-bootstrap";

const PageLayout = ({ children, title, fullPage }) => {
  return fullPage ? (
    <div style={{ height: "100vh", width: "100vw" }}>{children}</div>
  ) : (
    <Container className="py-4">
      <h1 className="fs-3 text-primary fw-bold mb-4">{title}</h1>
      {children}
    </Container>
  );
};

export default PageLayout;

//
