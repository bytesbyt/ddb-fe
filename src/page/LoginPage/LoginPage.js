import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, clearErrors, loginWithGoogle } from "../../features/user/userSlice";
import { hideToastMessage } from "../../features/common/uiSlice";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user || sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(hideToastMessage());
  }, [dispatch]);

  useEffect(() => {
    if (email || password) {
      dispatch(clearErrors());
    }
  }, [email, password, dispatch]);
  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    //google login
    dispatch(loginWithGoogle(googleData.credential));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Log in</h1>

        {loginError && <div className="login-error">{loginError}</div>}

        <form className="login-form" onSubmit={handleLoginWithEmail}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>

          <div className="divider">
            <span>or sign in with</span>
          </div>

          <div className="google-login-wrapper">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                
                }}
                text="signin_with"
                shape="rectangular"
                size="large"
                theme="outline"
              />
            </GoogleOAuthProvider>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
