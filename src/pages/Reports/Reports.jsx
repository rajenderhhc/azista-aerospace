/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import moment from "moment";
import ErrorHandler from "../../utils/errorhandler";

import ReportTypeDrop from "./ReportTypeDrop";

import { ThreeDot } from "react-loading-indicators";
import { reportTypeConfig } from "./config";

import "./reports.css";
import { useStationProfile } from "../../context/stationContext";

const Reports = () => {
  const userData = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_ADMIN_KEY)
  );
  const { profileDetailsList } = userData;

  const { isRjProfile } = useStationProfile();

  const getCurrentHourTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    return `${hours}:00`;
  };

  const [reportType, setReportType] = useState("gn");
  const [reportsData, setReportsData] = useState([]);
  const [selectDateType, setSelectedDateType] = useState("today");
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [profileStations, setProfileStations] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(
    profileDetailsList.length > 0 ? profileDetailsList[0].profileID : 0
  );
  const [selectedStations, setSelectedStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNodata, setShowNodata] = useState(false);
  const [stationError, setStationError] = useState(false);
  const [fileName, setFileName] = useState("station-list.csv");
  const [filterType, setFilterType] = useState("c");
  const [selectedTimes, onChangeTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = Cookies.get(process.env.REACT_APP_JWT_TOKEN);

  const handleCustomRangeDate = (date) => setDateRange(date);
  const onChangeProfile = (e) => setSelectedProfile(e);

  const getDatebyInputChange = () => {
    switch (selectDateType.toLowerCase()) {
      case "today":
        return {
          formDate: moment().format("DD-MMM-YYYY"),
          toDate: moment().format("DD-MMM-YYYY"),
        };
      case "yesterday":
        const y = moment().subtract(1, "day").format("DD-MMM-YYYY");
        return { formDate: y, toDate: y };
      default:
        return {
          formDate: moment(dateRange[0].$d).format("DD-MMM-YYYY"),
          toDate: moment(dateRange[1].$d).format("DD-MMM-YYYY"),
        };
    }
  };

  const getMyStations = async (profileId) => {
    if (reportType !== "gn") return;
    try {
      ErrorHandler.onLoading();
      setSelectedStations([]);
      setProfileStations([]);
      const formdata = new FormData();
      formdata.append("profileId", profileId);
      const { data } = await axios.post(
        `${baseUrl}/Admin/Station/GetAllStations`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      ErrorHandler.onLoadingClose();

      if (data.statusCode === 200) {
        setProfileStations(data.result);
      } else {
        ErrorHandler.onError({ message: data.message || "Unknown error" });
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  useEffect(() => {
    getMyStations(selectedProfile);
  }, [selectedProfile]);

  const fetchGeneralReport = async () => {
    const ids = selectedStations.map((opt) => opt.value).join(",");
    const { formDate, toDate } = getDatebyInputChange();
    if (!selectedStations.length) return setStationError(true);
    if (!formDate || !toDate) return alert("Please select date");

    try {
      setLoading(true);
      setShowNodata(true);

      const formdata = new FormData();
      formdata.append("stationIds", ids);
      formdata.append("fromDate", formDate);
      formdata.append("toDate", toDate);

      const { data } = await axios.post(
        `${baseUrl}/Report/Report/DataReport`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
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
      } else {
        ErrorHandler.onError({ message: data.message || "Unknown error" });
      }
    } catch (error) {
      setLoading(false);
      ErrorHandler.onError(error);
    }
  };

  const fetchSummaryReport = async (subPath, formdata) => {
    try {
      setLoading(true);
      setShowNodata(true);

      const { data } = await axios.post(
        `${baseUrl}/Report/Report/${subPath}`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);
      if (data.statusCode === 200) {
        setReportsData(data.result);
        const profile = profileDetailsList.find(
          (p) => p.profileID === selectedProfile
        );
        setFileName(`${profile?.profileID}-${subPath}`);
      } else {
        ErrorHandler.onError({ message: data.message || "Unknown error" });
      }
    } catch (error) {
      setLoading(false);
      ErrorHandler.onError(error);
    }
  };

  const config = reportTypeConfig[reportType];

  // Utility function to get FormData for summary reports
  const createBaseFormData = () => {
    const formdata = new FormData();
    if (!selectedProfile) {
      ErrorHandler.onError({ message: "Please select a profile." });
      return null;
    }
    formdata.append("profileId", selectedProfile);
    return formdata;
  };

  // Utility: summary report mapping
  const summaryReportMap = {
    rwl: "WaterLevelSummaryReport",
    ws: "AWSSummaryReport",
    gd: "GDSummaryReport",
    rgs: "SummaryDetailsReport",
  };

  const handleApicall = () => {
    const formdata = createBaseFormData();
    if (!formdata) return;

    switch (reportType) {
      case "rwl":
      case "ws":
      case "gd":
        fetchSummaryReport(summaryReportMap[reportType], formdata);
        break;

      case "rgs":
        const formattedDate = selectedDate
          ? dayjs(selectedDate).format("DD-MMM-YYYY")
          : "";
        const hours =
          selectedTimes.length > 0
            ? selectedTimes.join(",")
            : getCurrentHourTime();
        formdata.append("date", formattedDate);
        formdata.append("filterType", filterType);
        formdata.append("hours", hours);

        fetchSummaryReport(summaryReportMap[reportType], formdata);
        break;

      default:
        fetchGeneralReport();
        break;
    }
  };

  return (
    <div className="mainContInfo">
      <h5 className="report-title">Reports</h5>
      <div className="row inputs-containr_header">
        {isRjProfile && (
          <div className="col-12 col-md-3 mb-2">
            <ReportTypeDrop
              reportType={reportType}
              setReportType={setReportType}
              setReportsData={setReportsData}
              setShowNodata={setShowNodata}
            />
          </div>
        )}

        {config?.renderFilters({
          selectedProfile,
          onChangeProfile,
          profileDetailsList,
          selectedStations,
          setSelectedStations,
          profileStations,
          stationError,
          setStationError,
          selectDateType,
          setSelectedDateType,
          handleCustomRangeDate,
          filterType,
          setFilterType,
          selectedTimes,
          onChangeTime,
          selectedDate,
          setSelectedDate,
          reportsData,
        })}

        <div className="col-12 col-md-2 mt-3">
          <button className="btn btn-primary" onClick={handleApicall}>
            Generate Report
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div
            className="text-center"
            style={{
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDot color="#f58142" size="small" />
          </div>
        ) : reportsData?.length > 0 ? (
          config?.TableComponent && (
            <config.TableComponent
              selectDateType={selectDateType}
              data={reportsData}
              fileName={fileName}
            />
          )
        ) : (
          <div
            className="text-center h-50"
            style={{
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showNodata && (
              <div className="my-3 text-danger">No Data found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
