import React, { useState } from "react";
import ChartRenderer from "../Components/Visualizer/ChartRenderer"; // Custom chart renderer component
import { cleanData } from "../Components/Visualizer/DataCleaner"; // Function to clean data
import { calculateKPIs } from "../Components/Visualizer/MetricCalculator"; // Function to calculate KPIs
import ReportBuilder from "../Components/Visualizer/ReportBuilder"; // Function to generate the report
import useDarkMode from "../hooks/useDarkMode"; // Custom hook for toggling dark mode
import { exportToPDF } from "../utils/pdfExporter"; // Utility to export report to PDF
import Papa from "papaparse"; // Library for parsing CSV
import * as XLSX from "xlsx"; // SheetJS library for parsing Excel files

export default function VisualizeReport() {
  // State hooks for handling data input, cleaned data, and selected chart type
  const [dataInput, setDataInput] = useState("");
  const [cleanedData, setCleanedData] = useState([]);
  const [theme, toggleTheme] = useDarkMode(); // Dark mode toggle
  const [selectedChart, setSelectedChart] = useState("bar"); // Default chart type
  const [showTable, setShowTable] = useState(false);

  // console.log("this are the data ",cleanedData);
  
  // Handle submission of data from JSON input
  const handleDataSubmit = () => {
    try {
      const parsed = JSON.parse(dataInput); // Parse the JSON data
      const validData = cleanData(parsed); // Clean the parsed data
      setCleanedData(validData); // Set cleaned data into state
    } catch (error) {
      alert("Invalid JSON data! Please check your input.");
    }
  };

  // Export the report to PDF
  const handleExportPDF = () => {
    exportToPDF("This is your sample exported report!"); // You can later make this dynamic
  };

  // Handle file upload (CSV or Excel files)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // For CSV file
    if (file.name.endsWith(".csv")) {
      reader.onload = (evt) => {
        const csv = evt.target.result;
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data;
            setDataInput(JSON.stringify(parsedData, null, 2)); // Populate textarea with parsed data
          },
        });
      };
      reader.readAsText(file);
    }
    // For Excel file
    else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);
        setDataInput(JSON.stringify(parsedData, null, 2)); // Populate textarea with parsed data
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload CSV or Excel files.");
    }
  };

  // Calculate KPIs from cleaned data (e.g., amount)
  const kpis = calculateKPIs(cleanedData, "amount");

  // Chart rendering setup based on selected chart type
  const charts = [
    <ChartRenderer
      key="1"
      data={cleanedData}
      type={selectedChart}
      dataKey="category"
      valueKey="amount"
    />,
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Visualize Report</h1>
        <div className="flex gap-4">
          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded shadow"
          >
            Toggle {theme === "light" ? "Dark" : "Light"} Mode
          </button>

          {/* Export to PDF button */}
          <button
            onClick={handleExportPDF}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Textarea for pasting JSON data */}
      <textarea
        value={dataInput}
        onChange={(e) => setDataInput(e.target.value)}
        placeholder="Paste JSON data here..."
        className="w-full h-40 p-4 mb-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100"
      />

      <button
        onClick={() => setShowTable(!showTable)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded shadow"
      >
        {showTable ? "Hide Table" : "To Table"}
      </button>

      {/* File upload input for CSV or Excel files */}
      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        onChange={(e) => handleFileUpload(e)}
        className="mb-4"
      />

      <div className="flex gap-4 mb-6">
        {/* Submit data button */}
        <button
          onClick={handleDataSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded shadow"
        >
          Submit Data
        </button>

        {/* Select chart type */}
        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      {showTable && cleanedData.length > 0 && (
        <div className="overflow-auto mt-6 border border-gray-300 dark:border-gray-700 rounded">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {Object.keys(cleanedData[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {cleanedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {value?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Render the report if data is available */}
      {cleanedData.length > 0 ? (
        <ReportBuilder
          summary="Auto-generated analysis based on the provided data."
          kpis={kpis}
          charts={charts}
        />
      ) : (
        <div className="text-gray-600 dark:text-gray-400">
          Please paste your JSON data and click submit.
        </div>
      )}
    </div>
  );
}
