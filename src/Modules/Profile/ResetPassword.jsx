import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { HiOutlineEye } from "react-icons/hi";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

import ErrorHandler from "../../utils/errorhandler";

const ResetPasswordForm = ({ setCurrentForm }) => {
  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordTypes, setPasswordTypes] = useState({
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  });

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;

  const token = Cookies.get(token_key);

  const PasswordIcons = (id, value) => {
    return value ? (
      <HiOutlineEye
        className="pass-eye-icon"
        onClick={() => setPasswordTypes({ ...passwordTypes, [id]: !value })}
      />
    ) : (
      <AiOutlineEyeInvisible
        className="pass-eye-icon "
        onClick={() => setPasswordTypes({ ...passwordTypes, [id]: !value })}
      />
    );
  };

  const onChnagePasswords = (e) => {
    const { id, value } = e.target;
    setResetPassword((prev) => ({ ...prev, [id]: value }));
  };

  const resetPasswordSubmit = async () => {
    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      setError(`Password didn't match`);
      return;
    }
    try {
      const url = `${baseUrl}/UserAuthenticate/ResetPassword`;
      const headers = { Authorization: `Bearer ${token}` };
      ErrorHandler.onLoading();
      const formdata = new FormData();

      formdata.append("CurrentPassword", resetPassword.currentPassword);
      formdata.append("NewPassword", resetPassword.newPassword);
      formdata.append("ConfirmPassword", resetPassword.confirmPassword);

      const response = await axios.post(url, formdata, { headers });

      ErrorHandler.onLoadingClose();

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          text: "Password updated successfully",
          timer: 2000,
        });

        setCurrentForm("");
      } else {
        ErrorHandler.onError(response?.error || "Oops, something went wrong");
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <IoMdArrowBack
          onClick={() => setCurrentForm("")}
          style={{
            cursor: "pointer",
            fontSize: "1.2rem",
            marginRight: ".5rem",
          }}
        />
        <span className="fw-bold fs-5">Reset Password</span>
      </div>

      <div className="mt-2 ">
        <div className="row p-0">
          <div className="col-12 col-xl-6 mb-3">
            <label htmlFor="currentPassword" className="profile-input_label">
              Current Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={passwordTypes.currentPassword ? "password" : "text"}
                value={resetPassword.currentPassword}
                onChange={onChnagePasswords}
                className={`form-control ${
                  passwordTypes.currentPassword ? "large-dots" : ""
                }`}
                name="currentPassword"
                id="currentPassword"
                placeholder="Enter Current Password"
              />
              {PasswordIcons("currentPassword", passwordTypes.currentPassword)}
            </div>
          </div>
          <div className="col-12  col-xl-6 mb-3">
            <label htmlFor="newPassword" className="profile-input_label">
              New Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={passwordTypes.newPassword ? "password" : "text"}
                className={`form-control ${
                  passwordTypes.newPassword ? "large-dots" : ""
                }`}
                value={resetPassword.newPassword}
                onChange={onChnagePasswords}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
              />

              {PasswordIcons("newPassword", passwordTypes.newPassword)}
            </div>
          </div>
          <div className="col-12  col-xl-6 mb-3">
            <label htmlFor="confirmPassword" className="profile-input_label">
              Confirm New Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={passwordTypes.confirmPassword ? "password" : "text"}
                value={resetPassword.confirmPassword}
                onChange={onChnagePasswords}
                className={`form-control ${
                  passwordTypes.confirmPassword ? "large-dots" : ""
                }`}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Enter Confirm Password"
              />
              {PasswordIcons("confirmPassword", passwordTypes.confirmPassword)}
            </div>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button
          className="btn btn-primary custom-radius"
          onClick={resetPasswordSubmit}
        >
          Save and Update
        </button>
      </div>
    </>
  );
};

export default ResetPasswordForm;
