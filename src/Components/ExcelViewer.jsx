// src/components/ExcelViewer.js
import React, { useState } from "react";
import * as XLSX from "xlsx"; // For reading Excel files
import { useExcelData } from "../Context/useExcelData"; // Import the custom hook

const ExcelViewer = () => {
  const [fileName, setFileName] = useState(""); // To store the file name

  // Access the global state and updater function
  const { excelData, updateExcelData } = useExcelData();

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });

        // Assuming the data is in the first sheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Update the global state with the parsed data
        updateExcelData(jsonData);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Please upload a valid Excel file.");
    }
  };

  return (
    <div className="excel-viewer-container">
      <h2>Upload Excel Sheet to View Data</h2>

      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {fileName && (
          <p className="mt-2 text-lg text-gray-800">
            Uploaded File: <span className="font-semibold">{fileName}</span>
          </p>
        )}
      </div>

      {/* Display the global Excel data */}
      {excelData && (
        <div className="mt-4">
          <h3>Excel Data in JSON Format</h3>
          <pre className="bg-gray-100 p-4 rounded-lg">
            {JSON.stringify(excelData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ExcelViewer;
