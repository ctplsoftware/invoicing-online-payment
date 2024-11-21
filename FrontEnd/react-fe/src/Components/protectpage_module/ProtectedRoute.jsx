import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
    const accessToken = localStorage.getItem("accessToken");
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

    // Function to check if the token is expired
    const isTokenExpired = (token) => {
        try {
            if (!token) return true;
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
            const currentTime = Date.now() / 1000; // Current time in seconds
            return decodedToken.exp < currentTime; // Check if token is expired
        } catch (err) {
            console.error("Error decoding token:", err);
            return true; // Treat invalid tokens as expired
        }
    };

    // Fetch user data when the component loads, if token is valid
    useEffect(() => {
        const validateToken = async () => {
            if (!accessToken || isTokenExpired(accessToken)) {
                setIsAuthenticated(false);
                setIsLoading(false); // Stop loading if token is invalid
                return;
            }

            try {
                // Make an API request to validate the token
                const response = await axios.get("http://localhost:8000/user_data/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Set the Bearer token here
                    }
                });
                if (response.status === 200) {
                    setIsAuthenticated(true); // Mark as authenticated if the request is successful
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false); // Stop loading regardless of success or failure
            }
        };

        validateToken();
    }, [accessToken]);

    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Render the protected component
    return <Outlet />;
};

export default ProtectedRoute;
