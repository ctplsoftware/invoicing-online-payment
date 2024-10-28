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
        <>
            <Navbar variant="dark" expand="lg" className="navbar shadow-sm" style={{ backgroundColor: '#054982', padding: '10px 20px', position: 'relative' }}>
                <Container fluid>
                    {/* Hamburger menu button */}
                    <FontAwesomeIcon 
                        icon={faBars} 
                        className="menubtn" 
                        style={{ color: '#fff', fontSize: '1.8rem', cursor: 'pointer' }} 
                        onClick={toggleSubmenu} // Trigger submenu toggle
                    />
                    <h4 style={{ fontWeight: '600' }}>
                        <Link to='/landingpage' className="text-decoration-none" style={{ color: '#ffffff' }}>
                            Codentrix - Application
                        </Link>
                    </h4>

                    {/* User Profile Dropdown */}
                    <div className="profile d-flex align-items-center" style={{zIndex: '1000'}}>
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
            </Navbar>

            {/* Submenu displayed below the navbar */}
            {showSubmenu && (
                <div className="submenu shadow-sm" style={{ backgroundColor: '#cfe8ff', color:'#000',padding: '10px 0', position: 'absolute', top: '7.5%', width: '100%', zIndex: '100' }}>
                    <Nav className="mx-auto d-flex justify-content-left">
                        {['Home', 'Dashboard', 'Masters', 'Title4', 'Title5', 'Title6', 'Configuration'].map((title, index) => (
                            <NavDropdown
                                key={index}
                                title={<span className="nav-dropdown-title">{title}</span>}
                                id={`submenu-nav-dropdown-${index}`}
                                className="mx-2"
                                style={{ color: '#ffffff' }}
                            >
                                <NavDropdown.Item href="#action/3.1">Action 1</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Action 2</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Action 3</NavDropdown.Item>
                            </NavDropdown>
                        ))}
                    </Nav>
                </div>
            )}
        </>
    );
};

export default Navbar1;
