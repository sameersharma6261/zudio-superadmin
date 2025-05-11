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
        zIndex: "1",
        // padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: "1 1 100%",
          backdropFilter: "blur(10px)",
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
            color: "white",
            fontSize: "32px",
            marginBottom: "10px",
            marginTop: "10px",
            zIndex: "5",
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
      borderRadius: "15px",
      overflow: "hidden",
      position: "relative",
      cursor: menuItem.link ? "pointer" : "default",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.querySelector("img").style.transform = "scale(1.1)";
      e.currentTarget.querySelector(".overlay").style.backdropFilter = "blur(0px)";
      e.currentTarget.querySelector(".overlay").style.background = "rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.querySelector("img").style.transform = "scale(1)";
      e.currentTarget.querySelector(".overlay").style.backdropFilter = "blur(6px)";
      e.currentTarget.querySelector(".overlay").style.background = "rgba(0, 0, 0, 0.4)";
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
        <h2 style={{ fontSize: "32px", marginBottom: "10px", fontWeight: "bold" }}>
          {menuItem.name}
        </h2>
        <p style={{ fontSize: "18px", lineHeight: "1.5", maxWidth: "600px", margin: "0 auto" }}>
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
          padding: "12px",
          background: "#ff4d4d",
          color: "#fff",
          border: "none",
          position: "fixed",
          left: "15px",
          top: "1px",
          zIndex: "2",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default BrandDashboard2;
