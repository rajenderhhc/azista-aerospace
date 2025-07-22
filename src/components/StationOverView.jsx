import React from "react";
import { useNavigate } from "react-router-dom";

import barometer from "../images/barometer.png";
import humidity from "../images/humidity.png";
import thermometer from "../images/thermometer.png";

import RainFall from "../images/sensorIcons/rain.png";
import BatteryVoltage from "../images/sensorIcons/battery Voltage.png";
import WindDirection from "../images/sensorIcons/Wind Directio.png";
import WindSpeed from "../images/sensorIcons/Wind Speed.png";

import "./map.css";
import { FaCircle } from "react-icons/fa";
import { useStationProfile } from "../context/stationContext";

const StationOverView = (props) => {
  const { stations, viewSummary, activeEffect, profileName } = props;

  const { activeStationId, setActiveStationId } = useStationProfile();

  const navigate = useNavigate();
  const goToSummary = (station) => {
    sessionStorage.setItem("activeStation", station.stationId);
    sessionStorage.setItem("activeprofileId", station.profileId);
    setActiveStationId(station.stationId);
    navigate("/station/summary", {
      state: {
        station: {
          ...station,
          profileName: profileName || station.profileName,
        },
      },
    });
  };

  const getSensorIcon = (key) => {
    switch (key) {
      case "Wind Direction":
        return WindDirection;
      case "Daily Rain":
        return RainFall;
      case "Hourly Rainfall":
        return RainFall;
      case "Wind Speed":
        return WindSpeed;
      case "Battery Voltage":
        return BatteryVoltage;
      case "Air Temperature":
        return thermometer;
      case "Humidity":
        return humidity;
      case "Atmospheric Pressure":
        return barometer;
      default:
        return null;
    }
  };

  return (
    <>
      {stations.map((station, i) => {
        const isActiveTab =
          activeEffect && station.stationId === activeStationId
            ? "activestation"
            : "";
        return (
          <div key={station.stationId}>
            <div
              className={`station-weather-report ${isActiveTab}`}
              onClick={() => goToSummary(station)}
            >
              <span
                className={`stationName ${isActiveTab}`}
                style={{ minWidth: activeEffect ? "auto" : "20rem" }}
              >
                {station.stationName} - {station.stationId}
              </span>
              <span className="profileName">
                {station.profileName} , {station.district}
              </span>
              <div className="tool-status-container">
                <FaCircle
                  size="8"
                  className="me-1"
                  fill={station.stationStatus === "Yes" ? "#00FF09" : "#FF0000"}
                />
                {station.stationStatus === "Yes" ? "Online" : "Offline"}
              </div>
              <div className="report-data d-flex justify-content-between my-2">
                {Object.keys(station?.stationEnvDataList).map((key) => (
                  <div
                    key={key}
                    className="d-flex flex-column align-items-center mx-1"
                  >
                    {getSensorIcon(key) ? (
                      <img
                        src={getSensorIcon(key)}
                        alt="heat-icon"
                        className="instrument-icon"
                      />
                    ) : (
                      <img
                        src={thermometer}
                        alt="thermometer"
                        className="instrument-icon"
                      />
                    )}

                    <span className="d-block instrument-icon-val">
                      {station?.stationEnvDataList?.[key] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
              {viewSummary && (
                <span className="link-item_btn">View Station Summary</span>
              )}
            </div>
            {i !== stations.length - 1 && <hr style={{ margin: "0px" }} />}
          </div>
        );
      })}
    </>
  );
};

export default StationOverView;
