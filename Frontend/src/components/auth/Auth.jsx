import React from "react";
import "../../css/auth/Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { clearError, logout } from "../../redux/slices/authSlice";
import { closeAuthModel, openAuthModel } from "../../redux/slices/uiSlice";
import Modal from "../common/Modal";
import Signup from "./Signup";
import Login from "./Login";

const Auth = () => {

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { authModelOpen, authMode} = useSelector(state => state.ui);

  return (
    <>
      <div className="auth-container">

        {!isAuthenticated ? (
          <>
            <button className="auth-btn signup" onClick={() => {
              dispatch(clearError());
              dispatch(openAuthModel("signup"));
            }}>
              Signup
            </button>

            <button className="auth-btn login" onClick={() => {
              dispatch(clearError());
              dispatch(openAuthModel("login"));
            }}>
              Login
            </button>
          </>
        ) : (
            <button className="auth-btn logout" onClick={() => {
              dispatch(logout());
            }}>Logout</button>
        )}
        
      </div>

      {authModelOpen && <Modal onClose={() => {
        dispatch(closeAuthModel());
        dispatch(clearError());
      }}>
        {authMode == "signup" && <Signup />}
        {(authMode == "login" || authMode == "forgot") && <Login />}
      </Modal>}
    </>
  );
};

export default Auth;
