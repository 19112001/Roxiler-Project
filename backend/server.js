const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ProductTransaction = require("./models/ProductTransaction");

const cors = require("cors");

const app = express();
const port = 3001;
app.use(cors());

app.use(bodyParser.json());

const dbUri = "mongodb://localhost:27017/product_transactions";
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/transactions", async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;
  const regex = new RegExp(search, "i");
  const dateFilter = new Date(`${month} 1, 2000`).getMonth();

  const filter = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter + 1] },
    $or: [{ title: regex }, { description: regex }],
  };

  try {
    const transactions = await ProductTransaction.find(filter)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API for statistics
app.get("/statistics", async (req, res) => {
  const { month } = req.query;
  const dateFilter = new Date(`${month} 1, 2000`).getMonth();

  try {
    const totalSales = await ProductTransaction.aggregate([
      {
        $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter + 1] } },
      },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const soldItemsCount = await ProductTransaction.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter + 1] },
      sold: true,
    });

    const unsoldItemsCount = await ProductTransaction.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter + 1] },
      sold: false,
    });

    res.json({
      totalSales: totalSales[0] ? totalSales[0].totalAmount : 0,
      soldItemsCount,
      unsoldItemsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API for bar chart
app.get("/bar-chart", async (req, res) => {
  const { month } = req.query;
  const dateFilter = new Date(`${month} 1, 2000`).getMonth();

  try {
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await ProductTransaction.countDocuments({
          $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter + 1] },
          price: {
            $gte: range.min,
            $lt: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max,
          },
        });

        return { range: range.range, count };
      })
    );

    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// API for pie chart (unique categories and the number of items in each category)
app.get("/category", async (req, res) => {
  const { month } = req.query;
  const dateFilter = new Date(`${month} 1, 2000`).getMonth() + 1;

  try {
    const categoryData = await ProductTransaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API for pie chart
app.get("/pie-chart", async (req, res) => {
  const { month } = req.query;
  const dateFilter = new Date(`${month} 1, 2000`).getMonth();

  try {
    const pieChartData = await ProductTransaction.aggregate([
      {
        $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, dateFilter + 1] } },
      },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch data from all the above APIs and combine the response
app.get("/combined-data", async (req, res) => {
  const { month } = req.query;

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:${port}/transactions`, { params: { month } }),
      axios.get(`http://localhost:${port}/statistics`, { params: { month } }),
      axios.get(`http://localhost:${port}/bar-chart`, { params: { month } }),
      axios.get(`http://localhost:${port}/pie-chart`, { params: { month } }),
    ]);

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
