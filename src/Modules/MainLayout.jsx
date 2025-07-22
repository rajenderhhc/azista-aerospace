import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useStationProfile } from "../context/stationContext";

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const { setIsRjProfile } = useStationProfile();

  const userData = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_ADMIN_KEY)
  );

  const { profileDetailsList } = userData;

  const showReportType = () => {
    return profileDetailsList.some((p) =>
      p.profileName.toLowerCase().includes("nhp-rj")
    );
  };

  const isRjProfile = showReportType();
  setIsRjProfile(isRjProfile);

  return (
    <div className="webpage">
      <section
        className={
          showSidebar ? "displaySidebar" : "displaySidebar hideSidebar"
        }
      >
        <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </section>
      <section className={`mainCont ${showSidebar ? "" : "fullWidth"}`}>
        <Navbar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <Outlet />
        <Footer showSidebar={showSidebar} />
      </section>
    </div>
  );
};

export default MainLayout;
