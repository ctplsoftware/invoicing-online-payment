import React, { useState, useEffect} from 'react';
import '../Styles/Loginpage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import appImage from '../Assets/login-dummy.jpg';
import appLogo from '../Assets/logo.webp';
import { fetchAndStorePermissions } from './Permissions/PermissionsProvider';
const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [l_username, setL_username] = useState("");
    const [l_password, setL_password] = useState("");
    const [fpUsername, setFpUsername] = useState("");
    const [fpNewPassword, setFpNewPassword] = useState("");


    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        // Check if the token exists and is not expired
        if (accessToken) {
            const decodedToken = JSON.parse(atob(accessToken.split('.')[1])); // Decode JWT
            const currentTime = Date.now() / 1000; // Current time in seconds
            if (decodedToken.exp > currentTime) {
                navigate("/landingpage"); // Redirect to landing page if authenticated
            }
        }
    }, [navigate]);

    const login = async (e) => {
        e.preventDefault();
        const data = { username: l_username, password: l_password };
    
        try {
            const res = await axios.post("http://localhost:8000/login/", data);
    
            // Store tokens and user details
            localStorage.setItem("accessToken", res.data.access);
            localStorage.setItem("refreshToken", res.data.refresh);
            localStorage.setItem("userDetails", JSON.stringify(res.data));
    
            // Fetch and store permissions
            await fetchAndStorePermissions();
    
            // Navigate to the landing page
            navigate("/landingpage");
        } catch (error) {
            alert("Invalid Username or Password!!!");
        }
    };

    const forgotPassword = (e) => {
        e.preventDefault();
        const data = { username: fpUsername, new_password: fpNewPassword };
        axios.post("http://localhost:8000/forgot_password/", data)
            .then(() => {
                alert("Password updated successfully!");
                setIsLogin(true);
            })
            .catch(() => {
                alert("User not found or error updating password!");
            });
    };

    return (
        <div className="login-page-container">
            <div className="left-side">
                <img src={appImage} alt="Application" />
            </div>
            <div className="right-side">
                <div className="loginpage">
                    <div className="title-text">
                        <img src={appLogo} alt="Application" style={{ width: '70%' }} />
                    </div>
                    <div className="form-container">
                        {isLogin ? (
                            <div>
                                <h2>Login</h2>
                                <form onSubmit={login}>
                                    <div className="field">
                                        <input type="text" placeholder="Enter Username" required value={l_username} onChange={(e) => setL_username(e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <input type="password" placeholder="Enter Password" required value={l_password} onChange={(e) => setL_password(e.target.value)} />
                                    </div>
                                    <div className="pass-link" style={{ textAlign: 'center' }}>
                                        <a href="#" onClick={() => setIsLogin(false)}>Forgot password?</a>
                                    </div>
                                    <div className="field btn">
                                        <button className='btn-save'>Login</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <h2>Forgot Password</h2>
                                <form onSubmit={forgotPassword}>
                                    <div className="field">
                                        <input type="text" placeholder="Enter Username" required value={fpUsername} onChange={(e) => setFpUsername(e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <input type="password" placeholder="Enter New Password" required value={fpNewPassword} onChange={(e) => setFpNewPassword(e.target.value)} />
                                    </div>
                                    <div className="pass-link" style={{ textAlign: 'center' }}>
                                        <a href="#" onClick={() => setIsLogin(true)}>Back to Login</a>
                                    </div>
                                    <div className="field btn">
                                        <button className='btn-save'>Update Password</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
