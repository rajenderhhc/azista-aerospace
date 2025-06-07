import React from 'react';
import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { ThreeDot } from 'react-loading-indicators';

import './popup.css';

const onLoading = () => {
  const loaderDiv = document.createElement('div');
  ReactDOM.createRoot(loaderDiv).render(
    <ThreeDot color='#f58142' size='medium' text='' textColor='' />
  );

  // Use Swal.fire with the custom loader HTML
  return Swal.fire({
    html: loaderDiv, // Use the React-rendered loader as HTML
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'custom-swal-container', // Apply custom styles to the popup
    },
  });
};

const onLoadingClose = () => Swal.close();

const onSuccess = (message = '') => {
  return Swal.fire({
    position: 'center',
    icon: 'success',
    // title: message,
    text: message || 'Successfully saved',
    showConfirmButton: false,
    timer: 2000,
  });
};

const onError = (error) => {
  if (
    error.response &&
    (error.response.status === 401 || error.response.status === 440)
  ) {
    Cookies.remove(process.env.REACT_APP_JWT_TOKEN);
    return window.location.replace('/login');
  }
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.response
      ? error.response.data.message
      : error.message || 'Opps something went wrong ...',
  });
};

const errMsg = (error) => {
  if (error.response && error.response.data && error.response.data.errors) {
    const errors = error.response.data.errors;
    // Extract error messages
    const errorMessages = Object.values(errors)
      .map((value) => `${value.join(', ')}`)
      .join(' | ');
    return errorMessages;
  } else {
    return 'Oops! Something went wrong.';
  }
};
// error.response ? error.response.data.message : error.message;
const funcs = { onError, onLoading, onSuccess, onLoadingClose, errMsg };
export default funcs;
