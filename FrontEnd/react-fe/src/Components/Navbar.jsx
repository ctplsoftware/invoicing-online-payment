import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";

import "../Styles/Navbar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Navbar1 = ({ title }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const submenuRef = useRef(null);
  const navbarRef = useRef(null);
  const data = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  // Close submenu only if clicked outside navbar or submenu
  const handleClickOutside = (event) => {
    if (
      submenuRef.current &&
      navbarRef.current &&
      !submenuRef.current.contains(event.target) &&
      !navbarRef.current.contains(event.target)
    ) {
      setShowSubmenu(false);
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={navbarRef}>
      <Navbar
        variant="dark"
        expand="lg"
        className="navbar shadow-sm"
        style={{ backgroundColor: "#054982", padding: "10px 20px" }}
      >
        <Container fluid>
          {/* Hover to open submenu */}
          <FontAwesomeIcon
            icon={faBars}
            className="menubtn"
            style={{ color: "#fff", fontSize: "1.8rem", cursor: "pointer" }}
            onMouseEnter={() => setShowSubmenu(true)} // Show submenu on hover
          />
          <h4 style={{ fontWeight: "600" }}>
            <Link
              to="/landingpage"
              className="text-decoration-none"
              style={{ color: "#ffffff" }}
            >
              {title}
            </Link>
          </h4>

          <div
            className="profile d-flex align-items-center"
            style={{ zIndex: "1000" }}
          >
            <NavDropdown
              title={
                <FontAwesomeIcon
                  icon={faUserCog}
                  style={{ color: "#ffffff", fontSize: "1.8rem" }}
                />
              }
              id="profile-dropdown"
              align="end"
              className="custom-dropdown"
            >
              <NavDropdown.ItemText>
                <p
                  className="mb-0"
                  style={{ fontSize: "0.9rem", color: "#333" }}
                >
                  <strong>Username:</strong> {data.user.username}
                </p>
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={handleLogout}
                style={{ color: "#FF6B6B", fontWeight: "500" }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>

      {/* Submenu with hover logic */}
      <div
        ref={submenuRef}
        className={`submenu shadow-sm ${showSubmenu ? "visible" : "hidden"}`}
        style={{
          backgroundColor: "#cfe8ff",
          color: "#000",
          padding: "10px 0",
          position: "absolute",
          width: "100%",
          zIndex: "100",
          top: "50px",
          transition: "opacity 0.3s ease, top 0.3s ease",
          opacity: showSubmenu ? 1 : 0,
        }}
        onMouseEnter={() => setShowSubmenu(true)} // Keep submenu open on hover
        onMouseLeave={() => setShowSubmenu(false)} // Close submenu when leaving
      >
        <Nav
          className="d-flex "
          style={{ marginLeft: "3%", paddingRight: "3%" }}
        >
          {["Masters", "Process", "Reports", "User Management"].map(
            (title, index) => (
              <NavDropdown
                key={index}
                title={<span className="nav-dropdown-title">{title}</span>}
                id={`submenu-nav-dropdown-${index}`}
                className="custom-nav-dropdown mx-2"
                style={{ marginTop: "-8px" }} // Inline style for positioning
                show={activeDropdown === index}
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {title === "Masters" ? (
                  <>
                    <NavDropdown.Item href="/landingpage/customermasterdashboard">
                      Customer Master{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/landingpage/partmaster-fecthList">
                      Part Master{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/landingpage/locationmasterlist">
                      Location Master{" "}
                    </NavDropdown.Item>
                  </>
                ) : title === "User Management" ? (
                  <NavDropdown.Item href="/landingpage/usercreate">
                    User
                  </NavDropdown.Item>
                ) : title === "Process" ? (
                  <>
                    <NavDropdown.Item href="/landingpage/inwardtransactionlist">
                      Inward Process{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/landingpage/einvoice-list">
                      E-Invoice List Process{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/landingpage/payment-list">
                      Payment List Process{" "}
                    </NavDropdown.Item>
                    
                  </>
                ) : (
                  <>
                  <NavDropdown.Item href="/landingpage/stockreport">
                    Stock Report{" "}
                  </NavDropdown.Item>

                  <NavDropdown.Item href="/landingpage/order-reports">
                  Order Report{" "}
                  </NavDropdown.Item>

                  <NavDropdown.Item href="/landingpage/einvoice-reports">
                  E-Invoice Report{" "}
                  </NavDropdown.Item>


                  </>

                  
                )}
              </NavDropdown>
            )
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Navbar1;
