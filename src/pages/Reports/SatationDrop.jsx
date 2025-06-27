import React from "react";
import Select from "react-select";

const StationDropdown = (props) => {
  // Convert profileStations to react-select format
  const {
    selectedStations,
    setSelectedStations,
    profileStations,
    stationError,
    setStationError,
  } = props;

  const options = profileStations.map((s) => ({
    value: s._id,
    label: `${s.stationId}-${s.stationName}`,
  }));

  // Custom Option with Checkboxes
  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;

    return (
      <div ref={innerRef} {...innerProps} className="custom-option ms-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => null} // Prevent React warnings
        />
        <label className="ms-2"> {data.label} </label>
      </div>
    );
  };

  return (
    <div className="me-3">
      <label className="label-primary" htmlFor="stationSelect">
        Select Station *
      </label>
      <div className="slect-drop-container">
        <Select
          id="stationSelect"
          options={options}
          value={options.filter((option) =>
            selectedStations.some((selected) => selected.value === option.value)
          )}
          onChange={(selectedOptions) => {
            setStationError(false);
            setSelectedStations(selectedOptions || []);
          }}
          isMulti
          isSearchable
          placeholder="Select stations..."
          components={{ Option: CustomOption }}
          closeMenuOnSelect={false} // ⬅️ Keeps dropdown open on selection
          hideSelectedOptions={false} // ⬅️ Allows reselecting options
          styles={{
            control: (base, state) => ({
              ...base,
              border: "none",
              outline: "none",
              boxShadow: state.isFocused ? "none" : base.boxShadow,
              minHeight: "1.9rem", // Adjust height here
              height: "1.9rem",
              overflow: "auto",
              scrollbarWidth: "none",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 1000,
              position: "absolute",
              width: "180%", // ensure same as control
            }),
          }}
        />
      </div>
      {stationError ? (
        <span className="text-danger">*please select stations</span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default StationDropdown;
