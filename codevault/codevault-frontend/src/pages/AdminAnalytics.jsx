import React from "react";

export default function AdminAnalytics() {
  const monthlyData = [
    { month: "Jan", users: 45, content: 120, revenue: 2400 },
    { month: "Feb", users: 52, content: 145, revenue: 2800 },
    { month: "Mar", users: 61, content: 168, revenue: 3200 },
    { month: "Apr", users: 75, content: 195, revenue: 3800 },
    { month: "May", users: 88, content: 220, revenue: 4200 },
    { month: "Jun", users: 95, content: 245, revenue: 4600 }
  ];

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">Analytics Dashboard</h2>
        <p className="hero-sub">Monitor platform performance, user engagement, and growth metrics.</p>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">12.5K</div>
          <div className="stat-label">Total Page Views</div>
          <div style={{ color: '#2ecc71', fontSize: '14px', marginTop: '8px' }}>↑ 15.3% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3.2K</div>
          <div className="stat-label">Active Users</div>
          <div style={{ color: '#2ecc71', fontSize: '14px', marginTop: '8px' }}>↑ 8.7% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">24.5%</div>
          <div className="stat-label">Engagement Rate</div>
          <div style={{ color: '#2ecc71', fontSize: '14px', marginTop: '8px' }}>↑ 3.2% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1.8K</div>
          <div className="stat-label">New Signups</div>
          <div style={{ color: '#2ecc71', fontSize: '14px', marginTop: '8px' }}>↑ 12.1% from last month</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Monthly Growth Trends</h3>
        </div>
        <div className="chart-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>New Users</th>
                <th>Content Uploads</th>
                <th>Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(item => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>{item.users}</td>
                  <td>{item.content}</td>
                  <td>${item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Top Content Categories</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Items</th>
              <th>Views</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Documentation</td>
              <td>324</td>
              <td>8,542</td>
              <td style={{ color: '#2ecc71' }}>↑ 18.2%</td>
            </tr>
            <tr>
              <td>Code Repositories</td>
              <td>289</td>
              <td>6,123</td>
              <td style={{ color: '#2ecc71' }}>↑ 12.5%</td>
            </tr>
            <tr>
              <td>Design Assets</td>
              <td>156</td>
              <td>4,891</td>
              <td style={{ color: '#f1c40f' }}>↑ 5.3%</td>
            </tr>
            <tr>
              <td>Tutorials</td>
              <td>87</td>
              <td>2,456</td>
              <td style={{ color: '#ff6b6b' }}>↓ 2.1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}