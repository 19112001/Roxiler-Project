import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/statistics`, {
          params: { month },
        });
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [month]);

  return (
    <div className="stat">
      <div>Total Sale Amount: {statistics.totalSales}</div>
      <div>Total Sold Items: {statistics.soldItemsCount}</div>
      <div>Total Not Sold Items: {statistics.unsoldItemsCount}</div>
    </div>
  );
};

export default Statistics;
