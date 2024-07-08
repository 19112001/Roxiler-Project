import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const intialState = {
  lable: [],
  datasets: [],
};

const BarChart = ({ month = "march" }) => {
  const [chartData, setChartData] = useState(intialState);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/bar-chart", {
        params: { month },
      })
      .then(({ data }) => {
        // console.log('aa',data);
        const cData = {
          labels: (data || []).map(({ range }) => range),
          backgroundColor: "#6bacf2",
          datasets: [
            {
              label: "Sales",
              data: (data || []).map(({ count }) => count),
              backgroundColor: "aqua",

              borderColor: "rgba(75, 192, 192, 1)",

              borderWidth: 1,
            },
          ],
        };
        setChartData(cData);
      });
  }, [month]);

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
