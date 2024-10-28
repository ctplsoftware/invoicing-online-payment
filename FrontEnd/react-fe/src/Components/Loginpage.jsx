import React, { useState } from 'react';
import '../Styles/Loginpage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import appImage from '../Assets/login-dummy.jpg'; // Path to your image file
import appLogo from '../Assets/logo.webp'; // Path to your image file


const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [c_alert, setAlert] = useState({ message: "", type: "" });

    const [l_username, setL_username] = useState("");
    const [l_password, setL_password] = useState("");

    const signupLink = (e) => {
        e.preventDefault();
        setIsLogin(false);
    };

    const loginLink = (e) => {
        e.preventDefault();
        setIsLogin(true);
    };

    const signup = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            const data = { username, password };
            axios.post("http://localhost:8000/api/signup/", data)
                .then((res) => {
                    setAlert({ message: "Signup successful! Redirecting to login...", type: "success" });
                    setTimeout(() => {
                        setIsLogin(true);
                        setUsername("");
                        setPassword("");
                        setConfirmPassword("");
                        setAlert({ message: "", type: "" });
                    }, 2000);
                })
                .catch(() => {
                    setAlert({ message: "Couldn't save the data!", type: "error" });
                });
        } else {
            setAlert({ message: "Password Mismatch!", type: "error" });
        }
    };

    const login = (e) => {
        e.preventDefault();
        const data = { username: l_username, password: l_password };
        axios.post("http://localhost:8000/api/login/", data)
            .then((res) => {
                localStorage.setItem("userDetails", JSON.stringify(res.data));
                navigate("/landingpage");
            })
            .catch(() => {
                alert("Invalid Username or Password!!!");
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
                    <img src={appLogo} alt="Application" style={{width:'70%'}}/>
                    </div>
                    <div className="form-container">
                        <div className="slide-controls">
                            <input type="radio" name="slide" id="login" checked={isLogin} onChange={loginLink} />
                            <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={signupLink} />
                            <label htmlFor="login" className={`slide login ${isLogin ? 'active' : ''}`} onClick={loginLink}>Login</label>
                            <label htmlFor="signup" className={`slide signup ${!isLogin ? 'active' : ''}`} onClick={signupLink}>Signup</label>
                            <div className="slider-tab"></div>
                        </div>
                        <div className="form-inner">
                            {isLogin ? (
                                <form className="login" onSubmit={login}>
                                    <br />
                                    <div className="field">
                                        <input type="text" placeholder="Enter Username" required value={l_username} onChange={(e) => setL_username(e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <input type="password" placeholder="Enter Password" required value={l_password} onChange={(e) => setL_password(e.target.value)} />
                                    </div>
                                    <div className="pass-link" style={{textAlign:'center'}}><a href="#">Forgot password?</a></div>
                                    <div className="field btn">
                                        <button className='btn-save'>Login</button>
                                    </div>
                                    <div className="signup-link">Not a member? <a href="#" onClick={signupLink}>Signup here</a></div>
                                </form>
                            ) : (
                                <form className="signup" onSubmit={signup}>
                                    <div className="field">
                                        <br />
                                        <input type="text" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <input type="password" placeholder="Confirm password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    {c_alert.message && <p className={`alert ${c_alert.type}`}>{c_alert.message}</p>}
                                    <div className="field btn">
                                        <button className="btn-save" type="submit">Signup</button>
                                    </div>
                                    <div className="signup-link">Already a member? <a href="#" onClick={loginLink}>Login here</a></div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
