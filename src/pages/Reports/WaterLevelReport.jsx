import React, { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadReportBtn from "./DownloadReportBtn";

// Button component to handle download
// const DownloadReportBtn = ({ length, downloadExcel }) => (
//   <button
//     onClick={downloadExcel}
//     disabled={length === 0}
//     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//   >
//     Download Excel
//   </button>
// );

// Reusable row component
const TableRow = ({ row }) => (
  <tr key={row.srNo}>
    <td className="border px-2 py-1">{row.srNo}</td>
    <td className="border px-2 py-1">{row.nameOfStation}</td>
    <td className="border px-2 py-1">{row.district}</td>
    <td className="border px-2 py-1">{row.zone || "--"}</td>
    <td className="border px-2 py-1">{row.riverBasin || "--"}</td>
    <td className="border px-2 py-1">{row.hydraulicDetails?.mddl || "--"}</td>
    <td className="border px-2 py-1">{row.hydraulicDetails?.frl || "--"}</td>
    <td className="border px-2 py-1">
      {row.hydraulicDetails?.capacity || "--"}
    </td>
    <td className="border px-2 py-1">{row.currentData?.Date || "--"}</td>
    <td className="border px-2 py-1">{row.currentData?.Time || "--"}</td>
    <td className="border px-2 py-1">
      {row.currentData?.["Water Level (m)"] || "--"}
    </td>
  </tr>
);

const WaterLevelReport = () => {
  const tableRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  // Sample data
  const data = [
    {
      srNo: 1,
      stationId: "BDC00001",
      nameOfStation: "Ajwa Sarovar",
      district: "Vadodara",
      hydraulicDetails: { mddl: "95.05", frl: "100.00", capacity: "19.81" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:30",
        "Water Level (m)": "--",
      },
    },
    {
      srNo: 2,
      stationId: "BDC00002",
      nameOfStation: "Sayaji Sarovar",
      district: "Vadodara",
      hydraulicDetails: { mddl: "90.00", frl: "98.00", capacity: "30.12" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:30",
        "Water Level (m)": "97.80",
      },
    },
    {
      srNo: 3,
      stationId: "BDC00003",
      nameOfStation: "Kashipura",
      district: "Anand",
      hydraulicDetails: { mddl: "88.00", frl: "95.50", capacity: "15.80" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:00",
        "Water Level (m)": "92.30",
      },
    },
    {
      srNo: 4,
      stationId: "BDC00004",
      nameOfStation: "Mahi Dam",
      district: "Panchmahal",
      hydraulicDetails: { mddl: "102.00", frl: "110.00", capacity: "60.00" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:00",
        "Water Level (m)": "105.90",
      },
    },
    {
      srNo: 5,
      stationId: "BDC00005",
      nameOfStation: "Panam Reservoir",
      district: "Dahod",
      hydraulicDetails: { mddl: "80.00", frl: "90.00", capacity: "22.50" },
      currentData: {
        Date: "26/06/2025",
        Time: "13:45",
        "Water Level (m)": "86.10",
      },
    },
    {
      srNo: 6,
      stationId: "BDC00006",
      nameOfStation: "Kadana Dam",
      district: "Mahisagar",
      hydraulicDetails: { mddl: "110.00", frl: "120.00", capacity: "100.00" },
      currentData: {
        Date: "26/06/2025",
        Time: "13:30",
        "Water Level (m)": "114.55",
      },
    },
    {
      srNo: 7,
      stationId: "BDC00007",
      nameOfStation: "Karjan Reservoir",
      district: "Vadodara",
      hydraulicDetails: { mddl: "70.00", frl: "78.50", capacity: "17.90" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:15",
        "Water Level (m)": "77.00",
      },
    },
    {
      srNo: 8,
      stationId: "BDC00008",
      nameOfStation: "Ukai Dam",
      district: "Tapi",
      hydraulicDetails: { mddl: "152.00", frl: "170.00", capacity: "250.00" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:00",
        "Water Level (m)": "162.35",
      },
    },
    {
      srNo: 9,
      stationId: "BDC00009",
      nameOfStation: "Hathmati Dam",
      district: "Aravalli",
      hydraulicDetails: { mddl: "82.00", frl: "90.00", capacity: "35.00" },
      currentData: {
        Date: "26/06/2025",
        Time: "13:50",
        "Water Level (m)": "88.45",
      },
    },
    {
      srNo: 10,
      stationId: "BDC00010",
      nameOfStation: "Dantiwada Dam",
      district: "Banaskantha",
      hydraulicDetails: { mddl: "92.00", frl: "98.00", capacity: "45.60" },
      currentData: {
        Date: "26/06/2025",
        Time: "14:10",
        "Water Level (m)": "94.20",
      },
    },
  ];

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "WaterLevelSummaryReport",
    sheet: `WaterLevel_${new Date().toISOString().split("T")[0]}`,
  });

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="d-flex flex-column">
      <div className="d-flex mb-2 justify-content-between align-items-center">
        <span>Showing {data.length} Records</span>
        <DownloadReportBtn length={data.length} downloadExcel={onDownload} />
      </div>

      <div className="report-table-container">
        <table
          ref={tableRef}
          className="min-w-full border border-gray-300 report-table"
          style={{ minWidth: "100%" }}
        >
          <thead className="reports-header">
            <tr>
              <th rowSpan={2} className="border px-2 py-1">
                Sr. No.
              </th>
              <th rowSpan={2} className="border px-2 py-1">
                Name of the Stations
              </th>
              <th rowSpan={2} className="border px-2 py-1">
                District
              </th>
              <th rowSpan={2} className="border px-2 py-1">
                Zone
              </th>
              <th rowSpan={2} className="border px-2 py-1">
                River Basin
              </th>
              <th colSpan={3} className="border px-2 py-1">
                Hydraulic Details
              </th>
              <th colSpan={3} className="border px-2 py-1">
                Current Data
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1">MDDL (m)</th>
              <th className="border px-2 py-1">FRL (m)</th>
              <th className="border px-2 py-1">Live Capacity (Mcum)</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Level (m)</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row) => <TableRow key={row.srNo} row={row} />)
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex align-self-end justify-end mt-2  space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 mx-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WaterLevelReport;
