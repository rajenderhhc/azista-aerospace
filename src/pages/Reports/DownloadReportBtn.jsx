import React from "react";
import { LuFileDown } from "react-icons/lu";

const DownloadReportBtn = ({ length, downloadExcel }) => {
  return (
    <button
      className="btn btn-primary ms-4"
      disabled={length === 0}
      onClick={downloadExcel}
    >
      Download Report <LuFileDown />
    </button>
  );
};

export default DownloadReportBtn;
