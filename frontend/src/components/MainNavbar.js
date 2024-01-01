import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from "react-router-dom";



const expandVariant = 'md'; 
const MainNavbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";
    return (
        <>
          {[expandVariant].map((expand) => (
            <Navbar key={expand} expand={expand}   style={{ borderRadius: "10px" }}  className="bg-body-tertiary mb-3">
              <Container fluid>
                <Navbar.Brand href="#">SyndiCasa</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                  id={`offcanvasNavbar-expand-${expand}`}
                  aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>SyndiCasa</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/auth/login" active={!isLoginPage}>
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                         Login
                      </Nav.Link>
                      <Nav.Link href="/auth/register" active={isLoginPage}>
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                       Register
                      </Nav.Link>
                    </Nav>
                  </Offcanvas.Body>
                </Navbar.Offcanvas>
              </Container>
            </Navbar>
          ))}
        </>
      );
};

export default MainNavbar;