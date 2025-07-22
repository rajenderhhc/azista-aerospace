import React, { useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ErrorHandler from "../utils/errorhandler";
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import azista from "../images/azista.png";
import rajstanlogo from "../images/Emblem_Rajasthan.png";
import locationIcon from "../images/location-icon.png";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

import StationOverView from "../components/StationOverView";
import { ThreeDot } from "react-loading-indicators";
import { IoIosClose } from "react-icons/io";
import "./Custom.css";
import "./dashboard.css";
import { useStationProfile } from "../context/stationContext";

const Sidebar = ({ toggleSidebar, showSidebar }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;
  const admin_key = process.env.REACT_APP_ADMIN_KEY;

  const { isRjProfile } = useStationProfile();

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(admin_key)) || {};
    } catch {
      return {};
    }
  }, [admin_key]);
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
        group = {
          profileName: station.profileName,
          profileColor: station.profileColor,
          profileIcon: station.profileIcon,
          stations: [],
        };
        acc.push(group);
      }
      group.stations.push(station);
      return acc;
    }, []);
  };

  const renderDropdownItem = (profile, isSearch = false) => {
    const {
      profileName = "",
      profileID = "",
      totalStations = 0,
      stations = [],
      profileIcon,

      profileColor,
    } = profile;

    const isOpen = isSearch
      ? openSearchDropdown === profileName
      : openDropdown === profileID;

    const stationsList = isSearch ? stations : profileStations;
    const stationCount = isSearch ? stations.length : totalStations;

    const handleProfileClick = () => {
      if (isSearch) {
        setOpenSearchDropdown(isOpen ? "" : profileName);
      } else {
        toggleDropdown(profileID);
      }
    };

    return (
      <li
        key={profileID}
        className={`nav-item mb-3 ${
          !isSearch && isOpen ? "active-profile-view" : ""
        }`}
      >
        <button onClick={handleProfileClick} className="customDropdown">
          <div className="customDropdown-continer">
            {/* locationIcon */}
            <img
              src={profileIcon || locationIcon}
              alt="location"
              className="nav-icons"
            />
            <p className="w-75 text-start mb-0" style={{ color: profileColor }}>
              {profileName}
            </p>
            <p
              className="profile-count ms-1 mb-0"
              style={{ background: profileColor }}
            >
              {stationCount > 99 ? "99+" : stationCount}
            </p>
            {/* PROFILES_COLORS[profileName] */}
          </div>
          {isOpen ? (
            <MdKeyboardArrowUp className="d-block" size={18} />
          ) : (
            <MdOutlineKeyboardArrowDown className="d-block" size={18} />
          )}
        </button>

        {isOpen && (
          <div className="subDropdown mt-2 p-2">
            {loading ? (
              <div className="text-center">
                <ThreeDot color="#f58142" size="small" />
              </div>
            ) : stationsList.length > 0 ? (
              <StationOverView
                stations={stationsList}
                profileName={profileName}
                activeEffect={true}
              />
            ) : (
              <div className="text-center">
                <span className="text-danger">No Data found</span>
              </div>
            )}
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="close-icon d-md-none">
        <IoIosClose onClick={handleSidebar} />
      </div>
      <div className="logo text-center">
        <Link to="/">
          <img
            src={isRjProfile ? rajstanlogo : azista}
            alt="Azista"
            className="nav-logo"
          />
        </Link>
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

          <div
            className={`subDropdown mt-2 p-1 ${loading ? "text-center" : ""}`}
          >
            {loading ? (
              <div className="text-center">
                <ThreeDot color="#f58142" size="small" />
              </div>
            ) : searchResult.length > 0 ? (
              <ul className="nav-items search-Nav-Items">
                {groupByProfileName(searchResult).map((each) =>
                  renderDropdownItem(each, true)
                )}
              </ul>
            ) : (
              <div className="text-center">
                <span className="text-danger">No Data found</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <ul className="nav-items">
          {ProfileDetailsList.map((each) => renderDropdownItem(each))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
