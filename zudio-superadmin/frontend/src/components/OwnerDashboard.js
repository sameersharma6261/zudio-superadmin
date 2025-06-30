import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [shops, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    title: "",
    description: "",
    image: "",
    email: "",
    password: "",
    mallconpassword: "",
    role: "",
     location: {
    country: "",
    state: "",
    city: "",
    street: "",
    latitude: Number,
    longitude: Number
  },
  });
  const [editFood, setEditFood] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("shopId");
    navigate("/");
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/shops`).then((res) => {
      setFoods(res.data);
    });
  }, []);

  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role && role !== "superadmin") {
      navigate("/");
    }
  }, [role, navigate]);

 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name.startsWith("location.")) {
    const field = name.split(".")[1];
    setNewFood((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  } else {
    setNewFood((prev) => ({ ...prev, [name]: value }));
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editFood) {
      axios
        .put(
          `${process.env.REACT_APP_API_BASE_URL}/api/shops/${editFood._id}`,
          newFood
        )
        .then((res) => {
          setFoods(
            shops.map((shop) => (shop._id === editFood._id ? res.data : shop))
          );
          setNewFood({
            title: "",
            description: "",
            image: "",
            email: "",
            password: "",
            mallconpassword: "",
            role: "",
            location: {
            country: "",
            state: "",
            city: "",
            street: "",
          },
          });
          setEditFood(null);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/shops`, newFood)
        .then((res) => {
          setFoods([...shops, res.data]);
          setNewFood({
            title: "",
            description: "",
            image: "",
            email: "",
            password: "",
            mallconpassword: "",
            role: "",
            location: {
            country: "",
            state: "",
            city: "",
            street: "",
          },
          });
        });
    }
  };

  const handleEdit = (shop) => {
  setNewFood({
    title: shop.title || "",
    description: shop.description || "",
    image: shop.image || "",
    email: shop.email || "",
    password: shop.password || "",
    mallconpassword: shop.mallconpassword || "",
    role: shop.role || "",
    location: {
      country: shop.location?.country || "",
      state: shop.location?.state || "",
      city: shop.location?.city || "",
      street: shop.location?.street || "",
    },
  });
  setEditFood(shop);
};

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/api/shops/${id}`)
      .then(() => {
        setFoods(shops.filter((shop) => shop._id !== id));
      });
  };

  console.log({ shops });

  const filteredShops = shops.filter((shop) =>
    shop?.title?.toLowerCase().includes(search.toLowerCase())
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
       margin-top: 60px;
      overflow: hidden;
      display: flex;
      align-items: center;
    }

    .scroller {
    // overflow: hidden;
    // background: red;
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
      <div className="dashboard-container">
        <h1
          style={{
            color: "white",
            fontSize: "48px",
            fontFamily: "Rajdhani, sans-serif",
            position: "fixed",
            left: "20px",
            top: "10px",
            padding: "0",
            margin: "0",
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
        <form onSubmit={handleSubmit} className="shop-form">
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={newFood.location.country}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                location: {
                  ...newFood.location,
                  country: e.target.value,
                },
              })
            }
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={newFood.location.state}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                location: {
                  ...newFood.location,
                  state: e.target.value,
                },
              })
            }
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={newFood.location.city}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                location: {
                  ...newFood.location,
                  city: e.target.value,
                },
              })
            }
          />

          <input
            type="text"
            name="street"
            placeholder="Street"
            value={newFood.location.street}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                location: {
                  ...newFood.location,
                  street: e.target.value,
                },
              })
            }
          />
          <input
            type="text"
            name="location.latitude"
            placeholder="Latitude"
            value={newFood.location.latitude}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location.longitude"
            placeholder="Longitude"
            value={newFood.location.longitude}
            onChange={handleChange}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newFood.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newFood.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={newFood.image}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Set email"
            value={newFood.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="password"
            placeholder="Set password"
            value={newFood.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mallconpassword"
            placeholder="conferm password"
            value={newFood.mallconpassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Set role"
            value={newFood.role}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editFood ? "Update Zudio" : "Add Zudio"}
          </button>
        </form>

        <div className="scroll-container">
          {filteredShops.map((shop) => (
            <div key={shop._id} className="premium-card">
              <div className="card-background">
                <img src={shop.image} alt={shop.title} className="card-image" />
              </div>

              <div className="card-content">
                <h2>{shop.title}</h2>
                <p>{shop.description}</p>
                <div className="shop-info">
                  <p>
                    <strong>Country:</strong> {shop.location?.country || "N/A"}
                  </p>
                  <p>
                    <strong>State:</strong> {shop.location?.state || "N/A"}
                  </p>
                  <p>
                    <strong>City:</strong> {shop.location?.city || "N/A"}
                  </p>
                  <p>
                    <strong>Street:</strong> {shop.location?.street || "N/A"}
                  </p>
                  <p>
                    <strong>Latitude:</strong> {shop.location?.latitude || "N/A"}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {shop.location?.longitude || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {shop.email}
                  </p>
                  {/* <p>
                      <strong>Password:</strong> {shop.password}
                    </p> */}
                  <p>
                    <strong>Mall Con Password:</strong> {shop.mallconpassword}
                  </p>
                  <p>
                    <strong>Role:</strong> {shop.role}
                  </p>
                </div>
                <div className="action-buttons">
                  <button onClick={() => navigate(`/shop/${shop._id}`)}>
                    Visit Zudio
                  </button>
                  <button onClick={() => handleEdit(shop)}>Edit</button>
                  <button onClick={() => handleDelete(shop._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

       <button
  onClick={() => navigate("/qrcode")}
  className="qr-button"
  onMouseEnter={(e) =>
    (e.target.style.transform = "skewX(-20deg) scale(1.1)")
  }
  onMouseLeave={(e) =>
    (e.target.style.transform = "skewX(-20deg)")
  }
>
  QR-Code
        </button>




        <button
  onClick={() => navigate("/branddashboard")}
  className="switch-button"
  onMouseEnter={(e) =>
    (e.target.style.transform = "skewX(-20deg) scale(1.1)")
  }
  onMouseLeave={(e) =>
    (e.target.style.transform = "skewX(-20deg)")
  }
>
  Switch To View Mode
        </button>




        <button
  onClick={handleLogout}
  className="logout-button"
>
  Logout
</button>
      </div>
      
        <style>{`

       

      .switch-button {
        padding: 10px 15px;
        border-radius: 10px;
        cursor: pointer;
        position: fixed;
        left: 25px;
        top: 85px;
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

      .qr-button {
        padding: 10px 15px;
        border-radius: 10px;
        border: 1px solid rgb(255, 255, 255);
        cursor: pointer;
        position: fixed;
        left: 192px;
        top: 85px;
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

       .search-input {
        padding: 10px;
        position: fixed;
        z-index: 2;
        border: 1px solid white;
        width: 60%;
        margin-top: 20px;
        border-radius: 5px;
        color: white;
        margin-bottom: 20px;
        background: transparent;
        font-size: 16px;
        left: 53%;
        transform: translateX(-50%);
      }

      .logout-button {
      padding: 9px;
      transform: skewX(-18deg);
      background: rgba(231, 119, 115, 0.66);
      color: #fff;
      border: 1px solid rgb(255, 255, 255);
      position: fixed;
      right: 30px;
      top: 82px;
      font-size: 15px;
      z-index: 2;
      border-radius: 7px;
      cursor: pointer;
    }

      /* ✅ Mobile Responsive View */
      @media only screen and (max-width: 600px) {
        .switch-button {
          font-size: 12px;
          padding: 8px 12px;
          top: 100px;
          left: 10px;
        }
          .qr-button {
          font-size: 12px;
          padding: 8px 12px;
          top: 100px;
          left: 145px; /* Adjusted for mobile screen */
        }
          .search-input {
        width: 250px;
        // margin: 0;
        font-size: 14px;
        left: 155px;
        top: 38px;
      }
        .logout-button {
        font-size: 12px;
        padding: 7px;
        right: 9px;
        top: 100px;
        height: 32px;
      }
      }




      /* Scrollable row */
      .scroll-container {
        display: flex;
        justify-content: start;
        align-items: center;
        overflow-x: auto;
        gap: 24px;
        width: 96%;
        height: 100vh;
        padding: 20px;
        position: relative;
        scroll-behavior: smooth;
        white-space: nowrap;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE and Edge */
      }

      .scroll-container::-webkit-scrollbar {
        display: none;
      }

      /* Premium card */
      .premium-card {
        min-width: 700px;
        // max-width: 460px;
        // width: 100%;
        height: 510px;
        border: 1px solid white;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(8px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: transform 0.4s ease, backdrop-filter 0.4s ease;
        display: inline-block;
        white-space: normal;
      }

      .premium-card:hover {
        transform: scale(1.03);
        backdrop-filter: blur(2px);
      }

      /* Image background */
      .card-background {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        z-index: 1;
        // opacity: 0.8;
      }

      .card-image {
        height: 100%;
        width: 100%;
        object-fit: cover;
        // filter: brightness(0.9) blur(1px);
        transform: scale(1.1);
      }

      /* Foreground content */
      .card-content {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 20px;
        color: #fff;
        // backdrop-filter: blur(8px);
        background: rgba(0, 0, 0, 0.45);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
      }

      .card-content h2 {
        font-size: 22px;
        font-weight: 700;
        color: rgb(255, 255, 255);
        margin-bottom: 10px;
      }

      .card-content p {
        font-size: 14px;
        margin: 4px 0;
      }

      .shop-info {
        margin-top: 10px;
      }

      /* Buttons */
      .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
      }

      .action-buttons button {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 12px;
        // background: linear-gradient(135deg, rgb(217, 222, 215), rgb(82, 49, 23));
        background: white;
        color: rgb(0, 0, 0);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .action-buttons button:hover {
        background: #fff;
        color: #111;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .premium-card {
          min-width: 380px;
          height: auto;
        }

        .card-content {
          padding: 15px;
          gap: 15px;
        }

        .card-content h2 {
          font-size: 20px;
        }

        .card-content p {
          font-size: 13px;
        }

        .action-buttons {
          flex-direction: column;
        }

        .action-buttons button {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .premium-card {
          min-width: 380px;
          max-width: 95vw;
        }

        .card-content {
          padding: 10px;
        }

        .card-content h2 {
          font-size: 18px;
        }

        .card-content p {
          font-size: 12px;
          margin: 0;
          padding: 5px;
        }
      }

        .dashboard-container {
          display: flex;
          width: 100%;
          position: absolute;
          top: 0;
          flex-direction: column;
          align-items: center;
          position: absolute;
          left: 0;
          // background: "linear-gradient(to right,rgb(0, 0, 0),rgb(148, 148, 148))",
          // background-image: url('/images/f.jpg'); 
          // background-size: cover;
          // background-position: center;
           background-attachment: fixed; /* Background ko fix karne ke liye */
          overflow: auto; /* Ensure content inside can scroll */
          min-height: 100vh;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          z-index: 1;
        }

        h3{
        margin: 10px;
        }

        h1{
        margin-top: 20px;
        }

        p{
        margin: 10px;
        overflow: hidden;
        }

        .shop-form {
          display: flex;
          width: 97%;
          justify-content: start;
          left: 25px;
          gap: 10px;
          // margin-top: 0;
          // margin-bottom: 20px;
          position: absolute;
            scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
          bottom: 60px;
          overflow-x: auto;
          z-index: 5;
        }
        .shop-form input, .shop-form button {
          padding: 10px;
          margin-left: 15px;
          // height: 20px;
          border-radius: 5px;
          transform: skew(-20deg);
          border: 1px solid #ccccc;
          background: transparent;
          text-align: center;

        }
          .shop-form button{
          color: #fff;
          
          cursor: pointer;
          background: linear-gradient(to right,rgb(254, 105, 79),rgb(254, 30, 0));
          }

        .shop-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          // min-height: 100vh;
          position: absolute;
          top: 160px;
          width: 100%;
        }


    
          @media (max-width: 677px) {
           .shop-form input, .shop-form button {
           padding: 10px;
           margin-left: 5px;
           margin-right: 5px;
           width: 100%;
           gap: 15px;
        }


      background: linear-gradient(to right, #00f2fe, #4facfe);
        }
      `}</style>

    </>
  );
};

export default OwnerDashboard;
