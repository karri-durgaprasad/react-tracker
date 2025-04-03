import React, { useState, useReducer } from "react";

const initialState = JSON.parse(localStorage.getItem("transactions")) || [];

const transactionReducer = (state, action) => {
  let updatedState;
  switch (action.type) {
    case "ADD":
      updatedState = [...state, action.payload];
      break;
    case "DELETE":
      updatedState = state.filter((_, index) => index !== action.payload);
      break;
    default:
      return state;
  }
  localStorage.setItem("transactions", JSON.stringify(updatedState));
  return updatedState;
};

const Dashboard = () => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const [details, setDetails] = useState({ type: "", description: "", amount: "", date: "" });
  const [filterDate, setFilterDate] = useState("");

  const handleInputChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.type || !details.description || !details.amount) return;
    dispatch({ type: "ADD", payload: details });
    setDetails({ type: "", description: "", amount: "", date: "" });
  };

  const handleDelete = (index) => dispatch({ type: "DELETE", payload: index });

  const calculateTotals = () => {
    return state.reduce(
      (totals, { type, amount, date }) => {
        if (filterDate && date !== filterDate) return totals;
        amount = parseFloat(amount) || 0;
        type === "Income" ? (totals.income += amount) : (totals.expense += amount);
        totals.balance = totals.income - totals.expense;
        return totals;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  };

  const { income, expense, balance } = calculateTotals();

  return (
    <div className="financial-tracker">
      <h1 className="text-center">Financial Tracker</h1>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit}>
        <select name="type" value={details.type} onChange={handleInputChange} required>
          <option value="">Select Type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input type="text" name="description" placeholder="Description" value={details.description} onChange={handleInputChange} required />
        <input type="number" name="amount" placeholder="Amount" value={details.amount} onChange={handleInputChange} required />
        <input type="date" name="date" value={details.date} onChange={handleInputChange} required />
        <button type="submit">Add</button>
      </form>

      {/* Date Filter */}
      <input type="date" onChange={(e) => setFilterDate(e.target.value)} />

      {/* Summary */}
      <div className="summary">
        <h3>Summary</h3>
        <p>Total Income: ${income.toFixed(2)}</p>
        <p>Total Expense: ${expense.toFixed(2)}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
      </div>

      {/* Transaction List */}
      {/* Transaction List */}
<h3>Transaction History</h3>
<ul style={{ listStyle: "none", padding: 0 }}>
  {state
    .filter(({ date }) => !filterDate || date === filterDate)
    .map(({ type, description, amount, date }, index) => (
      <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #ccc" }}>
        <span>
          {type} - {description} - ${amount} on {date}
        </span>
        <button 
          onClick={() => handleDelete(index)} 
          style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "5px" }}
        >
          Delete
        </button>
      </li>
    ))}
</ul>
    </div>
  );
};

export default Dashboard;
