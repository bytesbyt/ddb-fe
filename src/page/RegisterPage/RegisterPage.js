import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import "./style/register.style.css";

import { registerUser, clearErrors } from "../../features/user/userSlice";
import { hideToastMessage } from "../../features/common/uiSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { registrationError, user } = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect if user is already logged in
    if (user || sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Clear errors and toast messages when component mounts
    dispatch(clearErrors());
    dispatch(hideToastMessage());
  }, [dispatch]);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;
    
    // Check password length
    if (password.length < 6) {
      setPasswordError("Minimum 6 characters.");
      return;
    }
    
    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);
    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Sign up</h1>
        
        {registrationError && (
          <div className="login-error">
            {registrationError}
          </div>
        )}
        
        <form className="login-form" onSubmit={register}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Your name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className={`form-input ${passwordError && formData.password ? 'error' : ''}`}
              placeholder="Create a password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            {!passwordError && formData.password && formData.password.length < 6 && (
              <span className="helper-text">Minimum 6 characters.</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${passwordError ? 'error' : ''}`}
              placeholder="Re-enter your password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
            {passwordError && (
              <span className="error-text">{passwordError}</span>
            )}
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="policy"
              className="checkbox-input"
              onChange={handleChange}
              checked={formData.policy}
            />
            <label htmlFor="policy" className="checkbox-label">
              I agree with <a href="#" className="terms-link">terms and conditions</a>
            </label>
          </div>
          {policyError && (
            <span className="error-text">You must agree to the terms and conditions</span>
          )}

          <button type="submit" className="login-btn">
            Sign up
          </button>

          <div className="signup-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;