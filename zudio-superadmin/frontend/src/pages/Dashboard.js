import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import "./Dashboard.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import MallMap from "../components/MallMap";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [expandedPaths, setExpandedPaths] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [expandedMalls, setExpandedMalls] = useState({});
  const toggleMall = (mallId) => {
    setExpandedMalls((prev) => ({
      ...prev,
      [mallId]: !prev[mallId],
    }));
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/dashboard/stats`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="loading">Loading...</p>;

  const chartData = [
    { name: "Malls", value: stats.totalMalls },
    { name: "Users", value: stats.totalUsers },
    { name: "Counters", value: stats.totalCounters },
  ];

  // Utility: toggle visibility for a path
  const toggleExpand = (path) => {
    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const allCounters = stats.mallCounters?.flatMap((mall) =>
    mall.counters.map((counter) => ({
      name: counter.name,
      userCount: counter.userCount,
      mallTitle: mall.mallTitle,
    }))
  );

  // Filter based on search
  const filteredCounters = allCounters.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mallTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by user count descending
  const sortedCounters = filteredCounters.sort(
    (a, b) => b.userCount - a.userCount
  );
  const filterMallCounters = (mallCounters) => {
    return mallCounters.filter((mall) => {
      const mallTitle = mall.mallTitle.toLowerCase();

      // get array of shop names safely, fallback to empty array
      const shopNames = mall.counters
        ? mall.counters.map((c) => c.name.toLowerCase())
        : [];

      const counterMatch = shopNames.some((name) =>
        name.includes(searchTerm.toLowerCase())
      );

      return mallTitle.includes(searchTerm.toLowerCase()) || counterMatch;
    });
  };

  const isExpanded = (path) => expandedPaths[path];

  const renderStreets = (streets) => (
    <div className="scroll-container">
      {Object.entries(streets).map(([street, count]) => (
        <div className="location-card street" key={street}>
          <h5>🏠 {street}</h5>
          <p>Counters: {count}</p>
        </div>
      ))}
    </div>
  );

  const renderCities = (cities) => (
    <div className="scroll-container">
      {Object.entries(cities).map(([city, streets]) => (
        <div className="location-card city" key={city}>
          <h4>🏙️ {city}</h4>
          {renderStreets(streets)}
        </div>
      ))}
    </div>
  );

  const renderStates = (states) => (
    <div className="scroll-container">
      {Object.entries(states).map(([state, cities]) => (
        <div className="location-card state" key={state}>
          <h3>🗺️ {state}</h3>
          {renderCities(cities)}
        </div>
      ))}
    </div>
  );

  const renderCountries = (countries) => (
    <div className="scroll-container">
      {Object.entries(countries).map(([country, states]) => (
        <div className="location-card country" key={country}>
          <h2>🌎 {country}</h2>
          {renderStates(states)}
        </div>
      ))}
    </div>
  );

  const filterLocations = (locations) => {
    const filtered = {};

    for (const [country, states] of Object.entries(locations)) {
      const filteredStates = {};

      for (const [state, cities] of Object.entries(states)) {
        const filteredCities = {};

        for (const [city, streets] of Object.entries(cities)) {
          const filteredStreets = {};

          for (const [street, count] of Object.entries(streets)) {
            const searchString =
              `${country} ${state} ${city} ${street}`.toLowerCase();
            if (searchString.includes(searchTerm)) {
              filteredStreets[street] = count;
            }
          }

          if (Object.keys(filteredStreets).length > 0) {
            filteredCities[city] = filteredStreets;
          }
        }

        if (Object.keys(filteredCities).length > 0) {
          filteredStates[state] = filteredCities;
        }
      }

      if (Object.keys(filteredStates).length > 0) {
        filtered[country] = filteredStates;
      }
    }

    return filtered;
  };




































  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src="https://cdn.pixabay.com/video/2020/10/15/52436-468806587_large.mp4"
          type="video/mp4"
        />
      </video>
      <div className="whole">
        <p
          style={{
            color: "white",
            position: "absolute",
            top: "5px",
            left: "20px",
            zIndex: "1",
            fontSize: "50px",
            fontFamily: "rajdhani",
            fontWeight: "900",
          }}
        >
          Zudio
        </p>
        {/* first section */}
        <div className="dashboard-container">
          {/* <h1 className="dashboard-heading">Dashboard For Zudio</h1> */}
          <h1 className="dashboard-heading">
            Records For Malls Users & Counters
          </h1>

          {/* Chart Section graph */}
          <div
            className="chart-container"
            style={{
              background: "#fff",
              margin: "20px",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.05)",
              // margin: "0 auto",
              width: "60vw",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                {/* <Legend /> */}
                <Bar
                  dataKey="value"
                  fill="#4A90E2"
                  barSize={50}
                  radius={[10, 10, 0, 0]}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fill: "#000", fontWeight: "bold" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stat Cards Section */}
          <div
            className="cards-container"
            style={{
              display: "flex",
              gap: "10px",
              width: "60vw",
              padding: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              // marginBottom: "40px",
            }}
          >
            <StatCard title="Total Malls" value={stats.totalMalls} />
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Total Counters" value={stats.totalCounters} />
          </div>

          <div className="circle">
            <div className="scroll-track">
              <div className="scroll-text">ZUDIO ZUDIO ZUDIO ZUDIO</div>
              <div className="scroll-text">ZUDIO ZUDIO ZUDIO ZUDIO</div>
            </div>
          </div>
        </div>

        {/* second section */}
        <div className="location-section">
          <h2 className="section-heading">
            Locations Of Zudio's Where Which Exist
          </h2>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search Country / State / City / Street"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="search-input"
            />
          </div>
        </div>

        {/*third part...............................................cart and counter wise user chart part */}
        <div className="leftright">
          <div className="location-hierarchy">
            {renderCountries(filterLocations(stats.locations.countries))}
          </div>

          {/* mall counters and users */}
          <div
            style={{
              width: "100%",
              height: "490px",
              maxWidth: "100%",
              paddingRight: "1.5rem",
              paddingTop: "1rem",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "rajdhani",
                marginTop: "1rem",
                fontSize: "clamp(1.2rem, 2vw, 2rem)",
              }}
            >
              🛍️ Counter-wise User Chart
            </h2>

            <ResponsiveContainer width="100%" height={530}>
              <BarChart
                data={sortedCounters}
                margin={{ top: 30, right: 30, left: 10, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  interval={0}
                  height={100}
                  tick={{ fontSize: 15 }}
                  textAnchor="end"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) => [`${value} users`, "Users"]}
                  labelFormatter={(label, payload) =>
                    `Counter: ${label}\nMall: ${payload[0]?.payload?.mallTitle}`
                  }
                />

                <Bar dataKey="userCount" fill="#00c49f" radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="mallTitle"
                    position="insideTop"
                    style={{
                      fill: "white",
                      fontSize: "14px",
                    }}
                  />
                  <LabelList
                    dataKey="userCount"
                    position="top"
                    formatter={(value) => `${value} users`}
                    style={{ fill: "white", fontSize: "14px" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* forth part */}
        <div className="whole-map">
          {stats.mallCounters && (
            <>
              <h2
                style={{
                  marginTop: "10px",
                  // marginBottom: "10px",
                  color: "white",
                  textAlign: "center",
                  fontFamily: "rajdhani",
                  fontSize: "2.4rem",
                }}
              >
                Mall Locations on Map
              </h2>
              <MallMap mallCounters={stats.mallCounters} />
            </>
          )}
        </div>
      </div>

      <style>{`
        .whole{
        backdrop-filter: blur(10px);
        width: 100vw;
        // background: linear-gradient( #78350f11, #78350f00);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        // background: #78350f11;
        }


        .dashboard-container {
          backdrop-filter: blur(5px);
          // background: gray;
          width: 100vw;
          padding-top: 15px;
          font-family: "rajdhani";
          // padding-top: 74px;
          margin-top: 74px;
          border-radius: 20px;
          margin-left: 20px;
          margin-right: 20px;
          margin-bottom: 20px;
        }

        .dashboard-heading {
          font-size: 2.4rem;
           font-family: "rajdhani";
          font-weight: bold;
            backdrop-filter: blur(5px);
           background: linear-gradient(90deg, rgba(0, 0, 0, 0.301), rgba(159, 159, 159, 0.334));
          margin-left: 20px;
          text-align: center;
          width: 60vw;
          color:rgb(255, 255, 255);
        }

        .cards-container {
          display: flex;
          gap: 20px;
          // width: 95%;
          padding: 10px 0px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .section-heading {
          font-size: 1.8rem;
          // margin-top: 10px;
          margin-bottom: 20px;
          color:rgb(255, 255, 255);
          text-align: center;
          font-family: "rajdhani";
        }

        .location-section {
          // background: gray;
          width: 100vw;
          margin: auto;
          backdrop-filter: blur(5px);
          border-radius: 20px;
          padding-top: 20px;
          padding-bottom: 20px;
          padding-right: 0px;
          padding-left: 0px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }

        .leftright{
        // background: gray;
        width: 100vw;
        border-radius: 20px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        }







        .location-hierarchy{
        padding: 10px;
        width: 67vw;
        }

        .location-hierarchy ul {
          list-style: none;
          padding-left: 20px;
        }

        .location-hierarchy li {
          margin: 8px 0;
        }

        .label {
          cursor: pointer;
          color: #333;
          transition: all 0.2s;
          display: inline-block;
          padding: 6px 8px;
          border-radius: 6px;
        }

        .label:hover {
          background-color: #f0f4fa;
        }

        .count {
          background-color: #e3f2fd;
          color: #0d47a1;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          margin-left: 5px;
        }

        .loading {
          text-align: center;
          font-size: 1.5rem;
          padding-top: 100px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cards-container {
            flex-direction: column;
            align-items: center;
          }
        }

        .search-bar-container {
        text-align: center;
        margin-top: 30px;
        width: 100%;
      }

      .search-input {
        width: 90%;
        // max-width: 800px;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
        color: white;
        background-color: transparent;
        outline: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        transition: 0.3s ease;
      }

      .search-input:focus {
        border-color: #007bff;
        box-shadow: 0 2px 8px rgba(0,123,255,0.2);
      }
        .scroll-container {
      display: flex;
      overflow-x: auto;
      gap: 16px;
      padding: 16px 0;
      scroll-snap-type: x mandatory;
      scroll-bar-width: none;
      ms-overflow-style: none;
    }

  
    /* Color-coded */

  

  .location-card {
      min-width: 170px;
      flex: 0 0 auto;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      scroll-snap-align: start;
      background: rgba(255, 255, 255, 0.12); /* translucent white */
      padding: 2px 20px;
      margin: 12px;
      color: #F1E6D8;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }



/* Accent borders for types */
.location-card.country {
  border-color: rgba(168, 168, 168, 0.76);
}

.location-card.state {
  border-color:rgba(168, 168, 168, 0.76);
}

.location-card.city {
  border-color: rgba(168, 168, 168, 0.76);
}

.location-card.street {
  border-color:rgba(168, 168, 168, 0.76);
}
    /* Text inside */
    .location-card h2,
    .location-card h3,
    .location-card h4,
    .location-card h5 {
      margin: 0 0 8px 0;
      font-weight: bold;
      color: white;
      font-family: "rajdhani";
    }

    .location-card p {
      margin: 0;
      font-size: 0.95rem;
      color: #444;
      color: white;
    }

    /* Scrollbar styling (optional) */
    .scroll-container::-webkit-scrollbar {
      height: 8px;
      scroll-bar-width: none;
      ms-overflow-style: none;
    }
    .scroll-container::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.2);
      border-radius: 4px;
      scroll-bar-width: none;
      ms-overflow-style: none;
    }

.mall-section{
width: 100%;
height: 32vh;
margin: 10px;
padding: 10px;
overflow-y: scroll;
scrollbar-width: none; /* For Firefox */
scrollbar-color: #ccc #f9f9f9; /* For Chrome and Safari */
}

.mall-card {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  background-color: #f9f9f9;
}

.mall-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  transition: color 0.3s;
}

.mall-title:hover {
  color: #007bff;
}

.counter-list-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, padding 0.3s;
  padding: 0 10px;
}

.counter-list-container.expanded {
  max-height: 500px; /* Enough height to show all items */
  padding: 10px;
}

.counter-list {
  list-style: none;
  padding: 6px 0;
  border-bottom: 1px solid #ddd;
}









.circle {
  width: 35vw;
  // height: 290px;
  height: 500px;
  border: 4px solid white;
  overflow: hidden;
  position: absolute;
  // border-top-right-radius: 50px;
  // border-bottom-right-radius: 50px;
  // padding: 20px;
  top: 16px;
  right: 0;
  margin-right: 20px;
  // background-color: #111;
  background-image: url("https://cdn.pixabay.com/photo/2017/07/31/11/33/people-2557483_960_720.jpg");
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.scroll-track {
  display: flex;
  white-space: nowrap;
  animation: scroll 70s linear infinite;
}

.scroll-text {
  font-size: 410px;
  color: white;
  font-family: "rajdhani";
  font-weight: bold;
  padding-right: 60px; /* small space between repeated blocks */
}

/* Scroll animation */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
      `}</style>
    </>
  );
};

export default Dashboard;
