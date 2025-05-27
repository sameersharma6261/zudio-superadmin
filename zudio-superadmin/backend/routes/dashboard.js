const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");
const PhoenixUser = require("../models/data"); // your user model


// Helper function: increment count in a nested object path
function incrementNestedCount(obj, keys) {
  // keys is an array like [country, state, city, street]
  let current = obj;
  keys.forEach((key, index) => {
    if (!key) return;
    if (!current[key]) {
      current[key] = index === keys.length - 1 ? 0 : {};
    }
    if (index === keys.length - 1) {
      current[key]++;
    } else {
      current = current[key];
    }
  });
}


router.get("/stats", async (req, res) => {
  try {
    const { type, value } = req.query;

    let startDate, endDate;

    if (type === "day") {
      startDate = new Date(value);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (type === "month") {
      startDate = new Date(`${value}-01`);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (type === "year") {
      startDate = new Date(`${value}-01-01`);
      endDate = new Date(`${parseInt(value) + 1}-01-01`);
    }

    const shopFilter = startDate && endDate ? { createdAt: { $gte: startDate, $lt: endDate } } : {};
    const userFilter = startDate && endDate ? { createdAt: { $gte: startDate, $lt: endDate } } : {};
    const allShops = await Shop.find(shopFilter);
    const allUsers = await PhoenixUser.find(userFilter);
    const malls = allShops.filter((shop) => shop.role === "owner");
    const totalMallCount = malls.length;
    const totalUserCount = allUsers.length;
    let totalCounterCount = 0;
    const locationData = { countries: {} };

    const mallCounters = [];
    

    for (const mall of malls) {
      let mallCounter = 0;
      const counterDetails = [];

      if (Array.isArray(mall.shopss)) {
        for (const shop of mall.shopss) {
          if (shop.role === "shop") {
            // Filter counter by date
            if (startDate && endDate && !(shop.createdAt >= startDate && shop.createdAt < endDate)) continue;

            mallCounter++;
            totalCounterCount++;

            const shopIdStr = shop._id?.toString();
            const userCount = await PhoenixUser.countDocuments({ shopid: shopIdStr });

            counterDetails.push({
              shopId: shopIdStr,
              name: shop.name || "Unnamed Shop",
              userCount: userCount,
            });

            const location = mall.location || {};
            const country = location.country || "Unknown Country";
            const state = location.state || "Unknown State";
            const city = location.city || "Unknown City";
            const street = location.street || "Unknown Street";

            incrementNestedCount(locationData.countries, [country, state, city, street]);
          }
        }
      }

      mallCounters.push({
        mallId: mall._id,
        mallTitle: mall.title || `Mall ${mall._id}`,
        counterCount: mallCounter,
        location: mall.location,
        counters: counterDetails,
      });
    }

    res.json({
      totalMalls: totalMallCount,
      totalUsers: totalUserCount,
      totalCounters: totalCounterCount,
      mallCounters,
      locations: locationData,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: error.message });
  }
});






// GET Mall and Shop Information for Dashboard
router.get("/malls-info", async (req, res) => {
  try {
    const malls = await Shop.find({ role: "owner" });

    const mallDetails = malls.map((mall) => {
      console.log("Mall:", mall.title, "Shops:", mall.shopss); // debug log

      let shops = [];

      if (Array.isArray(mall.shopss)) {
        shops = mall.shopss.filter((shop) => shop && shop.role === "shop");
      }

      return {
        mallId: mall._id,
        mallName: mall.title || "Unnamed Mall",
        totalShops: shops.length,
        shopDetails: shops.map((shop) => ({
          shopId: shop._id,
          shopName: shop.name || "Unnamed Shop",
          email: shop.email || "",
          description: shop.description || "",
          link: shop.link || "",
        })),
      };
    });

    res.json({
      totalMalls: mallDetails.length,
      mallDetails,
    });
  } catch (error) {
    console.error("Error fetching mall info:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
