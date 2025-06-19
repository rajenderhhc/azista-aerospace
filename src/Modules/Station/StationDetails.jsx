import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StationView from "./StationView";
import Cookies from "js-cookie";
import GraphsIcon from "./../../images/Graphs-icon.svg";
import ActiveGraphsIcon from "./../../images/ActiveGraphs-icon.svg";
import TabularViewIcon from "./../../images/TabularView-icon.svg";
import ActiveTabularViewIcon from "./../../images/ActiveTabularView-icon.svg";

import GraphicalData from "../Graphs/GraphicalData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import ErrorHandler from "../../utils/errorhandler";
import SelectDateRange from "../../components/SelectDateRange";
import moment from "moment";
import axios from "axios";
import DataTable from "./DataTable";
import CustomOverviewTable from "./CustormOverviewTable";

dayjs.extend(customParseFormat);

const StationDetails = () => {
  const [reqView, setRequiredView] = useState("tabularView");
  const [selectDateType, setSelectedDateType] = useState("today");
  const [SelectDate, setSelectedDate] = useState("");
  const [dataDetialDate, setDataDetialDate] = useState("");

  const location = useLocation();
  const {
    stationData = {},
    profileId = "",
    district = "",
  } = location.state || {};

  const navigateTo = (path) => {
    setRequiredView(path);
  };

  const handleCustomRangeDate = (date) => {
    setSelectedDate(date);
  };

  const [summaryData, setSummaryData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [overviewData, setOverviewData] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;
  const token = Cookies.get(token_key);
  const { stationId = "" } = stationData;

  const today = moment().format("DD-MMM-YYYY");
  const yesterday = moment().subtract(1, "day").format("DD-MMM-YYYY");

  const fromDate = SelectDate[0]?.$d;
  const toDate = SelectDate[1]?.$d;

  const dateFormatter = (date) => {
    return moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
      "DD-MMM-YYYY"
    );
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const url = `${baseUrl}/User/UserViewStationDashboard/GetStationSummary`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        ErrorHandler.onLoading();
        const formData = new FormData();

        formData.append("stationCode", stationId);
        formData.append("profileId", profileId);

        if (selectDateType === "custom") {
          formData.append("fromDate", dateFormatter(fromDate));
          formData.append("toDate", dateFormatter(toDate));
        } else {
          formData.append(
            "fromDate",
            selectDateType === "today" ? today : yesterday
          );
          formData.append(
            "toDate",
            selectDateType === "today" ? today : yesterday
          );
        }

        const response = await axios.post(url, formData, { headers });
        const { result } = response.data;
        ErrorHandler.onLoadingClose();
        setSummaryData(result);
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    fetchSummary();
  }, [
    baseUrl,
    token,
    stationId,
    profileId,
    fromDate,
    toDate,
    selectDateType,
    today,
    yesterday,
  ]);

  const stationDataDetails = useCallback(
    async (dataDetialDate) => {
      try {
        const url = `${baseUrl}/User/UserViewStationDashboard/GetStationDataDetails`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const formData = new FormData();
        ErrorHandler.onLoading();
        formData.append("stationCode", stationId);
        formData.append("profileId", profileId);
        if (dataDetialDate) {
          formData.append("fromDate", dataDetialDate);
          formData.append("toDate", dataDetialDate);
        } else {
          formData.append(
            "fromDate",
            selectDateType === "today" ? today : yesterday
          );
          formData.append(
            "toDate",
            selectDateType === "today" ? today : yesterday
          );
        }

        const response = await axios.post(url, formData, { headers });
        const { result } = response.data;
        ErrorHandler.onLoadingClose();
        setDetailedData(result);
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    },
    [baseUrl, token, stationId, profileId, selectDateType, today, yesterday]
  );

  useEffect(() => {
    if (
      (selectDateType === "custom" && dataDetialDate) ||
      (selectDateType !== "custom" && !dataDetialDate)
    ) {
      stationDataDetails(dataDetialDate);
    }
  }, [stationDataDetails, dataDetialDate, selectDateType]);

  useEffect(() => {
    const stationDataOverview = async () => {
      try {
        const url = `${baseUrl}/User/UserViewStationDashboard/GetStationDataOverview`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        ErrorHandler.onLoading();
        const formData = new FormData();

        formData.append("stationCode", stationId);
        formData.append("profileId", profileId);
        formData.append("fromDate", dateFormatter(fromDate));
        formData.append("toDate", dateFormatter(toDate));

        const response = await axios.post(url, formData, { headers });
        const { result } = response.data;
        ErrorHandler.onLoadingClose();
        setOverviewData(result);
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };
    if (selectDateType === "custom") {
      stationDataOverview();
    }
  }, [baseUrl, token, stationId, profileId, fromDate, toDate, selectDateType]);

  const sensorKeys = (data) => {
    return Array.isArray(data) && data[0]?.sensorDataList
      ? Object.keys(data[0].sensorDataList)
      : [];
  };

  const summaryHeaders = ["Statistical Metrics", ...sensorKeys(summaryData)];
  const datalistHeaders = ["Date", "Time", ...sensorKeys(detailedData)];
  const overViewHeaders = [...sensorKeys(overviewData)];

  const formatDataByDate = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const date = item.date;
      if (!grouped[date]) grouped[date] = {};
      grouped[date][item.title] = item.sensorDataList;
    });

    return Object.entries(grouped).map(([date, titles]) => {
      const row = { date };

      overViewHeaders.forEach((header) => {
        row[header] = {
          High: titles["High"]?.[header] ?? "N/A",
          Low: titles["Low"]?.[header] ?? "N/A",
          Average: titles["Average"]?.[header] ?? "N/A",
        };
      });

      return row;
    });
  };

  const fomatedOverivewData = formatDataByDate(overviewData);

  return (
    <div className="mainContInfo">
      <StationView stationData={stationData} district={district} />
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="left-sec">
          <img
            src={reqView === "graphicalView" ? ActiveGraphsIcon : GraphsIcon}
            alt="GraphsIcon"
            style={{ width: "2.5rem", height: "2.5rem", cursor: "pointer" }}
            onClick={() => navigateTo("graphicalView")}
          />
          <img
            src={
              reqView === "tabularView"
                ? ActiveTabularViewIcon
                : TabularViewIcon
            }
            alt="GraphsIcon"
            style={{ width: "2.5rem", height: "2.5rem", cursor: "pointer" }}
            onClick={() => navigateTo("tabularView")}
          />
        </div>
        <div className="right-sec">
          <div className="d-flex align-items-center">
            <strong>View by :</strong>
            <SelectDateRange
              handleCustomRangeDate={handleCustomRangeDate}
              setSelectedDateType={setSelectedDateType}
              selectDateType={selectDateType}
              SelectDate={SelectDate}
              value="tabularData"
              setDataDetialDate={setDataDetialDate}
            />
          </div>
        </div>
      </div>
      {reqView === "tabularView" ? (
        <>
          <DataTable
            data={summaryData}
            headers={summaryHeaders}
            SelectDate={SelectDate}
            selectDateType={selectDateType}
            fileName={`${stationData.stationId}-${
              stationData.stationName
            }-${dateFormatter(fromDate)}-${dateFormatter(toDate)}-summary-data`}
            title={"Summary"}
          />
          {selectDateType === "custom" ? (
            <CustomOverviewTable
              data={fomatedOverivewData}
              headers={overViewHeaders}
              SelectDate={SelectDate}
              selectDateType={selectDateType}
              setDataDetialDate={setDataDetialDate}
              fileName={`${stationData.stationId}-${
                stationData.stationName
              }-${dateFormatter(fromDate)}-${dateFormatter(
                toDate
              )}-overView-data`}
              title={"OverView"}
            />
          ) : (
            <DataTable
              data={detailedData}
              headers={datalistHeaders}
              SelectDate={SelectDate}
              selectDateType={selectDateType}
              fileName={`${stationData.stationId}-${
                stationData.stationName
              }-${dateFormatter(fromDate)}-${dateFormatter(
                toDate
              )}-detail-data`}
              title={"DetailData"}
            />
          )}

          {dataDetialDate !== "" && selectDateType === "custom" ? (
            <DataTable
              data={detailedData}
              headers={datalistHeaders}
              SelectDate={SelectDate}
              selectDateType={selectDateType}
              fileName={`${stationData.stationId}-${
                stationData.stationName
              }-${dateFormatter(fromDate)}-${dateFormatter(
                toDate
              )}-detail-data`}
              title={`Showing Detailed Data for ${dataDetialDate}`}
              offDateLabel={true}
            />
          ) : null}
        </>
      ) : (
        <GraphicalData
          selectDateType={selectDateType}
          SelectDate={SelectDate}
          dataDetialDate={dataDetialDate}
          setDataDetialDate={setDataDetialDate}
          summaryData={summaryData}
          detailedData={detailedData}
          overviewData={overviewData}
        />
      )}
    </div>
  );
};

export default StationDetails;
