import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Azistalogo from "../../images/Azista-logo.png";
import ErrorHandler from "../../utils/errorhandler";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userData, setUserData] = useState({ emailAddress: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const tokenKey = process.env.REACT_APP_JWT_TOKEN;
  const jwtToken = Cookies.get(tokenKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtToken) navigate("/");
  }, [jwtToken, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleOnChange = (e) => {
    setErrorMessage("");
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 1;
  };

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const onSubmitSuccess = (userData) => {
    Cookies.set(tokenKey, userData.token, { expires: 50 / (24 * 60) });
    localStorage.setItem(
      process.env.REACT_APP_ADMIN_KEY,
      JSON.stringify(userData)
    );
    navigate("/");
  };

  const onSubmitLogin = async () => {
    if (!validateEmail(userData.emailAddress)) {
      setErrorMessage("Invalid email address.");
      return;
    }

    if (!validatePassword(userData.password)) {
      setErrorMessage("Enter password");
      //Password must be at least 8 characters long.
      return;
    }

    try {
      const url = `${baseUrl}/UserAuthenticate/Login`;
      const formData = new FormData();
      formData.append("emailAddress", userData.emailAddress);
      formData.append("password", userData.password);

      ErrorHandler.onLoading();
      const response = await axios.post(url, formData, {
        headers: { Accept: "*/*", "Access-Control-Allow-Origin": "*/*" },
      });

      ErrorHandler.onLoadingClose();
      const { data } = response;

      if (data.statusCode === 200) {
        onSubmitSuccess(data.result);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      setErrorMessage(ErrorHandler.errMsg(error));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSubmitLogin();
  };

  return (
    <div className="bg-image">
      <div className="login-container">
        <img src={Azistalogo} alt="logo" className="logo-img" />
        <p>Weather Web Portal</p>
        <h5 className="my-3">Login</h5>
        <div className="form-floating w-100 mb-4">
          <input
            type="text"
            className="form-control login-input"
            id="emailAddress"
            value={userData.emailAddress}
            onChange={handleOnChange}
            placeholder="name@example.com"
            autoComplete="email"
          />
          <label htmlFor="emailAddress">User Name / Email Address</label>
        </div>

        <div className="password-cont w-100">
          <div className="form-floating w-100">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control login-input"
              id="password"
              autoComplete="off"
              value={userData.password}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              placeholder="Password"
            />
            <label htmlFor="password">Password</label>
          </div>
          <div onClick={handleClickShowPassword} className="eye-icon">
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </div>
        </div>
        <div className="my-4 w-100">
          <button
            onClick={onSubmitLogin}
            style={{ fontWeight: "700" }}
            className="btn btn-light btn-lg btn-block w-100 btn-outline-primary"
            type="button"
          >
            LOG IN
          </button>
          {/* <small className='text-center d-block mt-2'>
            Do not have an account? Create Account.
          </small> */}
        </div>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
