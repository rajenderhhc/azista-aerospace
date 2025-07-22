import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
  Tooltip,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import StationOverView from "./StationOverView";
import ErrorHandler from "../utils/errorhandler";
import { ThreeDot } from "react-loading-indicators";
import { useStationProfile } from "../context/stationContext";

const { BaseLayer } = LayersControl;

const ResizeHandler = () => {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize(true);
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
};

const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
};

const getValidCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  return !isNaN(latitude) && !isNaN(longitude)
    ? [latitude, longitude]
    : [20.5937, 78.9629];
};

const MapEmbed = ({
  locations = [],
  height = "250px",
  Zoom = 5,
  viewSummary = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [stationData, setStationData] = useState([]);
  const mapRef = useRef(null);

  const { setActiveStationId, setActiveProfileId } = useStationProfile();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token_key = process.env.REACT_APP_JWT_TOKEN;
  const token = Cookies.get(token_key);

  const fetchStationData = async (stationId) => {
    if (!stationId) return;
    setActiveMarker(stationId);
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();
      formData.append("stationId", stationId);

      const { data } = await axios.post(
        `${baseUrl}/User/UserMapDashboard/GetStationMapTooltip`,
        formData,
        { headers }
      );

      setStationData(
        data.statusCode === 200 && data.result.length > 0
          ? [{ ...data.result[0], stationId }]
          : []
      );
      setLoading(false);
      if (data.statusCode !== 200) {
        setLoading(false);
        ErrorHandler.onError({ message: data?.message || "Unknown error" });
      }
    } catch (error) {
      setStationData([]);
      setLoading(false);
      ErrorHandler.onError(error);
    }
  };

  const createCustomIcon = (isActive, profileIcon, profileColor) => {
    const color = isActive ? "#000000" : profileColor || "#2e8ff7ff";

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="${color}" d="M12.5 0C5.6 0 0 5.6 0 12.5 0 22.2 12.5 41 12.5 41S25 22.2 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle cx="13" cy="13" r="4" fill="white"/>
      </svg>
    `;

    const svgUrl = "data:image/svg+xml;base64," + btoa(svgIcon);

    return new L.Icon({
      iconUrl: profileIcon || svgUrl,
      iconSize: profileIcon ? [22, 22] : [25, 41],
      iconAnchor: [12.5, 41],
      popupAnchor: [0, -35],
      // shadowUrl:
      //   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41],
    });
  };

  const centerCoordinates =
    locations.length > 0
      ? getValidCoordinates(locations[0]?.latitude, locations[0]?.longitude)
      : [20.5937, 78.9629];

  return (
    <div className="map-container">
      <MapContainer
        center={centerCoordinates}
        zoom={Zoom}
        style={{ width: "120%", height }}
        attributionControl={true}
        ref={mapRef}
      >
        <RecenterMap center={centerCoordinates} />
        <ResizeHandler />
        <LayersControl position="topleft">
          <BaseLayer checked name="Normal View">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          <BaseLayer name="Satellite View">
            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
          </BaseLayer>
        </LayersControl>
        {locations.map((loc, i) => {
          console.log(loc, "map loc");
          const [lat, lon] = getValidCoordinates(loc.latitude, loc.longitude);
          return (
            <Marker
              key={loc.stationId || i}
              position={[lat, lon]}
              icon={createCustomIcon(
                activeMarker === loc.stationId,
                loc.profileIcon,
                loc.profileColor
              )}
              eventHandlers={{
                click: () => fetchStationData(loc.stationId),
                ...(viewSummary && {
                  mouseover: () => {
                    setActiveMarker(loc.stationId);
                    setActiveStationId(loc.stationId);
                    setActiveProfileId(loc.profileId);
                  },
                  mouseout: () => {
                    setActiveMarker(null);
                    setActiveStationId(null);
                    setActiveProfileId(null);
                  },
                }),
              }}
            >
              <Tooltip direction="top" offset={[0, -30]} opacity={1}>
                <span>{loc.stationName}</span>
              </Tooltip>
              <Popup>
                {loading ? (
                  <ThreeDot color="#f58142" size="small" />
                ) : stationData.length > 0 ? (
                  <StationOverView
                    stations={stationData}
                    viewSummary={viewSummary}
                  />
                ) : (
                  <span className="text-danger">No Data found</span>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapEmbed;
