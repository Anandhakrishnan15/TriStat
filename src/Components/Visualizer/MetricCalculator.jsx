// components/Visualizer/MetricCalculator.jsx

/**
 * Dynamically calculate key financial KPIs (total revenue, total expenses, profit, profit margin)
 * based on column names in the data.
 *
 * @param {Array<Object>} data - Array of data objects (e.g., parsed Excel/CSV rows)
 * @returns {Object} KPIs: { totalRevenue, totalExpenses, profit, profitMargin }
 */
export function calculateKPIs(data = []) {
  // Initialize totals
  let totalRevenue = 0;
  let totalExpenses = 0;

  if (!data.length) {
    return { totalRevenue, totalExpenses, profit: 0, profitMargin: 0 };
  }

  // Determine which keys correspond to revenue and expense categories
  const keys = Object.keys(data[0]);
  const revenueKeys = keys.filter((k) => /revenue|income/i.test(k));
  const expenseKeys = keys.filter(
    (k) => /expense|cost|loss/i.test(k) && !/gross profit margin/i.test(k)
  );

  // Sum values across all rows
  data.forEach((item) => {
    revenueKeys.forEach((key) => {
      const raw = item[key];
      const num = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num)) totalRevenue += num;
    });
    expenseKeys.forEach((key) => {
      const raw = item[key];
      const num = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num)) totalExpenses += num;
    });
  });

  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return { totalRevenue, totalExpenses, profit, profitMargin };
}
