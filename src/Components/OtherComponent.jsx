// // src/components/OtherComponent.jsx
// import React from "react";
// import { useExcelData } from "../Context/useExcelData";
// import { Bar, Line, Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const OtherComponent = () => {
//   const { excelData } = useExcelData();

//   if (!excelData || excelData.length === 0) {
//     return <p>No data available</p>;
//   }

//   // Detect label key dynamically (e.g., "Year", "Product", "Month", etc.)
//   const firstRowKeys = Object.keys(excelData[0]);

//   const labelKey =
//     firstRowKeys.find(
//       (key) =>
//         key.toLowerCase().includes("year") ||
//         key.toLowerCase().includes("month") ||
//         key.toLowerCase().includes("product")
//     ) || firstRowKeys[0]; // fallback: first key

//   // Get all other keys except the label key
//   const dataCategories = firstRowKeys.filter((key) => key !== labelKey);

//   // Extract labels for X-axis
//   const labels = excelData.map((row) => row[labelKey]);

//   // Prepare datasets dynamically
//   const datasets = dataCategories.map((category) => {
//     const data = excelData.map((row) => {
//       const valueStr = row[category];
//       if (typeof valueStr === "string") {
//         // Convert $1,200,000 or 37.5% to number
//         const cleaned = parseFloat(valueStr.replace(/[^0-9.-]+/g, ""));
//         return isNaN(cleaned) ? 0 : cleaned;
//       }
//       return typeof valueStr === "number" ? valueStr : 0;
//     });

//     return {
//       label: category,
//       data,
//       backgroundColor: getRandomColor(),
//       borderColor: getRandomColor(),
//       borderWidth: 1,
//     };
//   });

//   // Chart Data
//   const chartData = {
//     labels,
//     datasets,
//   };

//   const commonOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "Company Data Visualization" },
//     },
//   };

//   function getRandomColor() {
//     const r = Math.floor(Math.random() * 256);
//     const g = Math.floor(Math.random() * 256);
//     const b = Math.floor(Math.random() * 256);
//     return `rgba(${r}, ${g}, ${b}, 0.5)`;
//   }

//   return (
//     <div className="p-4">
//       <h3 className="text-2xl font-semibold mb-4">Company Data Charts</h3>

//       <div className="mb-8">
//         <h4 className="text-xl mb-2">Bar Chart</h4>
//         <Bar
//           data={chartData}
//           options={{ ...commonOptions, title: { text: "Bar Chart" } }}
//         />
//       </div>

//       {/* Uncomment if you want Line Chart */}
//       {/* <div className="mb-8">
//         <h4 className="text-xl mb-2">Line Chart</h4>
//         <Line data={chartData} options={{ ...commonOptions, title: { text: "Line Chart" } }} />
//       </div> */}
//     </div>
//   );
// };

// export default OtherComponent;

import { Bar, Line, Pie } from "react-chartjs-2"; // Install chart.js and react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useExcelData } from "../Context/useExcelData"; // Your context hook

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  ArcElement
);

// 📦 Imports same as before...

const OtherComponent = () => {
  const { excelData } = useExcelData();

  if (!excelData || excelData.length === 0) return <p>No data available</p>;

  const firstRowKeys = Object.keys(excelData[0]);
  const labelKey = firstRowKeys.find(key =>
    key.toLowerCase().includes("year") ||
    key.toLowerCase().includes("month") ||
    key.toLowerCase().includes("date") ||
    key.toLowerCase().includes("product")
  ) || firstRowKeys[0];

  const numericCategories = firstRowKeys.filter(key => {
    if (key === labelKey) return false;
    return excelData.some(row => {
      const value = row[key];
      if (typeof value === "string") {
        const cleaned = parseFloat(value.replace(/[^0-9.-]+/g, ""));
        return !isNaN(cleaned);
      }
      return typeof value === "number";
    });
  });

  // 🧠 Quarter Grouping
 const isMonthOrDate = (value) => {
   if (value == null) return false;
   const lower = String(value).toLowerCase();
   return (
     lower.includes("jan") ||
     lower.includes("feb") ||
     lower.includes("mar") ||
     lower.includes("apr") ||
     lower.includes("may") ||
     lower.includes("jun") ||
     lower.includes("jul") ||
     lower.includes("aug") ||
     lower.includes("sep") ||
     lower.includes("oct") ||
     lower.includes("nov") ||
     lower.includes("dec") ||
     /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(lower)
   ); // Also fix: apply .test(lower)
 };

const getQuarter = (value) => {
  const str = String(value).toLowerCase();
  const monthMap = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };
  const month = Object.keys(monthMap).find((m) => str.includes(m));
  let monthNum = month ? monthMap[month] : null;

  if (!monthNum && /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(str)) {
    const parts = str.split("/");
    monthNum = parseInt(parts[0], 10);
  }

  if (monthNum >= 1 && monthNum <= 3) return "Q1";
  if (monthNum >= 4 && monthNum <= 6) return "Q2";
  if (monthNum >= 7 && monthNum <= 9) return "Q3";
  if (monthNum >= 10 && monthNum <= 12) return "Q4";
  return "Unknown";
};


  let labels = excelData.map(row => row[labelKey]);
  if (labels.every(label => isMonthOrDate(label))) {
    labels = labels.map(getQuarter);
  }

  // 🥧 Income vs Expense Detection
  const incomeFields = numericCategories.filter(key => key.toLowerCase().includes("income") || key.toLowerCase().includes("revenue"));
  const expenseFields = numericCategories.filter(key => key.toLowerCase().includes("expense") || key.toLowerCase().includes("cost") || key.toLowerCase().includes("loss"));

  const totalIncome = incomeFields.reduce((sum, key) => {
    return sum + excelData.reduce((subSum, row) => {
      let value = row[key];
      if (typeof value === "string") value = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      if (typeof value === "number") subSum += value;
      return subSum;
    }, 0);
  }, 0);

  const totalExpense = expenseFields.reduce((sum, key) => {
    return sum + excelData.reduce((subSum, row) => {
      let value = row[key];
      if (typeof value === "string") value = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      if (typeof value === "number") subSum += value;
      return subSum;
    }, 0);
  }, 0);

  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [{
      label: "Income vs Expenses",
      data: [totalIncome, totalExpense],
      backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      borderWidth: 1,
    }]
  };

  // 📈 Common Datasets
  const datasets = numericCategories.map((category) => {
    const data = excelData.map((row) => {
      let value = row[category];
      if (typeof value === "string") {
        value = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      }
      return typeof value === "number" ? value : 0;
    });

    return {
      label: category,
      data,
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    };
  });

  const commonOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const label = context.dataset.label || "";

            if (label.toLowerCase().includes("percent") || label.includes("%")) {
              return `${label}: ${value}%`;
            }
            if (label.toLowerCase().includes("income") || label.toLowerCase().includes("expense") || label.toLowerCase().includes("revenue")) {
              return `${label}: $${value.toLocaleString()}`;
            }
            return `${label}: ${value}`;
          }
        }
      },
      legend: { position: "top" },
      title: { display: false },
    },
  };

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }

  const rangeOptions = {
    ...commonOptions,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      ...commonOptions.plugins,
      title: { display: true, text: "Stacked Range Chart (Quarters if detected)" },
    },
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Smart Dashboard</h3>

      {datasets.length > 0 && (
        <>
          <div className="mb-8">
            <h4 className="text-xl mb-2">Bar Chart</h4>
            <Bar data={{ labels, datasets }} options={commonOptions} />
          </div>

          <div className="mb-8">
            <h4 className="text-xl mb-2">Line Chart</h4>
            <Line data={{ labels, datasets }} options={commonOptions} />
          </div>

          <div className="mb-8">
            <h4 className="text-xl mb-2">Stacked Range Chart</h4>
            <Bar data={{ labels, datasets }} options={rangeOptions} />
          </div>
        </>
      )}

      <div className="mb-8">
        <h4 className="text-xl mb-2">Income vs Expenses (Pie Chart)</h4>
        <Pie data={pieData} options={commonOptions} />
      </div>
    </div>
  );
};

export default OtherComponent;




