const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/dataRoutes");
const dashboardRoutes = require('./routes/dashboard');
// const twilio = require("twilio");
const User = require("./models/data");
const axios = require("axios");
const ShopUser = require("./models/User");
const http = require("http");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menuRoutes"); // ✅ Add this line
const displayRoutes = require("./routes/displayRoutes"); // ✅ Add this line
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes"); // Ensure path is correct
const utilityRoutes = require("./routes/utilityRoute"); // Ensure path is correct

const bcrypt = require("bcryptjs");

// load enviromental variables
require("dotenv").config();

// initialize express
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/dashboard', dashboardRoutes);

// import routes (after initializing app)
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api", menuRoutes); // ✅ Add this line
app.use("/api", forgotPasswordRoutes); // Route prefix should match frontend call

// Do not change this, is it used for deployment health check,
app.use("/api", utilityRoutes); // Route prefix should match frontend call


// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error: ", err));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(express.json({ limit: "200mb" })); // Reduced size to prevent crashes
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// API route
app.use("/api", dataRoutes);
app.use("/api", displayRoutes);

// // Schema and Model
// const InfoSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   mobile: { type: String, required: true },
//   email: { type: String, required: true },
//   token: { type: Number, required: true },
// });

// const Info = mongoose.model("Info", InfoSchema);

// // Schema
// const displaySchema = new mongoose.Schema({
//   backgroundImage: String,
//   phoenixText: String,
//   pText: String,
//   royalPassText: String,
//   displayid: String,
// });
// const DisplayModel = mongoose.model("Display", displaySchema);

// const ShopSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image: String,
// });

const Shop = require("./models/Shop"); // ✅ Ensure single import
const {
  NetworkAccessProfileNetworkContextImpl,
} = require("twilio/lib/rest/supersim/v1/networkAccessProfile/networkAccessProfileNetwork");

// Twilio Credentials
const otpStore = {};


// Routes
app.post("/api/information", async (req, res) => {
  console.log("Data received:", req.body);
  const { name, mobile, email, token, shopid } = req.body;
  try {
    const newInfo = new User({ name, mobile, email, token, shopid });
    await newInfo.save();
    console.log("Data saved successfully:", newInfo);
    res.status(201).json({ message: "Data saved successfully!", newInfo });
  } catch (err) {
    console.log("Error saving data:", err);
    res.status(500).json({ message: "Error saving data", error: err });
  }
});

// Countdown Schema
const CountdownSchema = new mongoose.Schema({
  startTime: Number,
  duration: Number,
  shopId: String,
});
const Countdown = mongoose.model("Countdown", CountdownSchema);

// Start Countdown API
app.post("/api/start-countdown", async (req, res) => {
  const { duration, phoneNumber } = req.body;
  const startTime = Date.now();

  try {
    await Countdown.deleteMany({});
    const newCountdown = new Countdown({ startTime, duration });
    await newCountdown.save();

    // Emit countdown start event
    io.emit("countdown-start", { startTime, duration });

    // Twilio SMS Notification
    const countdownLink = `${process.env.REACT_APP_API_BASE_URL}/countdown`;
    await client.messages.create({
      body: `Countdown started! Track live here: ${countdownLink}`,
      from: process.env.TWILIO_PHONE,
      to: phoneNumber,
    });

    res.json({ message: "Countdown started", startTime, duration });
  } catch (error) {
    console.error("Error starting countdown:", error);
    res.status(500).json({ message: "Error starting countdown", error });
  }
});


// Get Current Countdown
app.get("/api/get-countdown", async (req, res) => {
  try {
    const countdown = await Countdown.findOne();
    res.json(countdown);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countdown", error });
  }
});



app.post("/api/stop-countdown", async (req, res) => {
  try {
    // Emit event to all connected clients
    io.emit("countdown-stop");

    // (Optional) agar DB me koi active countdown save ho raha hai to use hata do ya update karo
    await Countdown.deleteMany(); // Agar sab countdown entries delete karni ho

    res.json({ message: "Countdown stopped successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error stopping countdown", error });
  }
});





// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});




// Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  otpStore[mobile] = otp;

  try {
    const message = `Hello user, welcome to Tobuu! Your OTP for account verification is: ${otp}. Enter this code to complete the process`;
    const params = {
      apikey: process.env.MTALKZ_API_KEY,
      senderid: "TOBUU",
      number: mobile,
      tempid: process.env.MTALKZ_TEMPLATE_ID_OTP,
      message: message,
      format: "json",
    };

    const response = await axios.post(
      "https://msgn.mtalkz.com/api",
      params
      // null,
    );

    console.log("MTalkz Response:", response.data);

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp, // Optional: for testing only; remove in production
    });
  } catch (error) {
    console.error("OTP Send Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to send OTP",
      details: error.message,
    });
  }
});




// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (!otpStore[mobile]) {
    return res
      .status(400)
      .json({ error: "No OTP found for this mobile number" });
  }

  if (parseInt(otp) === otpStore[mobile]) {
    delete otpStore[mobile];
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ error: "Invalid OTP, please try again" });
  }
});



// app.post("/api/verify-otp", async (req, res) => {
//   const { mobile, otp } = req.body;
//   if (!otpStore[mobile]) {
//     return res.status(400).json({ error: "No OTP found for this mobile number" });
//   }

//   if (parseInt(otp) === otpStore[mobile]) {
//     // OTP match ho gaya, ab database me check karo
//     try {
//       const user = await User.findOne({ mobile });

//       if (user) {
//         console.log("User ID:", user._id); // ✅ Print user ID to console
//       } else {
//         console.log("Mobile number not found in database.");
//       }

//       delete otpStore[mobile];
//       return res.json({ success: true, message: "OTP verified successfully" });
//     } catch (error) {
//       console.error("Database error:", error);
//       return res.status(500).json({ error: "Server error" });
//     }
//   } else {
//     return res.status(400).json({ error: "Invalid OTP, please try again" });
//   }
// });




// Retrieve Latest Token
app.get("/api/get-token", async (req, res) => {
  try {
    console.log("---------------------------------------");
    const now = new Date();
    const latestUser = await User.findOne({
      mobile: req.query.phone,
      updatedAt: { $gte: new Date(now.getTime() - 60 * 1000 * 5) },
    }).sort({ updatedAt: -1 });

    if (!latestUser) {
      return res.status(404).json({ message: "No token found" });
    }
    res.json({ token: latestUser.token });
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).json({ message: "Error fetching token", error });
  }
});









// real message service which takes rupees
app.post("/api/send-message", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "Number is required!" });
  }
  try {
    const params = {
      apikey: process.env.MTALKZ_API_KEY,
      senderid: "TOBUU",
      number,
      // message: `🎉 Congratulations! your token number should be selected, now you can visit your counter visit your countdown undertime ${process.env.REACT_APP_API_BASE_URL}/${id}/countdown`,
      message: "Hello {#NAME#} welcome to Tobuu! Your OTP for account verification is: {#OPT#}. Enter this code to complete the process",
      templateid: process.env.MTALKZ_TEMPLATE_ID_MSG,
      format: "json",
    };
    
    const response = await axios.post(
      "https://msgn.mtalkz.com/api",
      // null,
      params
    );
    res.json({
      success: true,
      message: "Message sent successfully!",
      mtalkz_response: response.data,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send message." });
  }
});




// this service only for test
// app.post("/api/send-message", async (req, res) => {
//   const { number } = req.body;

//   if (!number) {
//     return res.status(400).json({ error: "Number is required!" });
//   }
//   try {
//     const params = {
//       apikey: process.env.MTALKZ_API_KEY,
//       senderid: "TOBUU",
//       number,
//       // message: `🎉 Congratulations! your token number should be selected, now you can visit your counter visit your countdown undertime ${process.env.REACT_APP_API_BASE_URL}/${id}/countdown`,
//       message: "Hello {#NAME#} welcome to Tobuu! Your OTP for account verification is: {#OPT#}. Enter this code to complete the process",
//       templateid: process.env.MTALKZ_TEMPLATE_ID_MSG,
//       format: "json",
//     };
//     let response;
//     if(process.env.NODE_ENV === "production"){
//      response = await axios.post(
//       "https://msgn.mtalkz.com/api",
//       // null,
//       params
//     );
//   }
//     res.json({
//       success: true,
//       message: "Message sent successfully!",
//       mtalkz_response: response?.data,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to send message." });
//   }
// });



// Send Message
// app.post("/api/send-message", async (req, res) => {
//   const { number } = req.body;

//   if (!number) {
//     return res.status(400).json({ error: "Number is required!" });
//   }

//   try {
//     const message = await client.messages.create({
//       body: `🎉 Congratulations! your token number should be selected, now you can visit your counter,
//        visit your countdown undertime  ${process.env.REACT_APP_API_BASE_URL}/${id}/countdown`,
//       from: twilioPhone,
//       to: `+91${number}`,
//     });
//     res.json({
//       success: true,
//       message: "Message sent successfully!",
//       sid: message.sid,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ success: false, error: "Failed to send message." });
//   }
// });




// // ✅ API to insert
// app.post("/api/display", async (req, res) => {
//   try {
//     const newData = new DisplayModel(req.body);
//     await newData.save();
//     res.status(201).json({ message: "Added Successfully!", newData });
//   } catch (error) {
//     console.error("Error adding:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // ✅ API to get saved data where project ID matches displayid
// app.get("/api/display/:id", async (req, res) => {
//   try {
//     const { id } = req.params; // 🔹 Get ID from URL

//     const data = await DisplayModel.findOne({ displayid: id });

//     if (!data) {
//       return res.status(404).json({ message: "No matching data found!" });
//     }

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error fetching:", error);
//     res.status(500).json({ message: "Error fetching data", error: error.message });
//   }
// });
// // ✅ API to update existing data where project ID matches displayid
// app.put("/api/display/:id", async (req, res) => {
//   try {
//     const { id } = req.params; // Get ID from URL

//     const updatedData = await DisplayModel.findOneAndUpdate(
//       { displayid: id }, // Find by displayid
//       { $set: req.body }, // Update with new data
//       { new: true } // Return updated document
//     );

//     if (!updatedData) {
//       return res.status(404).json({ message: "No matching data found to update!" });
//     }

//     res.status(200).json({ message: "Updated Successfully!", updatedData });
//   } catch (error) {
//     console.error("Error updating:", error);
//     res.status(500).json({ message: "Error updating data", error: error.message });
//   }
// });

// GET API
app.get("/api/shops", async (req, res) => {
  const shops = await Shop.find();
  res.json(shops);
});

app.get("/api/menus/:id", async (req, res) => {
  try {
    const shopss = await Menu.find({ shopId: req.params.id });
    res.json(shopss);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

app.put("/api/shops/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const hassPas = await bcrypt.hash(req.body.password, 10);
  try {
    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      { ...updatedData, password: hassPas },
      {
        new: true,
      }
    );
    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/shops/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop", error });
  }
});

// ye hai edit or save karne ke liye(fruits names, example)
app.put("/api/shops/update-menu-item/:id/:name", async (req, res) => {
  const { id, name } = req.params;
  const {
    newName,
    newDescription,
    newLink,
    newImage,
    newEmail,
    newPassword,
    newShopConPassword,
    newRole,
  } = req.body;
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const itemIndex = shop.shopss.findIndex((item) => item.name === name);
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    // Update the item
    shop.shopss[itemIndex].name = newName;
    shop.shopss[itemIndex].image = newImage;
    shop.shopss[itemIndex].link = newLink;
    shop.shopss[itemIndex].description = newDescription;
    shop.shopss[itemIndex].email = newEmail;
    shop.shopss[itemIndex].shopconpassword = newShopConPassword;
    shop.shopss[itemIndex].role = newRole;

    // ✅ Hash the new password only if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      shop.shopss[itemIndex].password = hashedPassword;
    }

    // Save to database
    await shop.save();

    res.json({ success: true, message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ye hai menu ke jo items he vo delete karne ke liye(fruits names example)
app.delete("/api/shops/delete-menu-item/:id/:name", async (req, res) => {
  const { id, name } = req.params;

  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    // Filter out the menu item to be deleted
    const updatedshopss = shop.shopss.filter(
      (item) => item.name !== name
    );

    // If no changes were made, return an error
    if (updatedshopss.length === shop.shopss.length) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // Update the shopss array
    shop.shopss = updatedshopss;

    // Save the updated document
    await shop.save();

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST API
// app.post("/shops", async (req, res) => {
//   const shop = new Shop(req.body);
//   console.log(req.body,shop);
//   await shop.save();
//     const hashedPassword = await bcrypt.hash(shop.password, 10);

//   const user = new ShopUser({
//     email: shop.email,
//     password: hashedPassword,
//     role: shop.role,
//   });

//   await user.save();
//   res.json(shop);
// });

// hashed password hai ish mai
app.post("/api/shops", async (req, res) => {
  try {
    // Pehle password hash karo
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Ab hashed password ko shop object me save karo
    const shop = new Shop({
      ...req.body,
      password: hashedPassword, // Hashed password assign kiya
    });

    await shop.save();

    // const user = new ShopUser({
    //   email: shop.email,
    //   password: hashedPassword, // Hashed password yahan bhi use ho raha
    //   role: shop.role,
    // });

    // await user.save();

    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/shops/:id", async (req, res) => {
  try {
    const shopId = req.params.id;
    const deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return res.status(404).json({ message: "Shop item not found" });
    }

    res.json({ message: "Shop item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shop item", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
