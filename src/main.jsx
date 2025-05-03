import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ExcelDataProvider } from './Context/useExcelData.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExcelDataProvider>
      <App />
    </ExcelDataProvider>
  </StrictMode>
);
