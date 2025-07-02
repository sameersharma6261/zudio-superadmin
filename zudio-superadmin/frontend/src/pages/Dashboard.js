import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [mallInfo, setMallInfo] = useState([]);

  const locationTree = stats.locations?.countries || {};
  //   const calculateCounters = (location) => {
  //   if (typeof location === "number") return location; // street count
  //   return Object.values(location).reduce((sum, val) => sum + calculateCounters(val), 0);
  // };

  // its for pi-chart
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/dashboard/stats`
        ); // replace with actual endpoint
        const { totalMalls, totalUsers, totalCounters } = res.data;

        setData([
          { name: "Malls", value: totalMalls },
          { name: "Users", value: totalUsers },
          { name: "Counters", value: totalCounters },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMallInfo = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/dashboard/malls-info`
        );
        setMallInfo(res.data.mallDetails || []);
      } catch (err) {
        console.error("Error fetching mall info:", err);
      }
    };
    fetchMallInfo();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/dashboard/stats`;
        if (filterType !== "all" && filterValue) {
          url += `?type=${filterType}&value=${filterValue}`;
        }
        const res = await axios.get(url);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchStats();
  }, [filterType, filterValue]);

  if (!stats) return <p className="loading">Loading...</p>;

  const chartData = [
    { name: "Malls", value: stats.totalMalls },
    { name: "Users", value: stats.totalUsers },
    { name: "Counters", value: stats.totalCounters },
  ];

  const allCounters =
    stats.mallCounters?.flatMap((mall) =>
      mall.counters.map((counter) => ({
        name: counter.name,
        userCount: counter.userCount,
        mallTitle: mall.mallTitle,
      }))
    ) || [];

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

  const filterLocationTree = (tree, searchTerm) => {
    if (!searchTerm) return tree;

    const lowerSearch = searchTerm.toLowerCase();

    const result = {};

    for (const [country, states] of Object.entries(tree)) {
      const matchedStates = {};

      for (const [state, cities] of Object.entries(states)) {
        const matchedCities = {};

        for (const [city, streets] of Object.entries(cities)) {
          const matchedStreets = {};

          for (const [street, count] of Object.entries(streets)) {
            const fullPath =
              `${country} ${state} ${city} ${street}`.toLowerCase();
            if (fullPath.includes(lowerSearch)) {
              matchedStreets[street] = count;
            }
          }

          if (Object.keys(matchedStreets).length > 0) {
            matchedCities[city] = matchedStreets;
          }
        }

        if (Object.keys(matchedCities).length > 0) {
          matchedStates[state] = matchedCities;
        }
      }

      if (Object.keys(matchedStates).length > 0) {
        result[country] = matchedStates;
      }
    }

    return result;
  };

  const filteredTree = filterLocationTree(locationTree, searchTerm);

  const filteredMallInfo = mallInfo
    .map((mall) => {
      const filteredShops = mall.shopDetails.filter(
        (shop) =>
          shop.shopName.toLowerCase().includes(searchTerm) ||
          shop.description.toLowerCase().includes(searchTerm)
      );

      const matchesMall = mall.mallName.toLowerCase().includes(searchTerm);

      if (matchesMall || filteredShops.length > 0) {
        return {
          ...mall,
          shopDetails: matchesMall ? mall.shopDetails : filteredShops,
        };
      }

      return null;
    })
    .filter((mall) => mall !== null);
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
        <div
          className="dashboard-container"
          style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#333",
            margin: "0",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "15px",
              marginTop: "15px",
              color: "white",
              fontFamily: "rajdhani",
            }}
          >
            Dashboard For Zudio
          </h1>

          {/* Chart */}
          <div
            style={{
              // background: "red",
              width: "100vw",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "70vw",
                // background: "red",
                height: "320px",
                borderRadius: "10px",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00c49f" radius={[8, 8, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      style={{
                        fill: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* for all,day,month,year */}
              {filterType !== "all" && (
                <>
                  <input
                    type={
                      filterType === "day"
                        ? "date"
                        : filterType === "month"
                        ? "month"
                        : "number"
                    }
                    placeholder="Enter value"
                    onChange={(e) => setFilterValue(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      position: "relative",
                      bottom: "305px",
                      left: "70px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      minWidth: filterType === "year" ? "80px" : "150px",
                    }}
                  />
                  {filterType === "month" && (
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#888",
                        position: "relative",
                        bottom: "305px",
                        width: "80px",
                        padding: "4px 12px",
                        left: "70px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                    >
                      YYYY-MM
                    </p>
                  )}
                </>
              )}
              <select
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: "8px 12px",
                  marginLeft: "15px",
                  position: "relative",
                  bottom: "305px",
                  left: "60px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  minWidth: "120px",
                  cursor: "pointer",
                }}
              >
                <option value="all">All</option>
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div
              style={{
                width: "30vw",
                height: "280px",
                marginRight: "50px",
                background: "rgba(128, 128, 128, 0.527)",
                marginBottom: "50px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "rajdhani",
                  fontSize: "30px",
                  marginTop: "3px",
                }}
              >
                Overall Stats
              </h2>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    fill="#8884d8"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sorted/Filtered Results */}
          <div>
            {sortedCounters.length === 0 ? (
              <p style={{ textAlign: "center", color: "#777" }}>
                No matching counters found.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  overflowX: "auto", // ✅ allow horizontal scroll if needed
                  gap: "20px",
                  paddingTop: "20px",
                  scrollBehavior: "smooth",
                  flexWrap: "nowrap", // ✅ important for horizontal layout
                  width: "100%",
                }}
              >
                {sortedCounters.map((counter, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(128, 128, 128, 0.527)",
                      borderRadius: "12px",
                      padding: "15px 20px",
                      margin: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "default",
                      border: "1.5px solid #ccc",
                      color: "white",
                      minWidth: "300px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: "4px",
                        color: "#4A90E2",
                        fontSize: "19px",
                      }}
                    >
                      {counter.name}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: "white",
                        fontFamily: "rajdhani",
                      }}
                    >
                      Mall: <strong>{counter.mallTitle}</strong>
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: "white",
                        fontFamily: "rajdhani",
                      }}
                    >
                      Users: <strong>{counter.userCount}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>




        {/* second section */}
        <div className="location-section">
          <h2 className="section-heading">🛍️ Counter-wise User Chart</h2>
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
          {/* here is pichart ishi ka */}
          <div
            style={{
              width: "40%",
              maxWidth: "100%",
              paddingRight: "1.5rem",
              // marginTop: "2rem",
              background: "rgba(128, 128, 128, 0.527)",
              height: "340px",
              position: "relative",
              bottom: "43px",
              marginLeft: "15px",
              // paddingTop: "1rem",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "rajdhani",
                fontSize: "clamp(1.2rem, 2vw, 2rem)",
              }}
            >
              🥧 User Distribution by Counter
            </h2>

            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={sortedCounters}
                  dataKey="userCount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#00c49f"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {sortedCounters.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} users`, "Users"]}
                  labelFormatter={(label) => `Counter: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* here is second part */}
          <div
            style={{
              width: "90%",
              height: "490px",
              // background: "rgba(128, 128, 128, 0.527)",
              maxWidth: "100%",
              paddingRight: "1.5rem",
            }}
          >
            <ResponsiveContainer width="102%" height={570}>
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


        <div className="location-card-grid">
          {Object.entries(filteredTree).map(([country, states]) => {
            // const countryCount = calculateCounters(states);
            return (
              <div className="location-card" key={country}>
                <h2 className="card-title">
                  {/* 🌍 {country} — <span className="counter-count">{countryCount} Counters</span> */}
                  {/* 🌍 {country} — <span className="counter-count">Counters</span> */}
                  🌍 {country}
                </h2>
                {Object.entries(states).map(([state, cities]) => {
                  // const stateCount = calculateCounters(cities);
                  return (
                    <div className="state-block" key={state}>
                      <h3 className="state-title">
                        {/* 🏙️ {state} — <span className="counter-count">{stateCount} Counters</span> */}
                        {/* 🏙️ {state} — <span className="counter-count">Counters</span> */}
                        🏙️ {state}
                      </h3>
                      {Object.entries(cities).map(([city, streets]) => {
                        // const cityCount = calculateCounters(streets);
                        return (
                          <div className="city-block" key={city}>
                            <h4 className="city-title">
                              {/* 📌 {city} — <span className="counter-count">{cityCount} Counters</span> */}
                              {/* 📌 {city} — <span className="counter-count">Counters</span> */}
                              📌 {city}
                            </h4>
                            <div className="street-badges">
                              {Object.entries(streets).map(
                                ([street, count]) => (
                                  <div key={street} className="street-badge">
                                    {/* {street} - {count} Counter */}
                                    {street} - Counter
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mall-info-section">
          <div className="mall-cards">
            {filteredMallInfo.map((mall) => (
              <div className="mall-cardd" key={mall.mallId}>
                <h3>{mall.mallName}</h3>
                <ul>
                  {mall.shopDetails.map((shop) => (
                    <li key={shop.shopId}>
                      <strong>{shop.shopName}</strong>
                      <br />
                      <span>{shop.description}</span>
                      <br />
                      <a
                        href={`/${shop.shopId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Shop
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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



       <style>
          {`
        .mall-info-section {
        // padding: 0.2rem;
        background-color: rgba(183, 183, 183, 0.227);
        width: 100vw;
        position: relative;
        bottom: 160px;
      }

      .mall-info-section h2 {
        font-size: 1.8rem;
        // margin-bottom: 1rem;
        text-align: center;
        color: #333;
      }

      .mall-cards {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        align-item: center;
        justify-content: start;
        padding-left: 0.8rem;
        gap: 2.6rem;
        // padding-bottom: 1rem;
        scrollbar-width: thin;
        scrollbar-color: #ccc transparent;
      }

      .mall-cards::-webkit-scrollbar {
        height: 8px;
      }
      .mall-cards::-webkit-scrollbar-thumb {
        // background-color: #bbb;
        border-radius: 10px;
      }

      .mall-cardd {
        flex: 0 0 auto;
        width: 411px;
        background-color: rgba(183, 183, 183, 0.427);
        margin-top: 20px;
        margin-bottom: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        transition: transform 0.3s ease;
      }

      .mall-cardd:hover {
        transform: translateY(-5px);
      }

      .mall-cardd h3 {
        font-size: 1.4rem;
        margin-bottom: 0.2rem;
        color: rgb(74, 144, 226);
      }

      .mall-cardd p {
        font-size: 0.95rem;
        margin-bottom: 1rem;
        color: #666;
      }

      .mall-cardd ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .mall-cardd li {
        // margin-bottom: 0.5rem;
        border-top: 1px solid #eee;
        // padding-top: 0.5rem;
      }

      .mall-cardd strong {
        font-size: 1rem;
        color: white;
      }

      .mall-cardd span {
        font-size: 0.9rem;
        color: white;
      }

      .mall-cardd a {
        display: inline-block;
        margin-top: 4px;
        padding: 6px 12px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 0.85rem;
        transition: background-color 0.3s ease;
      }

      .location-card-grid{
      margin: 0;
      padding-top: 50px;
      padding-bottom: 50px;
      padding-left: 0;
      padding-right: 0;
      }

      .mall-cardd a:hover {
        background-color: #0056b3;
      }`}
        </style>

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
          display: flex;
          flex-direction: column;
          justify-content: start;
          // padding-top: 15px;
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
          // width: 80vw;
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
          // margin-top: 20px;
          backdrop-filter: blur(5px);
          border-radius: 20px;
          padding-top: 15px;
          // padding-bottom: 20px;
          padding-right: 0px;
          padding-left: 0px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }

        .leftright{
        // background: gray;
        width: 100vw;
        border-radius: 20px;
        // margin-top: 20px;
        display: flex;
        overflow: hidden;
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
        padding: 9px 16px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 0.8rem;
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

  
    .state-block{
      // background: red;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0;
    }

    .city-block{
     display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .street-badge{
     display: flex;
     margin: 0;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }


  .location-card {
      min-width: 170px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 150px;
      align-items: center;
      flex: 0 0 auto;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      scroll-snap-align: start;
      background: rgba(255, 255, 255, 0.12); /* translucent white */
      // padding: 30px 20px;
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
      margin: 0 0 2px 0;
      font-weight: bold;
      color: white;
      font-family: "rajdhani";
    }

     .location-card h2{
     margin-top: 20px;
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
