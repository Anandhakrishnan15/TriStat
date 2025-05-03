export default function 
ReportBuilder({ summary, kpis, charts }) {
  console.log("this is KPIS",kpis);
  
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Executive Summary
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{summary}</p>

      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Key Metrics
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(kpis).map(([key, value]) => (
          <div key={key} className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <div className="text-gray-600 dark:text-gray-300">{key}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ${value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">
        Visual Analysis
      </h2>
      <div className=" gap-6">{charts}</div>
    </div>
  );
}
