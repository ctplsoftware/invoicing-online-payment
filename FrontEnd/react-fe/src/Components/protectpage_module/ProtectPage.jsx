import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectPage = ({ Child }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");

        if (userDetails) {
            try {
                const parsedDetails = JSON.parse(userDetails);                
                setIsAuthenticated(!!parsedDetails.user); 
            } catch (error) {
                console.error("Failed to parse user details:", error);
            }
        }

        setLoading(false); 
    }, []);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    

    return <Child />;
};

export default ProtectPage;
