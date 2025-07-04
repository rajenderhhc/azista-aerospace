import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

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
