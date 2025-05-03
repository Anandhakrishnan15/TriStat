import { Line } from "react-chartjs-2";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      pointBackgroundColor: "rgba(75,192,192,1)",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "nearest",
      intersect: false,
    },
  },
};

const MyChartComponent = () => {
  return <Line data={data} options={options} />;
};

export default MyChartComponent;
