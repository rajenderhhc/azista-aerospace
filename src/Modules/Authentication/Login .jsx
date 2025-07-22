import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Azistalogo from "../../images/Emblem_Rajasthan.png";
import ErrorHandler from "../../utils/errorhandler";
import "./login.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const [userData, setUserData] = useState({ emailAddress: "", password: "" });
  const [resetPasswords, setResetPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [view, setView] = useState(type || "login"); // "login" | "reset-request" | "reset-password"

  const tokenKey = process.env.REACT_APP_JWT_TOKEN || "token";
  const jwtToken = Cookies.get(tokenKey);
  const baseUrl = process.env.REACT_APP_BASE_URL || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtToken) navigate("/");
  }, [jwtToken, navigate]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleInputChange = (e, stateSetter) => {
    setErrorMessage("");
    const { id, value } = e.target;
    stateSetter((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length > 0;

  const onSubmitSuccess = (userData) => {
    Cookies.set(tokenKey, userData.token, { expires: 50 / (24 * 60) }); // Expires in ~50 mins
    localStorage.setItem(
      process.env.REACT_APP_ADMIN_KEY || "admin",
      JSON.stringify(userData)
    );
    navigate("/");
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    const { emailAddress, password } = userData;
    if (!validateEmail(emailAddress))
      return setErrorMessage("Invalid email address.");
    if (!validatePassword(password))
      return setErrorMessage("Password is required.");

    try {
      const formData = new FormData();
      formData.append("emailAddress", emailAddress);
      formData.append("password", password);

      ErrorHandler.onLoading();
      const { data } = await axios.post(
        `${baseUrl}/UserAuthenticate/Login`,
        formData
      );
      ErrorHandler.onLoadingClose();

      data.statusCode === 200
        ? onSubmitSuccess(data.result)
        : setErrorMessage(data.message);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      setErrorMessage(ErrorHandler.errMsg(error));
    }
  };

  const onSubmitResetPassword = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = resetPasswords;
    if (!newPassword || !confirmPassword)
      return setErrorMessage("All fields are required.");
    if (newPassword !== confirmPassword)
      return setErrorMessage("Passwords do not match.");

    // Add actual API call for resetting password here
    alert(`Resetting password..., ${newPassword}`);
    console.log("Resetting password...", newPassword);

    setResetPasswords({ newPassword: "", confirmPassword: "" });
    setView("login");
  };

  const onSubmitResetRequest = async (e) => {
    e.preventDefault();
    const { emailAddress } = userData;
    if (!validateEmail(emailAddress))
      return setErrorMessage("Enter a valid email.");
    // Add actual API call to request reset link here
    //  rajani.babariya@azistaaerospace.com
    try {
      const formData = new FormData();
      formData.append("emailAddress", emailAddress);
      ErrorHandler.onLoading();
      const { data } = await axios.post(
        `${baseUrl}/UserAuthenticate/ForgotPassword`,
        formData
      );
      console.log(data, "restepassword");
      ErrorHandler.onLoadingClose();

      const { message, result, statusCode } = data;

      if (statusCode === 200) {
        setShowPassword(false);
        setView("login");
        setUserData({ emailAddress: "", password: "" });
        ErrorHandler.onSuccess(result);
      } else if (statusCode === 204) {
        //ErrorHandler.onSuccess(message);
        setErrorMessage(message);
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      setErrorMessage(ErrorHandler.errMsg(error));
    }
  };

  const handleKeyDown = (e) => e.key === "Enter" && onSubmitLogin();

  return (
    <div className="bg-image">
      <div className="login-container">
        <img src={Azistalogo} alt="logo" className="logo-img" />
        <p>Weather Web Portal</p>

        {view === "login" && (
          <form onSubmit={onSubmitLogin} className="w-100 text-center">
            <h5 className="my-3">Login</h5>
            <div className="form-floating w-100 mb-4">
              <input
                type="text"
                id="emailAddress"
                className="form-control login-input"
                minLength={11}
                maxLength={100}
                value={userData.emailAddress}
                onChange={(e) => handleInputChange(e, setUserData)}
                placeholder="name@example.com"
                autoComplete="email"
              />
              <label htmlFor="emailAddress">Email Address</label>
            </div>

            <div className="password-cont w-100">
              <div className="form-floating w-100">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  minLength={5}
                  maxLength={12}
                  className="form-control login-input"
                  value={userData.password}
                  onChange={(e) => handleInputChange(e, setUserData)}
                  onKeyDown={handleKeyDown}
                  placeholder="Password"
                  autoComplete="off"
                />
                <label htmlFor="password">Password</label>
              </div>
              <div onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </div>
            </div>

            <div className="my-4 w-100">
              <button
                type="submit"
                style={{ fontWeight: "600", fontSize: "medium" }}
                className="btn btn-light btn-lg btn-block w-100 btn-outline-primary"
              >
                LOG IN
              </button>
              <small
                onClick={() => setView("reset-request")}
                className="text-center d-block mt-2"
                style={{ cursor: "pointer" }}
              >
                Forget Password?
              </small>
            </div>
          </form>
        )}

        {view === "reset-request" && (
          <form onSubmit={onSubmitResetRequest} className="w-100 text-center">
            <h5 className="my-1">Reset Password</h5>
            <small className="mb-3 d-block">
              Enter your registered email address to receive a new
              password.
            </small>
            <div className="form-floating w-100 mb-4">
              <input
                type="text"
                id="emailAddress"
                minLength={11}
                maxLength={100}
                className="form-control login-input"
                value={userData.emailAddress}
                onChange={(e) => handleInputChange(e, setUserData)}
                placeholder="name@example.com"
              />
              <label htmlFor="emailAddress">Email Address</label>
            </div>

            <div className="my-4 w-100">
              <button
                type="submit"
                style={{ fontWeight: "600", fontSize: "medium" }}
                className="btn btn-light btn-lg btn-block w-100 btn-outline-primary"
              >
                Forget Password
              </button>
              <small
                onClick={() => setView("login")}
                className="text-center d-block mt-2"
                style={{ cursor: "pointer" }}
              >
                Don’t want to reset your password? Log in
              </small>
            </div>
          </form>
        )}

        {view === "reset-password" && (
          <form onSubmit={onSubmitResetPassword} className="w-100 text-center">
            <h5 className="my-1">Reset Password</h5>
            <small className="mb-3 d-block">
              Enter a new password for your account. <br /> Make sure it’s
              strong and secure.
            </small>
            <div className="password-cont w-100">
              <div className="form-floating w-100">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="form-control login-input"
                  minLength={5}
                  maxLength={12}
                  value={resetPasswords.newPassword}
                  onChange={(e) => handleInputChange(e, setResetPasswords)}
                  placeholder="New Password"
                />
                <label htmlFor="newPassword">New Password</label>
              </div>
              <div onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </div>
            </div>

            <div className="form-floating w-100 mt-3">
              <input
                type="password"
                id="confirmPassword"
                className="form-control login-input"
                minLength={5}
                maxLength={12}
                value={resetPasswords.confirmPassword}
                onChange={(e) => handleInputChange(e, setResetPasswords)}
                placeholder="Confirm Password"
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <div className="my-4 w-100">
              <button
                type="submit"
                style={{ fontWeight: "600", fontSize: "medium" }}
                className="btn btn-light btn-lg btn-block w-100 btn-outline-primary"
              >
                Reset Password & Log In
              </button>
              <small
                onClick={() => setView("login")}
                className="text-center d-block mt-2"
                style={{ cursor: "pointer" }}
              >
                Don’t want to reset your password? Log in
              </small>
            </div>
          </form>
        )}

        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
