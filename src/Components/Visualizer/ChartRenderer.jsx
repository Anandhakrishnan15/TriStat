import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatTooltip } from "./TooltipFormatter";

// Colors for chart segments
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#D65DB1",
];


/**
 * Transforms raw tabular data into chart-friendly format.
 * Detects currency symbols and alerts the user.
 *
 * @param {Array<Object>} rawData - Array of objects from Excel or CSV.
 * @returns {Array<Object>} Transformed data for combined chart.
 */
const transformDataForCombinedChart = (rawData) => {
  if (!rawData || rawData.length === 0) return [];

  const keys = Object.keys(rawData[0]);
  const labelKey = keys[0]; // e.g., 'Product'

  if (!labelKey || labelKey.trim() === "" || labelKey === "__EMPTY") {
    alert(
      "Please rename the first column to a meaningful name (like 'Product')"
    );
    return [];
  }

  const chartData = [];

  // Get all categories (excluding the label key)
  const categories = keys.slice(1);

  categories.forEach((category) => {
    const entry = { category };

    rawData.forEach((row) => {
      const label = row[labelKey];
      const value = row[category];

      if (label && !isNaN(value)) {
        entry[label] = Number(value);
      }
    });

    chartData.push(entry);
  });

  return chartData;
};



export default function ChartRenderer({ data, type = "bar" }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  const chartDataCombined = transformDataForCombinedChart(data);
const productNames =
  chartDataCombined.length > 0
    ? Object.keys(chartDataCombined[0]).filter((key) => key !== "category")
    : [];

//  const Anualsales = data.map((product) => product["__EMPTY"]);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px 15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontSize: "14px",
          color:"black"
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: 8 }}>{label}</p>
        {payload.map((entry, index) => {
          const value = entry.value;
          const labelText = entry.name || "";

          let formattedValue;
          const lowerLabel = labelText.toLowerCase();
          if (lowerLabel.includes("percent") || labelText.includes("%")) {
            formattedValue = `${value}%`;
          } else if (
            lowerLabel.includes("income") ||
            lowerLabel.includes("expense") ||
            lowerLabel.includes("revenue")
          ) {
            formattedValue = `$${value.toLocaleString()}`;
          } else {
            formattedValue = value;
          }

          return (
            <div key={index} style={{ color: entry.color }}>
              {labelText}: <strong>{formattedValue}</strong>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
console.log( "this itbhe chat data combiner",chartDataCombined);
const selectedCategory = "Unit Price"; // Or make this dynamic via dropdown

const selectedCategoryRow = chartDataCombined.find(
  (row) => row.category === selectedCategory
);

const selectedCategoryData = selectedCategoryRow
  ? productNames.map((product) => ({
      name: product,
      value: selectedCategoryRow[product],
    }))
  : [];
  return (
    <div>
      <h2>Combined Product Sales Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        {type === "line" ? (
          <LineChart data={chartDataCombined}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {productNames.map((productName, index) => (
              <Line
                key={productName}
                type="monotone"
                dataKey={productName}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </LineChart>
        ) : type === "bar" ? (
          <BarChart data={chartDataCombined}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {productNames.map((productName, index) => (
              <Bar
                key={productName}
                dataKey={productName}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        ) : (
          // PIE CHART
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              dataKey="value"
              data={selectedCategoryData} // <-- prepare this separately
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {selectedCategoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>

      {/* Individual Product Charts */}
      {data.map((productData, index) => {
          const chartData = Object.entries(productData)
            .filter(([key]) => key !== "__EMPTY" && key !== "xLabel")
            .slice(1) // 👈 Skip the first data point
            .map(([month, value]) => ({
              month,
              value: Number(value),
            }));
        const renderChart = () => {
          if (type === "pie") {
            return (
              <PieChart width={400} height={300}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltip} />
              </PieChart>
            );
          }

          if (type === "line") {
            return (
              <LineChart width={500} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#00AEEF" />
              </LineChart>
            );
          }

          return (
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#00AEEF" />
            </BarChart>
          );
        };

        return (
          <div key={index} style={{ marginBottom: 50 }}>
            <h3>{productData["xLabel"]} Sales Data</h3>
            <ResponsiveContainer width="100%" height={300}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
