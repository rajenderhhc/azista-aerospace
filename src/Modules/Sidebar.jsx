import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ErrorHandler from "../utils/errorhandler";
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import azista from "../images/azista.png";
import locationIcon from "../images/location-icon.png";
import { AiOutlineSearch } from "react-icons/ai";

import StationOverView from "../components/StationOverView";
import { ThreeDot } from "react-loading-indicators";
import { IoIosClose } from "react-icons/io";
import "./Custom.css";
import "./dashboard.css";

const Sidebar = ({ toggleSidebar, showSidebar }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;
  const admin_key = process.env.REACT_APP_ADMIN_KEY;

  const userData = JSON.parse(localStorage.getItem(admin_key));
  const { profileDetailsList = [] } = userData || {};

  const [profileStations, setProfileStations] = useState([]);
  const [openDropdown, setOpenDropdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [openSearchDropdown, setOpenSearchDropdown] = useState();

  const getProfileStations = async (id = "", searchText = "", setSearch) => {
    if (!userData?.userId) return;

    const url = `${baseUrl}/User/UserMapDashboard/GetStationsPanelList`;
    const token = Cookies.get(token_key);

    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("profileId", id);
      formdata.append("searchText", searchText);

      const { data } = await axios.post(url, formdata, { headers });
      const { statusCode, result = [] } = data;
      setLoading(false);
      if (statusCode === 200) {
        if (setSearch) {
          setSearchResult(result);
          setOpenSearchDropdown(result[0]?.profileName);
        } else {
          setProfileStations(result);
          setSearchResult([]);
        }
      }
    } catch (error) {
      setLoading(false);
      ErrorHandler.onError(error);
    }
  };

  const handleSidebar = () => {
    toggleSidebar(!showSidebar);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? "" : id);
    if (openDropdown !== id) {
      getProfileStations(id, "");
    }
  };

  const [ProfileDetailsList, setProfileDetailsList] = useState(
    profileDetailsList || []
  );

  const getSearchStations = () => {
    if (searchText) {
      setShowSearchResult(true);
      getProfileStations(0, searchText, true);
    }
  };

  const onChangeSearchText = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setProfileDetailsList(profileDetailsList);
      setShowSearchResult(false);
    }
  };

  const onCloseSearchResult = () => {
    setSearchText("");
    setShowSearchResult(false);
    setSearchResult([]);
  };

  const groupByProfileName = (stations) => {
    return stations.reduce((acc, station) => {
      let group = acc.find((g) => g.profileName === station.profileName);
      if (!group) {
        group = { profileName: station.profileName, stations: [] };
        acc.push(group);
      }
      group.stations.push(station);
      return acc;
    }, []);
  };

  return (
    <>
      <div className="close-icon d-md-none">
        <IoIosClose onClick={handleSidebar} />
      </div>
      <div className="logo text-center">
        <img src={azista} alt="Azista" className="nav-logo" />
      </div>
      <div className="search-bar">
        <input
          id="search"
          type="text"
          value={searchText}
          onChange={onChangeSearchText}
          placeholder="Search Here..."
          className="searchBar"
        />
        <span className="verticalLine"></span>
        <AiOutlineSearch
          onClick={() => {
            if (searchText.length > 0) {
              getSearchStations();
            }
          }}
          size={18}
          style={{ cursor: "pointer" }}
        />
      </div>
      <hr />

      {showSearchResult ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            Search Results
            <span className="cors-btn" onClick={onCloseSearchResult}>
              x
            </span>
          </div>

          <div className="subDropdown mt-2 p-1">
            {loading ? (
              <ThreeDot color="#f58142" size="small" />
            ) : searchResult.length > 0 ? (
              <ul className="nav-items search-Nav-Items">
                {groupByProfileName(searchResult).map((each) => (
                  <li
                    key={each.profileName}
                    className={`nav-item ${
                      openSearchDropdown === each.profileName
                        ? "active-profile-view"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() =>
                        setOpenSearchDropdown(
                          openSearchDropdown === each.profileName
                            ? ""
                            : each.profileName
                        )
                      }
                      className="customDropdown"
                    >
                      <img
                        src={locationIcon}
                        alt="location"
                        className="nav-icons"
                      />
                      {each.profileName}

                      <span className="profile-count">
                        {each.stations?.length}
                      </span>
                      {openSearchDropdown === each.profileName ? (
                        <MdKeyboardArrowUp className="d-block" size={18} />
                      ) : (
                        <MdOutlineKeyboardArrowDown
                          className="d-block"
                          size={18}
                        />
                      )}
                    </button>

                    {openSearchDropdown === each.profileName && (
                      <div className="subDropdown mt-2 p-2">
                        {loading ? (
                          <ThreeDot color="#f58142" size="small" />
                        ) : each.stations.length > 0 ? (
                          <StationOverView
                            stations={each.stations}
                            activeEffect={true}
                          />
                        ) : (
                          <span className="text-danger">No Data found</span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-danger">No Data found</span>
            )}
          </div>
        </>
      ) : (
        <ul className="nav-items">
          {ProfileDetailsList.map((each) => (
            <li
              key={each.profileID}
              className={`nav-item ${
                openDropdown === each.profileID ? "active-profile-view" : ""
              }`}
            >
              <button
                onClick={() => toggleDropdown(each.profileID)}
                className="customDropdown d-flex"
              >
                <div className="w-75 d-flex justify-content-between align-items-center">
                  <div>
                    <img
                      src={locationIcon}
                      alt="location"
                      className="nav-icons"
                    />
                    {each.profileName}
                  </div>
                  <span className="profile-count">{each.totalStations}</span>
                </div>

                {openDropdown === each.profileID ? (
                  <MdKeyboardArrowUp className="d-block" size={18} />
                ) : (
                  <MdOutlineKeyboardArrowDown className="d-block" size={18} />
                )}
              </button>

              {openDropdown === each.profileID && (
                <div className="subDropdown mt-2 p-2">
                  {loading ? (
                    <ThreeDot color="#f58142" size="small" />
                  ) : profileStations.length > 0 ? (
                    <StationOverView
                      stations={profileStations}
                      activeEffect={true}
                    />
                  ) : (
                    <span className="text-danger">No Data found</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
