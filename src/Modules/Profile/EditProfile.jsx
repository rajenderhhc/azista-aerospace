import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ErrorHandler from "../../utils/errorhandler";
import { IoMdArrowBack } from "react-icons/io";
import Swal from "sweetalert2";

const EditProfile = (props) => {
  const { userDataInfo, setCurrentForm } = props;

  const [userData, setUserData] = useState(userDataInfo);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;

  const token = Cookies.get(token_key);

  const onChangeInput = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.firstName || !userData.lastName || !userData.emailAddress) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const url = `${baseUrl}/Admin/User/UpdateUserProfile`;
      const formdata = new FormData();
      ErrorHandler.onLoading();

      formdata.append("FirstName", userData.firstName);
      formdata.append("LastName", userData.lastName);
      formdata.append("EmailAddress", userData.emailAddress);

      const response = await axios.post(url, formdata, { headers });

      ErrorHandler.onLoadingClose();

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          text: "Profile updated successfully",
          timer: 2000,
        });

        localStorage.setItem(
          process.env.REACT_APP_ADMIN_KEY,
          JSON.stringify(userData)
        );

        setCurrentForm("");
      } else {
        ErrorHandler.onError(
          response?.data?.message || "Oops, something went wrong"
        );
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(
        error?.response?.data?.message || "An error occurred."
      );
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <IoMdArrowBack
          onClick={() => setCurrentForm("")}
          style={{
            cursor: "pointer",
            fontSize: "1.2rem",
            marginRight: ".5rem",
          }}
        />
        <span className="fw-bold fs-5">Edit Profile</span>
      </div>

      <form className="mt-4 p-3" onSubmit={handleSubmit}>
        <div className="row">
          {/* Full Name Field */}
          <div className="col-12 col-md-6 col-xl-4 mb-3">
            <label htmlFor="firstName" className="profile-input_label">
              First Name
            </label>
            <input
              type="text"
              value={userData.firstName}
              className="form-control"
              maxLength={30}
              minLength={1}
              onChange={onChangeInput}
              style={{ color: "#000000" }}
              name="firstName"
              id="firstName"
              placeholder="Enter your First Name"
            />
          </div>
          <div className="col-12 col-md-6 col-xl-4 mb-3">
            <label htmlFor="lastName" className="profile-input_label">
              Last Name
            </label>
            <input
              type="text"
              value={userData.lastName}
              className="form-control"
              maxLength={30}
              minLength={1}
              onChange={onChangeInput}
              style={{ color: "#000000" }}
              name="lastName"
              id="lastName"
              placeholder="Enter your Last Name"
            />
          </div>

          {/* Email Address Field */}
          <div className="col-12 col-md-6 col-xl-4 mb-3">
            <label htmlFor="emailAddress" className="profile-input_label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              value={userData.emailAddress}
              maxLength={60}
              minLength={3}
              onChange={onChangeInput}
              style={{ color: "#000000" }}
              name="emailAddress"
              id="emailAddress"
              placeholder="Enter your email address"
            />
          </div>

          {/* Mobile Number Field */}
          <div className="col-12 col-md-6 col-xl-4 mb-3">
            <label htmlFor="mobileNumber" className="profile-input_label">
              Mobile Number
            </label>
            <input
              type="text"
              className="form-control"
              value={userData.mobileNumber}
              readOnly
              maxLength={10}
              style={{ color: "#000000" }}
              name="mobileNumber"
              id="mobileNumber"
              placeholder="Enter Mobile Number"
            />
          </div>

          {/* Role Field (Read-only) */}
          <div className="col-12 col-md-6 col-xl-4 mb-3">
            <label htmlFor="Role" className="profile-input_label">
              Role
            </label>
            <input
              type="text"
              disabled
              value={userData.roleName}
              readOnly
              className="form-control"
              style={{ color: "#000000" }}
              name="Role"
              id="Role"
              placeholder=""
            />
          </div>

          {/* User ID Field (Read-only) */}
          {/* <div className='col-4 mb-3'>
            <label htmlFor='userId' className='profile-input_label'>
              User ID
            </label>
            <input
              type='text'
              disabled
              value={userData.userId}
              className='form-control'
              readOnly
              style={{ color: '#000000' }}
              name='userId'
              id='userId'
              placeholder=''
            />
          </div> */}
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary custom-radius">
            Save and Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
