import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/transactions`, {
          params: { month, search, page, perPage },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [month, search, page, perPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions"
        value={search}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
              <td>{transaction.image}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text">
        <p>Page No : {page}</p>
        <p>Per Page : {perPage}</p>
      </div>

      <button
        className="prev"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={transactions.length < perPage}
      >
        Next
      </button>
    </div>
  );
};

export default TransactionTable;
// i can display the page number we have to edit
// i think that is not h1 because it should display the value also
// i will try aligning that bangaram u go talk to mom and come
//ok bangaram
// mmmm
//u try to put the p in a div and give display flex
// okay fine
//ok
