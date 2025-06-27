import React from "react";
import ProfileDropdown from "../ProfilesDrop";
import StationDropdown from "../SatationDrop";
import SelectDateRange from "../../../components/SelectDateRange";

const GeneralFilters = ({
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
}) => (
  <>
    <div className="col-12 col-md-2 mb-2">
      <ProfileDropdown
        selectedProfile={selectedProfile}
        onChangeProfile={onChangeProfile}
        profileDetailsList={profileDetailsList}
      />
    </div>
    <div className="col-12 col-md-3 mb-2">
      <StationDropdown
        selectedStations={selectedStations}
        setSelectedStations={setSelectedStations}
        profileStations={profileStations}
        stationError={stationError}
        setStationError={setStationError}
      />
    </div>
    <div
      className={`col-12 ${
        selectDateType === "custom" ? "col-md-4" : "col-md-2"
      }`}
    >
      <label className="label-primary" htmlFor="dateSelect">
        Select Date *
      </label>
      <SelectDateRange
        handleCustomRangeDate={handleCustomRangeDate}
        setSelectedDateType={setSelectedDateType}
        selectDateType={selectDateType}
      />
    </div>
  </>
);

export default GeneralFilters;
