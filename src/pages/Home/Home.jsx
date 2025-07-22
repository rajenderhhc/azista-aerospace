import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import ErrorHandler from "../../utils/errorhandler";
import MapEmbed from "../../components/MapEmbed";

const Home = () => {
  const [locations, setLocations] = useState([]);

  const getMyStations = useCallback(async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const token_key = process.env.REACT_APP_JWT_TOKEN;

    const url = `${baseUrl}/User/UserMapDashboard/GetStationMapDashboard`;
    const token = Cookies.get(token_key);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      ErrorHandler.onLoading();

      const response = await axios.post(url, {}, { headers });
      ErrorHandler.onLoadingClose();

      if (response.data.statusCode === 200) {
        const { result } = response.data;
        setLocations(result);
      } else {
        ErrorHandler.onError({
          message: response.data?.message || "Unknown error",
        });
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeStation", "");
    getMyStations();
  }, [getMyStations]);

  return (
    <div className="mainContInfo">
      {locations.length > 0 ? (
        <MapEmbed
          locations={locations}
          height={"85vh"}
          Zoom={locations.length > 16 ? 6 : 10}
          viewSummary={true}
        />
      ) : (
        <div className="h-75 d-flex justify-content-center align-items-center">
          <h1>No Data Found</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
