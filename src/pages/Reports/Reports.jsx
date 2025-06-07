/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import ErrorHandler from "../../utils/errorhandler";
import SelectDateRange from "../../components/SelectDateRange";

import "./reports.css";
import moment from "moment";
import { ThreeDot } from "react-loading-indicators";
import ProfileDropdown from "./ProfilesDrop";
import StationDropdown from "./SatationDrop";
import WeatherTable from "./ReportsTable";

const Reports = () => {
  const userData = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_ADMIN_KEY)
  );

  let { profileDetailsList } = userData;

  const [reportsData, setReportsData] = useState([]);
  const [selectDateType, setSelectedDateType] = useState("today");
  const [dateRange, setDateRange] = useState([
    dayjs(), // Current date as a dayjs object
    dayjs(), // Current date as a dayjs object
  ]);
  const [profileStations, setProfileStations] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(
    profileDetailsList.length === 1 ? profileDetailsList[0].profileID : 0
  );
  const [selectedStations, setSelectedStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNodata, setShowNodata] = useState(false);
  const [stationError, setStationError] = useState(false);
  const [fileName, setFileName] = useState("station-list.csv");

  const { REACT_APP_BASE_URL, REACT_APP_JWT_TOKEN } = process.env;

  const baseUrl = REACT_APP_BASE_URL;
  const token = Cookies.get(REACT_APP_JWT_TOKEN);

  const getMyStations = async (selectedProfile) => {
    try {
      ErrorHandler.onLoading();
      setSelectedStations([]);
      setProfileStations([]);
      const formdata = new FormData();
      formdata.append("profileId", selectedProfile);

      const { data } = await axios.post(
        `${baseUrl}/Admin/Station/GetAllStations`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      ErrorHandler.onLoadingClose();
      data.statusCode === 200
        ? setProfileStations(data.result)
        : ErrorHandler.onError({
            message: data.message || "Unknown error",
          });
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  useEffect(() => {
    getMyStations(selectedProfile);
  }, [selectedProfile]);

  const handleCustomRangeDate = (date) => {
    setDateRange(date);
  };

  const onChangeProfile = (e) => {
    setSelectedProfile(e);
  };

  const getDatebyInputChange = () => {
    switch (selectDateType.toLowerCase()) {
      case "today": {
        const today = moment().format("DD-MMM-YYYY");
        return { formDate: today, toDate: today };
      }
      case "yesterday": {
        const yesterday = moment().subtract(1, "day").format("DD-MMM-YYYY");
        return { formDate: yesterday, toDate: yesterday };
      }
      default: {
        return {
          formDate: moment(dateRange[0].$d).format("DD-MMM-YYYY"),
          toDate: moment(dateRange[1].$d).format("DD-MMM-YYYY"),
        };
      }
    }
  };

  const getReportsData = async () => {
    const ids = selectedStations.map((opt) => opt.value).join(",");
    const { formDate, toDate } = getDatebyInputChange();
    if (!selectedStations.length) {
      return setStationError(true);
    }
    if (!formDate || !toDate) {
      return alert("Please select date");
    }

    try {
      setLoading(true);
      setShowNodata(true);

      const formdata = new FormData();
      formdata.append("stationIds", ids);
      formdata.append("fromDate", formDate);
      formdata.append("toDate", toDate);

      const url = `${baseUrl}/Report/Report/DataReport`;
      const headers = { Authorization: `Bearer ${token}` };

      const { data } = await axios.post(url, formdata, {
        headers,
      });
      if (data.statusCode === 200) {
        setReportsData(data.result);

        const profile = profileDetailsList.find(
          (p) => p.profileID === selectedProfile
        );

        const filename =
          selectedStations.length > 1
            ? `${profile?.profileID}-${profile?.profileName}-${formDate}-${toDate}.csv`
            : `${selectedStations[0]?.label}-${formDate}-${toDate}.csv`;

        setFileName(filename);
        setLoading(false);
      } else {
        setLoading(false);
        ErrorHandler.onError({ message: data.message || "Unknown error" });
      }
    } catch (error) {
      setLoading(false);
      ErrorHandler.onError(error);
    }
  };

  return (
    <div className="mainContInfo">
      <h5 className="report-title">Reports</h5>
      <div className="row inputs-containr_header">
        <div className="col-12 col-md-3">
          <ProfileDropdown
            selectedProfile={selectedProfile}
            onChangeProfile={onChangeProfile}
            profileDetailsList={profileDetailsList}
          />
        </div>
        <div className="col-12 col-md-4">
          <StationDropdown
            selectedStations={selectedStations}
            setSelectedStations={setSelectedStations}
            profileStations={profileStations}
            stationError={stationError}
            setStationError={setStationError}
          />
        </div>
        <div className="col-12 col-md-5">
          <label className="label-primary" htmlFor="dateSelect">
            Select Date *
          </label>
          <SelectDateRange
            handleCustomRangeDate={handleCustomRangeDate}
            setSelectedDateType={setSelectedDateType}
            selectDateType={selectDateType}
          />
          <span style={{ display: "none" }}>data required</span>
        </div>
      </div>
      <div className="text-center my-2">
        <button className="btn btn-primary " onClick={getReportsData}>
          Generate Report
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <ThreeDot color="#f58142" size="small" />
        </div>
      ) : reportsData?.length > 0 ? (
        <WeatherTable data={reportsData} fileName={fileName} />
      ) : (
        <div className="text-center h-50">
          {showNodata && (
            <div className="my-3">
              <span className="text-danger text-center">No Data found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
