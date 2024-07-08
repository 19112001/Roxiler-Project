// src/App.js
import React, { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import "./App.css";
const App = () => {
  const [month, setMonth] = useState("March");

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <>
      <nav>
        <h1>
          Transactions
          <br /> Dashboard
        </h1>
      </nav>
      <div>
        <label>
          Select Month:
          <select value={month} onChange={handleMonthChange}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </label>

        <TransactionTable month={month} />
        <Statistics month={month} />
        <BarChart month={month} />
      </div>
    </>
  );
};

export default App;
