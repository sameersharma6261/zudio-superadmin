import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BrandDashboard = () => {
  const [shops, setFoods] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const shopId = localStorage.getItem("shopId");
  console.log("User's Shop ID:", shopId);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("shopId");
    navigate("/");
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/shops`)
      .then((res) => setFoods(res.data));
  }, []);

  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role && role !== "superadmin") {
      navigate("/");
    }
  }, [role, navigate]);

  const filteredShops = shops.filter((shop) => {
    return shop.title?.toLowerCase().includes(search.toLowerCase());
  });

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
      <div
        style={{
          position: "absolute",
          left: 0,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "transparent",
          fontFamily: "Arial, sans-serif",
          zIndex: "1",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "48px",
            fontFamily: "Rajdhani, sans-serif",
            position: "absolute",
            left: "20px",
            top: "10px",
            zIndex: "200",
          }}
        >
          zudio
        </h1>
        <input
          type="text"
          placeholder="Search Zudio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "60%",
            marginTop: "20px",
            borderRadius: "5px",
            color: "white",
            border: "1px solid #ccc",
            marginBottom: "20px",
            background: "transparent",
            fontSize: "16px",
          }}
        />

        {/* this is cards div */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
            height: "78vh",
            // background: "red",
            overflowY: "auto",
            gap: "60px",
            zIndex: "2",
            position: "relative",
            padding: "20px",
          }}
        >
          {/* 🔢 Total Malls text*/}
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              position: "fixed",
              bottom: "1px",
              right: "20px",
              fontSize: "30px",
              fontWeight: "bold",
              color: "white",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            Total Zudio : {filteredShops.length}
          </div>
          {filteredShops.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/branddashboard2/${shop._id}`)}
              style={{
                position: "relative",
                borderRadius: "15px",
                width: "100%",
                maxWidth: "800px",
                height: "450px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={shop.image}
                alt={shop.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  fontFamily: "Rajdhani, sans-serif",
                  filter: "brightness(70%)",
                  transition: "filter 0.3s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  padding: "20px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                  color: "white",
                  textAlign: "left",
                }}
              >
                <h3
                  style={{
                    fontSize: "29px",
                    margin: "0 0 5px,",
                    fontFamily: "Rajdhani, sans-serif",
                  }}
                >
                  {shop.title}
                </h3>
                <p
                  style={{
                    fontSize: "20px",
                    opacity: 0.9,
                    fontFamily: "Rajdhani, sans-serif",
                  }}
                >
                  {shop.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/qrcode")}
          style={{
            padding: "10px 15px",
            borderRadius: "10px",
            border: " 1px solid rgb(255, 255, 255)",
            cursor: "pointer",
            position: "fixed",
            left: "192px",
            bottom: "17px",
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
            background: "transparent",
            transform: "skewX(-20deg)", // Parallelogram effect
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Depth effect
            backdropFilter: "blur(5px)", // Glassmorphism effect
            transition: "0.3s",
            zIndex: "3",
          }}
          onMouseEnter={(e) =>
            (e.target.style.transform = "skewX(-20deg) scale(1.1)")
          }
          onMouseLeave={(e) => (e.target.style.transform = "skewX(-20deg)")}
        >
          QR-Code
        </button>

        <button
          onClick={() => navigate("/ownerdashboard")}
          style={{
            padding: "10px 15px",
            borderRadius: "10px",
            cursor: "pointer",
            position: "fixed",
            left: "25px",
            fontFamily: "Rajdhani, sans-serif",
            bottom: "17px",
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
            border: " 1px solid rgb(255, 255, 255)",
            background: "transparent",
            // background: "linear-gradient(to right, #4facfe, #00f2fe)",
            transform: "skewX(-20deg)", // Parallelogram effect
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Depth effect
            backdropFilter: "blur(5px)", // Glassmorphism effect
            transition: "0.3s",
            zIndex: "3",
          }}
          onMouseEnter={(e) =>
            (e.target.style.transform = "skewX(-20deg) scale(1.1)")
          }
          onMouseLeave={(e) => (e.target.style.transform = "skewX(-20deg)")}
        >
          Switch To Edit Mode
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "9px",
            transform: "skewX(-18deg)", // Parallelogram effect
            background: "rgba(231, 119, 115, 0.66)",
            color: "#fff",
            border: " 1px solid rgb(255, 255, 255)",
            position: "fixed",
            left: "300px",
            bottom: "17px",
            fontSize: "15px",
            zIndex: "2",
            borderRadius: "7px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Logout
        </button>
      </div>

      <div className="scroller-container">
        <div className="scroller-wrapper">
          <div className="scroller">
            <span>ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;</span>
            <span>ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;</span>
          </div>
        </div>
      </div>
      <style>{`
    body{
    overflow: hidden;}
    .scroller-container {
      height: 100vh;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      // background: #111;
      backdrop-filter: blur(7px);
    }

    .scroller-wrapper {
      width: 100%;
      min-height: 50vh;
       margin-top: 50px;
      overflow: hidden;
      display: flex;
      align-items: center;
    }

    .scroller {
      display: flex;
      white-space: nowrap;
      animation: scroll-left 90s linear infinite;
    }

    /* Full-height left and right fade */
    .scroller-container::before,
    .scroller-container::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 200px;
      z-index: 2;
    }

    .scroller-container::before {
      left: 0;
      background: linear-gradient(to right, #111 0%, transparent 100%);
    }

    .scroller-container::after {
      right: 0;
      background: linear-gradient(to left, #111 0%, transparent 100%);
    }

    .scroller span {
      font-family: 'Rajdhani', sans-serif;
      font-size: 58rem;
      font-weight: 700;
      opacity: 0.7;
      background: linear-gradient(90deg,rgb(255, 255, 255), #3498db, #1abc9c,rgb(255, 255, 255));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: 5px;
    }

    @keyframes scroll-left {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-50%);
      }
    }
}`}</style>
    </>
  );
};

export default BrandDashboard;
