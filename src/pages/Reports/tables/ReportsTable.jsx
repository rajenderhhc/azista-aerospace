import React, { useState } from "react";

import Pagination from "./Pagination";
import DownloadReportBtn from "../DownloadReportBtn";

import "../reports.css";

const WeatherTable = ({ data, fileName, selectDateType }) => {
  const [rowsChecked, setRowsChecked] = useState(false);
  const [rows, setRows] = useState(
    data.map((r) => ({ ...r, isChecked: false }))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || data.length === 0) return <p>No data available</p>;

  const sensorNames = Array.from(
    new Set(data.flatMap((entry) => Object.keys(entry.rowData || {})))
  );
  const headers = ["Time", "StationId", ...sensorNames];

  const downloadCSV = () => {
    const selectedRows = rows.filter((row) => row.isChecked);
    const exportData = selectedRows.length > 0 ? selectedRows : rows;

    if (exportData.length === 0) return;

    const csvContent = [
      headers.join(","),
      ...exportData.map((item) =>
        headers
          .map((key) => {
            if (key === "Time") {
              return item["dateTime"];
            } else if (key === "StationId") {
              return item["stationId"];
            } else {
              return item?.rowData?.[key] || "N/A";
            }
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onChangeRowsSelected = (e) => {
    const { checked } = e.target;
    setRowsChecked(checked);
    setRows(rows.map((r) => ({ ...r, isChecked: checked })));
  };

  const onChangeSingleRowSelected = (e, index) => {
    const { checked } = e.target;
    const updatedRows = rows.map((r, i) =>
      i === index ? { ...r, isChecked: checked } : r
    );
    setRows(updatedRows);
    setRowsChecked(updatedRows.every((r) => r.isChecked));
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="d-flex flex-column">
      <div className="d-flex mb-1 justify-content-between align-items-center">
        <span>Showing {data.length} Records</span>
        <DownloadReportBtn disable={data.length} downloadExcel={downloadCSV} />
      </div>
      <div
        className="report-table-container"
        style={{ maxHeight: selectDateType === "custom" ? "54vh" : "60vh" }}
      >
        <table
          className="min-w-full border border-gray-300 report-table"
          style={{ minWidth: "100%" }}
        >
          <thead className="reports-header">
            <tr className="bg-gray-200">
              <th className="border p-2">
                <input
                  type="checkbox"
                  checked={rowsChecked}
                  onChange={onChangeRowsSelected}
                />
              </th>
              {headers.map((header) => (
                <th key={header} className="border p-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((entry, index) => (
              <tr key={index} className="border">
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={entry.isChecked}
                    onChange={(e) => onChangeSingleRowSelected(e, index)}
                  />
                </td>
                <td className="border p-2">{entry.dateTime}</td>
                <td className="border p-2">{entry.stationId}</td>
                {sensorNames.map((sensor) => (
                  <td key={sensor} className="border p-2">
                    {entry.rowData?.[sensor] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <Pagination
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default WeatherTable;
