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
          className="search-input"
        />
        {/* 🔢 Total Malls text*/}
        <div className="total-count">Total Zudio : {filteredShops.length}</div>

        {/* this is cards div */}
        <div
          style={{
            flexDirection: "row",
            overflowX: "auto",
            overflowY: "hidden",
            width: "95%",
            height: "74vh",
            gap: "60px",
            zIndex: "2",
            // background: "rgba(0, 0, 0, 0.58)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            position: "relative",
            padding: "20px",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          {filteredShops.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/branddashboard2/${shop._id}`)}
              style={{
                position: "relative",
                borderRadius: "15px",
                // width: "100%",
                minWidth: "750px",
                height: "500px",
                border: "1px solid white",
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
                    fontSize: "50px",
                    margin: "0 0 5px,",
                    fontFamily: "Rajdhani, sans-serif",
                  }}
                >
                  {shop.title}
                </h3>
                <p
                  style={{
                    fontSize: "24px",
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
  className="qr-bottom-button"
  onMouseEnter={(e) =>
    (e.target.style.transform = "skewX(-20deg) scale(1.1)")
  }
  onMouseLeave={(e) => (e.target.style.transform = "skewX(-20deg)")}
>
  QR-Code
</button>
       <button
  onClick={() => navigate("/dashboard")}
  className="dashboard-button"
>
  Dashboard
</button>

       <button
  onClick={() => navigate("/ownerdashboard")}
  className="edit-button"
  onMouseEnter={(e) =>
    (e.target.style.transform = "skewX(-20deg) scale(1.1)")
  }
  onMouseLeave={(e) => (e.target.style.transform = "skewX(-20deg)")}
>
  Switch To Edit Mode
</button>
       <button
  onClick={handleLogout}
  className="logout-button"
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

.edit-button {
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  position: fixed;
  left: 25px;
  bottom: 17px;
  font-family: 'Rajdhani', sans-serif;
  color: white;
  font-size: 15px;
  font-weight: bold;
  border: 1px solid rgb(255, 255, 255);
  background: transparent;
  transform: skewX(-20deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  transition: 0.3s;
  z-index: 3;
}

.qr-bottom-button {
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid rgb(255, 255, 255);
  cursor: pointer;
  position: fixed;
  left: 192px;
  bottom: 17px;
  color: white;
  font-size: 15px;
  font-weight: bold;
  background: transparent;
  transform: skewX(-20deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  transition: 0.3s;
  z-index: 3;
}

.dashboard-button {
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid rgb(255, 255, 255);
  cursor: pointer;
  position: fixed;
  left: 25px;
  bottom: 65px;
  color: white;
  font-size: 15px;
  font-weight: bold;
  background: transparent;
  transform: skewX(-20deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  transition: 0.3s;
  z-index: 3;
}


.logout-button {
  padding: 9px;
  transform: skewX(-18deg);
  background: rgba(231, 119, 115, 0.66);
  color: #fff;
  border: 1px solid rgb(255, 255, 255);
  position: fixed;
  left: 300px;
  bottom: 17px;
  font-size: 15px;
  z-index: 2;
  border-radius: 7px;
  cursor: pointer;
  margin-top: 10px;
}

/* ✅ Mobile View Media Query */
@media only screen and (max-width: 600px) {
  .edit-button {
    font-size: 12px;
    padding: 8px 12px;
    left: 10px;
    bottom: 10px;
  }
    .qr-bottom-button {
    font-size: 12px;
    padding: 8px 12px;
    left: 145px;
    bottom: 10px;
  }

  .dashboard-button {
    font-size: 12px;
    padding: 8px 12px;
    bottom: 55px;
    left: 10px;
  }

   .logout-button {
    font-size: 12px;
    bottom: 10px;
    left: 235px;
  }
}




    body{
    overflow: hidden;
    }
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

   .search-input {
  padding: 10px;
  width: 60%;
  margin-top: 20px;
  border-radius: 5px;
  color: white;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  background: transparent;
  font-size: 16px;
}

.total-count {
  text-align: center;
  padding: 20px 0;
  position: fixed;
  bottom: 1px;
  right: 20px;
  font-size: 38px;
  font-weight: bold;
  color: white;
  font-family: 'Rajdhani', sans-serif;
}

/* ✅ Mobile view ke liye width kam kar di */
@media only screen and (max-width: 693px) {
  .search-input {
    width: 90%;
    position: relative;
    top: 42px;
    z-index: 10;
    font-size: 14px;
  }

  .total-count {
  text-align: center;
  padding: 20px 0;
  position: fixed;
  bottom: 35px;
  right: 10px;
  font-size: 27px;
  z-index: 10;
  font-weight: bold;
  color: white;
  font-family: 'Rajdhani', sans-serif;
}
}




}`}</style>
    </>
  );
};

export default BrandDashboard;
