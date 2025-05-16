import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">📊 Admin Dashboard</h1>

      <div className="cards-container">
        <StatCard title="Total Malls" value={stats.totalMalls} />
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Counters" value={stats.totalCounters} />
        
      </div>

      <div className="location-section">
        <h2 className="section-heading">🌍 Shops by Location</h2>
        <div className="location-columns">
          <div className="location-block">
            <h4>Countries</h4>
            <ul>
              {Object.entries(stats.locations.countries).map(([key, val]) => (
                <li key={key}><strong>{key}</strong>: {val}</li>
              ))}
            </ul>
          </div>
          <div className="location-block">
            <h4>States</h4>
            <ul>
              {Object.entries(stats.locations.states).map(([key, val]) => (
                <li key={key}><strong>{key}</strong>: {val}</li>
              ))}
            </ul>
          </div>
          <div className="location-block">
            <h4>Cities</h4>
            <ul>
              {Object.entries(stats.locations.cities).map(([key, val]) => (
                <li key={key}><strong>{key}</strong>: {val}</li>
              ))}
            </ul>
          </div>
           <div className="location-block">
            <h4>Streets</h4>
            <ul>
              {Object.entries(stats.locations.streets).map(([key, val]) => (
                <li key={key}><strong>{key}</strong>: {val}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="counters-per-mall" style={{
        marginTop: '40px',
        backgroundColor: '#e8f0fe',
        borderRadius: '10px',
        padding: '20px'
      }}>
  
      </div>
      <style>{`.dashboard-container {
  padding: 40px;
  background: #f8f9fa;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', sans-serif;
}

.dashboard-heading {
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.cards-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.section-heading {
  font-size: 1.8rem;
  margin-top: 50px;
  margin-bottom: 20px;
  color: #444;
  text-align: center;
}

.location-section {
  background: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.location-columns {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 20px;
}

.location-block h4 {
  font-size: 1.2rem;
  color: #222;
  margin-bottom: 10px;
}

.location-block ul {
  list-style: none;
  padding-left: 0;
}

.location-block li {
  font-size: 1rem;
  padding: 5px 0;
  color: #555;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  padding-top: 100px;
}`}</style>
    </div>
  );
};

export default Dashboard;