import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Navbar.css'; // Update this file with new styles

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Navbar1 = () => {
    const [showSubmenu, setShowSubmenu] = useState(false); // State to toggle submenu visibility
    const data = JSON.parse(localStorage.getItem("userDetails"));
    const navigate = useNavigate();

    function handleLogout() {
        navigate("/");
    }

    // Toggle submenu on hamburger icon click
    const toggleSubmenu = () => {
        setShowSubmenu(!showSubmenu);
    };

    return (
        <Navbar variant="dark" expand="lg" className="navbar shadow-sm" style={{ backgroundColor: '#0e5f83', padding: '10px 20px' }}>
            <Container fluid>
                <Navbar.Brand className="logo">
                    <h4 style={{ fontWeight: '600' }}>
                        <Link to='/landingpage' className="text-decoration-none" style={{ color: '#ffffff' }}>
                            Codentrix
                        </Link>
                    </h4>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example" className="border-0" onClick={toggleSubmenu}>
                    <FontAwesomeIcon icon={faBars} style={{ color: '#000', fontSize: '1.8rem' }} />
                </Navbar.Toggle>
                <Navbar.Collapse id="navbar-dark-example" style={{marginLeft:'-36%'}}>
                    <Nav className="mx-auto">
                        {['Home', 'Dashboard', 'Masters', 'Title4', 'Title5', 'Title6', 'Configuration'].map((title, index) => (
                            <NavDropdown
                                key={index}
                                title={title}
                                id={`nav-dropdown-dark-example-${index}`}
                                className="mx-2"
                                style={{ color: '#ffffff' }}
                            >
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            </NavDropdown>
                        ))}
                    </Nav>
                </Navbar.Collapse>
                <div className="profile d-flex align-items-center">
                    <NavDropdown
                        title={<ManageAccountsIcon style={{ color: '#ffffff', fontSize: '1.8rem' }} />}
                        id="profile-dropdown"
                        align="end"
                        className="custom-dropdown"
                    >
                        <NavDropdown.ItemText>
                            <p className="mb-0" style={{ fontSize: '0.9rem', color: '#333' }}>
                                <strong>Username:</strong> {data.user.username}
                            </p>
                        </NavDropdown.ItemText>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout} style={{ color: '#FF6B6B', fontWeight: '500' }}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </div>
            </Container>
            {/* Submenu below the header */}
            {showSubmenu && (
                <div className="submenu shadow-sm" style={{ backgroundColor: '#0e5f83', padding: '10px 0', position: 'absolute', top: '100%', width: '100%' }}>
                    <Nav className="mx-auto d-flex justify-content-center">
                        {['Home', 'Dashboard', 'Masters', 'Title4', 'Title5', 'Title6', 'Configuration'].map((title, index) => (
                            <NavDropdown
                                key={index}
                                title={title}
                                id={`submenu-nav-dropdown-${index}`}
                                className="mx-2"
                                style={{ color: '#ffffff' }}
                            >
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            </NavDropdown>
                        ))}
                    </Nav>
                </div>
            )}
        </Navbar>
    );
};

export default Navbar1;
