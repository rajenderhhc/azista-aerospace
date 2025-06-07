import React from "react";
import { RxCross2 } from "react-icons/rx";
import "./Custom.css";

const Notifications = (props) => {
  const {
    toggleNotificationsBar,
    nofications = [],
    handleNotificationStatus,
  } = props;

  const closeNotificationBar = () => {
    toggleNotificationsBar(false);
  };
  const onChangeNotificationStatus = (i) => {
    handleNotificationStatus(i);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h6>Notifications</h6>
        <RxCross2
          strokeWidth="0.2"
          style={{ cursor: "pointer" }}
          onClick={closeNotificationBar}
        />
      </div>
      <div className="notificationsBar mt-md-3">
        {nofications?.map((n, i) => (
          <div key={i}>
            <div
              className="notification mt-2 mb-2 "
              onClick={() => onChangeNotificationStatus(i)}
            >
              <div className="d-flex flex-column flex-md-row justify-content-md-between">
                <p className="notificationHeading">{n?.notificationTitle}</p>
                <small>{n?.createdOn}</small>
              </div>
              <small>{n?.notificationMessage}</small>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default Notifications;
