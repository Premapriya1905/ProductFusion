import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// Mock API for sales data
const fetchSalesData = async (startDate, endDate, category) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const startTimestamp = startDate ? new Date(startDate).getTime() : new Date('2023-01-01').getTime();
  const endTimestamp = endDate ? new Date(endDate).getTime() : new Date().getTime();
  const days = Math.floor((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24));
  const data = [];
  const categories = ['Electronics', 'Clothing', 'Food', 'Books'];
  const selectedCategories = category ? [category] : categories;

  for (let i = 0; i <= days; i++) {
    const date = new Date(startTimestamp + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const dataPoint = { date: dateStr };

    selectedCategories.forEach(cat => {
      const baseValue = (date.getDay() + 1) * 100;
      const multiplier = categories.indexOf(cat) + 1;
      const randomFactor = ((date.getDate() + categories.indexOf(cat)) % 3) * 0.2 + 0.8;
      dataPoint[cat] = Math.round(baseValue * multiplier * randomFactor);
    });

    data.push(dataPoint);
  }

  return data;
};

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [summaryData, setSummaryData] = useState({
    totalSales: { Electronics: 0, Clothing: 0, Food: 0, Books: 0 },
    averageSales: { Electronics: 0, Clothing: 0, Food: 0, Books: 0 },
  });

  // Function to calculate summary statistics
  const calculateSummaryStats = (data) => {
    const totals = { Electronics: 0, Clothing: 0, Food: 0, Books: 0 };
    const averages = { Electronics: 0, Clothing: 0, Food: 0, Books: 0 };
    const categoryCount = { Electronics: 0, Clothing: 0, Food: 0, Books: 0 };

    data.forEach((item) => {
      Object.keys(totals).forEach((category) => {
        if (item[category]) {
          totals[category] += item[category];
          categoryCount[category]++;
        }
      });
    });

    Object.keys(averages).forEach((category) => {
      if (categoryCount[category] > 0) {
        averages[category] = (totals[category] / categoryCount[category]).toFixed(2);
      }
    });

    return { totalSales: totals, averageSales: averages };
  };

  const getCacheKey = () => `sales-data-${startDate}-${endDate}-${category}`;

  const loadSalesData = async () => {
    setLoading(true);
    setError(null);
    const cacheKey = getCacheKey();
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSalesData(parsed);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const data = await fetchSalesData(startDate, endDate, category);
      setSalesData(data);
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, category]);

  // Update summary statistics when salesData changes
  useEffect(() => {
    if (salesData.length > 0) {
      const stats = calculateSummaryStats(salesData);
      setSummaryData(stats);
    }
  }, [salesData]);

  const filteredData = salesData.filter(item => {
    if (category && !item.hasOwnProperty(category)) return false;
    return true;
  });

  return (
    <div className="dashboard-container">
      <h1>Sales Dashboard</h1>

      <div className="filters-container">
        <div>
          <label>Start Date:</label><br />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date:</label><br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Category:</label><br />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading data...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {/* Line Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {category
                  ? <Line type="monotone" dataKey={category} stroke="#8884d8" />
                  : ['Electronics', 'Clothing', 'Food', 'Books'].map((cat, idx) => (
                      <Line
                        key={cat}
                        type="monotone"
                        dataKey={cat}
                        stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][idx]}
                      />
                    ))
                }
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Electronics</th>
                  <th>Clothing</th>
                  <th>Food</th>
                  <th>Books</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>{item.Electronics}</td>
                    <td>{item.Clothing}</td>
                    <td>{item.Food}</td>
                    <td>{item.Books}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics Section */}
          <div className="summary-container">
            {Object.keys(summaryData.totalSales).map((category) => (
              <div key={category} className="summary-card">
                <h3>{category}</h3>
                <p>Total Sales: {summaryData.totalSales[category]}</p>
                <p>Average Sales: {summaryData.averageSales[category]}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
