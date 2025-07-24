import axios from "axios";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ErrorHandler from "../utils/errorhandler";

import { FaBars } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";

import { TbFileDatabase } from "react-icons/tb";
import { LuBellDot } from "react-icons/lu";
import { RxPerson } from "react-icons/rx";
import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import Notifications from "./Notifications";
import "./dashboard.css";

const NavbarModule = ({ toggleSidebar, showSidebar }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;
  const admin_key = process.env.REACT_APP_ADMIN_KEY;
  const token = Cookies.get(token_key);
  const userData = JSON.parse(localStorage.getItem(admin_key));
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [showNotificationsBar, setShowNotificationsBar] = useState(false);

  const [nofications, setNotofications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const onLogOut = async () => {
    try {
      const url = `${baseUrl}/UserAuthenticate/Logout`;

      ErrorHandler.onLoading();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formdata = new FormData();
      formdata.append("refreshToken", userData.refreshToken);
      const response = await axios.post(url, formdata, { headers });

      ErrorHandler.onLoadingClose();

      if (response.data.statusCode === 200) {
        Cookies.remove(token_key);
        navigate("/login");
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  const handleSidebar = () => {
    toggleSidebar(!showSidebar);
  };

  const handleNotificationStatus = (id) => {
    const unredData = nofications.filter((n, i) => i !== id);
    setNotofications(unredData);
    setUnreadCount((prev) => prev - 1);
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const url = `${baseUrl}/Admin/Notification/GetAllNotifications`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { statusCode, result } = data;
        if (statusCode === 200) {
          setNotofications(result);
          const unreadCount = result.filter((n) => n.status === "Unread");
          setUnreadCount(unreadCount.length);
        } else {
        }
      } catch (error) {}
    };
    getNotifications();
  }, [baseUrl, token]);

  const toggleNotificationsBar = (value) => {
    setShowNotificationsBar(value);
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-cont">
        <Container fluid>
          <Navbar.Brand onClick={handleSidebar} className="fabar">
            <FaBars />
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto navItemsCont">
              <Tooltip title={"Home"}>
                <Link
                  to="/"
                  className={`nav-item-link ${
                    pathname === "/" ? "active-nav" : ""
                  }`}
                >
                  <IoHomeOutline />
                </Link>
              </Tooltip>
              <Tooltip title={"Reports"}>
                <Link
                  to="/reports"
                  className={`nav-item-link ${
                    pathname === "/reports" ? "active-nav" : ""
                  }`}
                >
                  <TbFileDatabase />
                </Link>
              </Tooltip>
              <Tooltip title="Notifications">
                <div
                  onClick={() => toggleNotificationsBar(true)}
                  className={`nav-item-link notification ${
                    showNotificationsBar && nofications.length
                      ? "active-nav"
                      : ""
                  }`}
                >
                  <LuBellDot />
                  {unreadCount > 0 && (
                    <p className="notific-count">{unreadCount}</p>
                  )}
                </div>
              </Tooltip>
              <Tooltip title="Profile">
                <Link
                  to="/profile"
                  className={`nav-item-link ${
                    pathname.startsWith("/profile") ? "active-nav" : ""
                  }`}
                >
                  {userData?.userImage ? (
                    <img
                      style={{ width: "100%", borderRadius: "50%" }}
                      src={userData?.userImage}
                      alt="profile"
                    />
                  ) : (
                    <RxPerson />
                  )}
                </Link>
              </Tooltip>
              <Link to="" className="nav-item-link d-md-none">
                <AiOutlineLogout onClick={onLogOut} />
              </Link>

              <NavDropdown
                className="customNavDropdown no-arrow d-none d-md-block"
                title={
                  <>
                    {userData?.firstName} {userData?.lastName}
                    <MdOutlineKeyboardArrowDown size={18} />
                  </>
                }
                id="basic-nav-dropdown"
              >
                {/* <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item> */}
                <NavDropdown.Item onClick={onLogOut}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>{" "}
      <section
        className={
          showNotificationsBar && nofications.length
            ? "notification-cont"
            : "notification-cont hideNotification-cont"
        }
      >
        <Notifications
          toggleNotificationsBar={toggleNotificationsBar}
          nofications={nofications}
          handleNotificationStatus={handleNotificationStatus}
        />
      </section>
    </>
  );
};

export default NavbarModule;
