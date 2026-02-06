import React, { useState } from 'react';
import Input from "../common/Input.jsx";
import {useSelector, useDispatch } from "react-redux";
import { clearError, setError, setLoading, setUser } from "../../redux/slices/authSlice.js";
import { closeAuthModel, switchAuthModel } from "../../redux/slices/uiSlice.js";
import validator from "validator";
import axios from "axios";
import "../../css/auth/Login.css"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //forgor password
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");

    const dispatch = useDispatch();
    const {isLoading, error } = useSelector((state) => state.auth);

    const { authMode }= useSelector((state) => state.ui);
    const isForgot = authMode === "forgot";

    const handleLogin = async(e) => {
        e.preventDefault();
        console.log("HANDLE LOGIN CALLED");
        dispatch(clearError());

        if(!validator.isEmail(email)){
            dispatch(setError("Please enter a valid email address"));
            return;
        }

        if(!password){
            dispatch(setError("Please enter your password"));
            return;
        }

        dispatch(setLoading(true));

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {email, password});
            console.log(res);
            const data = res.data || {};

            dispatch(
                setUser({
                    user: data.user,
                    token: data.token,
                })
            );

            localStorage.setItem("token", data.token);
            console.log("Login Successfull");
            dispatch(closeAuthModel());
            
        } catch (error) {
            const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
            dispatch(setError(serverMessage || "Login Failed" ));
        }
    };

    const handleForgotPassword = async () => {
        if(!forgotEmail){
            setForgotMsg("Please enter your email");
            return;
        }
        
        try {
            setForgotMsg("Sending reset link...");
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
                {
                    email: forgotEmail,
                },
            );

            setForgotMsg("Reset link sent! Check your email 📩");
        } catch (error) {
            setForgotMsg(
                error?.response?.data?.message || "Failed to sent the reset email",
            );
        }
    };

  return (
    <div className='login-wrapper'>
        <h3 className='login-title'>Welcome Back</h3>
        <p className='login-subtitle'> Please enter your details to login </p>
        <form className="login-form" onSubmit={handleLogin}>
                {!isForgot && (
                    <>
                        <Input value={email} onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                    label = {"Email Address"}
                    placeholder= {"jhondoe@gmail.com"}
                    type= "email" 
                />
                <Input
                    value={password} onChange={(e) => {
                    setPassword(e.target.value);
                    }}
                    label = {"Password"}
                    placeholder= {"minimum 6 character"}
                    type= "password" 
                />
                    </>
                )}

                {/* forgot password link */}

                <div className="fogot-wrapper">
                    {!isForgot ? (
                        <>
                            <span className='forgot-link' onClick={() => {
                            dispatch(clearError());
                            dispatch(switchAuthModel("forgot"))
                        }}>Forgot Password?</span>
                        <span className='forgot-link' onClick={() => {
                            dispatch(clearError());
                            dispatch(switchAuthModel("signup"))}}>Don't have an Account? Sign Up</span>
                        </>

                    ) : (
                        <div className='forgot-box'>
                            <Input
                                label= "Email"
                                type= "email"
                                placeholder="Enter your registered email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                            />

                            {forgotMsg && <p className='forgot-msg'>{forgotMsg}</p>}

                            <button 
                                type='button'
                                className='forgot-btn'
                                onClick={handleForgotPassword}
                            >
                                Send the reset link
                            </button>
                        </div>
                    )}
                </div>

                {error && <div className='login-error'>{error}</div>}

                {!isForgot && (
                    <button type='submit' className='login-submit-btn' disabled={isLoading}>
                    <span>{isLoading ? "Logging in.." : "Login"}</span>
                    </button>
                )}
        </form>
    </div>
  );
}

export default Login