import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
} from "react-bootstrap";
import CustomSidebar from "./CustomSidebar";
import { useState } from "react";

export const Header = ({ sideBar, setSideBar }) => {
  return (
    <div className="bg-white p-4 w-100">
      <Container fluid>
        <Navbar expand="lg" className="">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              LOGO
              {/* <img
                src=""
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              /> */}
            </Navbar.Brand>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
            >
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/companies/all">
                Companies
              </Nav.Link>
              <Nav.Link as={Link} to="/market-summary">
                Market Summary
              </Nav.Link>
              {/* 
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown> 
              */}
            </Nav>
            <button
              onClick={() => {
                setSideBar(!sideBar);
              }}
            >
              SideBar
            </button>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Container>
        </Navbar>
      </Container>
    </div>
  );
};
