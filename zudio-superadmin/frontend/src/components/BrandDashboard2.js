import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BrandDashboard2 = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/shops/${id}`)
      .then((res) => setShop(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("shopId");
    navigate("/");
  };

  if (!shop)
    return (
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Loading...</h2>
    );

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
            backdrop-filter: blur(8px);
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
            background: linear-gradient(90deg,rgb(255, 255, 255),rgb(31, 91, 131), #1abc9c,rgb(255, 255, 255));
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          minHeight: "100vh",
          gap: "20px",
          position: "absolute",
          left: "0",
          top: "0",
          background: "transparent",
          zIndex: "1",
          // padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flex: "1 1 100%",
            // backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            padding: "10px",
            width: "100vw",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              padding: "10px 0",
              position: "fixed",
              bottom: "1px",
              right: "20px",
              fontSize: "30px",
              fontWeight: "bold",
              color: "white",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            {shop?.title}
          </h1>

          {shop.menuItems && shop.menuItems.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                justifyContent: "center",
                height: "100vh",
                overflowX: "auto",
                alignItems: "center",
                padding: "10px 0",
                zIndex: "3",
              }}
            >
              {shop.menuItems.map((menuItem, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (menuItem.link) {
                      localStorage.removeItem("token");
                      // window.open(`/?callbackUrl=${menuItem._id}`, "_blank");  aise karne se hum new page pe jainge
                      window.open(`/?callbackUrl=${menuItem._id}`);
                    }
                  }}
                  style={{
                    width: "800px",
                    height: "500px",
                    border: "1px solid white",
                    borderRadius: "15px",
                    overflow: "hidden",
                    position: "relative",
                    cursor: menuItem.link ? "pointer" : "default",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector("img").style.transform =
                      "scale(1.1)";
                    e.currentTarget.querySelector(
                      ".overlay"
                    ).style.backdropFilter = "blur(0px)";
                    e.currentTarget.querySelector(".overlay").style.background =
                      "rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector("img").style.transform =
                      "scale(1)";
                    e.currentTarget.querySelector(
                      ".overlay"
                    ).style.backdropFilter = "blur(6px)";
                    e.currentTarget.querySelector(".overlay").style.background =
                      "rgba(0, 0, 0, 0.4)";
                  }}
                >
                  {menuItem.image && (
                    <img
                      src={menuItem.image}
                      alt={menuItem.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  )}

                  <div
                    className="overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(6px)",
                      transition: "all 0.5s ease",
                      color: "white",
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: "32px",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {menuItem.name}
                      </h2>
                      <p
                        style={{
                          fontSize: "18px",
                          lineHeight: "1.5",
                          maxWidth: "600px",
                          margin: "0 auto",
                        }}
                      >
                        {menuItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "white",
                marginTop: "10px",
                fontSize: "18px",
              }}
            >
              No menu items added yet.
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "9px",
            transform: "skewX(-18deg)", // Parallelogram effect
            background: "rgba(231, 119, 115, 0.66)",
            color: "#fff",
            border: " 1px solid rgb(255, 255, 255)",
            position: "fixed",
            left: "25px",
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
    </>
  );
};

export default BrandDashboard2;
