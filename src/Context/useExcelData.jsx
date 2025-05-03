// src/context/ExcelDataContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const ExcelDataContext = createContext();

// Create a provider component
export const ExcelDataProvider = ({ children }) => {
  const [excelData, setExcelData] = useState(null); // The global state

  // Function to update the global state with the Excel data
  const updateExcelData = (data) => {
    setExcelData(data);
  };

  return (
    <ExcelDataContext.Provider value={{ excelData, updateExcelData }}>
      {children}
    </ExcelDataContext.Provider>
  );
};

// Custom hook to consume the context
export const useExcelData = () => useContext(ExcelDataContext);
